var rhit = rhit || {};

rhit.FB_MOVIEQUOTE_COLLECTION = "MovieQuotes";
rhit.FB_KEY_QUOTE = "quote";
rhit.FB_KEY_MOVIE = "movie";
rhit.FB_KEY_AUTHOR = "author";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.fbMovieQuotesManager = null;
rhit.fbSingleQuoteManager = null;
rhit.fbAuthManager = null;

// From https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

rhit.ListPageController = class {
	constructor() {
		document.querySelector("#menuShowQuotes").addEventListener("click", (event) => {
			window.location.href ="/list.html";
		});

		document.querySelector("#menuShowMyQuotes").addEventListener("click", (event) => {
			window.location.href =`/list.html?uid=${rhit.fbAuthManager.uid}`;
		});

		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
		});


		document.querySelector("#submitAddQuote").addEventListener("click", (event) => {
			const quote = document.querySelector("#inputQuote").value;
			const movie = document.querySelector("#inputMovie").value;
			rhit.fbMovieQuotesManager.add(quote, movie);

		});

		$("#addQuoteDialog").on("show.bs.modal", function (event) {
			//pre animation
			document.querySelector("#inputQuote").value = "";
			document.querySelector("#inputMovie").value = "";
		});
		
		$("#addQuoteDialog").on("shown.bs.modal", function (event) {
			//post animation
			document.querySelector("#inputQuote").focus();
		});

		// Start listening
		rhit.fbMovieQuotesManager.beginListening(this.updateList.bind(this));
	}



	updateList() {
		
		// Make a new quoteListContainer
		const newList = htmlToElement('<div id="quoteListContainer"></div>');
		// Fill the quoteListContainer with quote cards using a loop
		for(let i=0; i<rhit.fbMovieQuotesManager.length;i++){
			const mq = rhit.fbMovieQuotesManager.getMovieQuoteAtIndex(i);
			const newCard = this._createCard(mq);
			
			newCard.onclick = (event) => {
				
				// rhit.storage.setMovieQuoteId(mq.id);
				window.location.href = `/moviequote.html?id=${mq.id}`;
			};

			newList.appendChild(newCard);
		}


		const oldList = document.querySelector("#quoteListContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;

		oldList.parentElement.appendChild(newList);

	}

	_createCard(movieQuote){
		return htmlToElement(`<div class="card" >
        <div class="card-body">
          <h5 class="card-title">${movieQuote.quote}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${movieQuote.movie}</h6>
        </div>
      </div>`);
	}
}

rhit.MovieQuote = class {
	constructor(id, quote, movie){
		this.id = id;
		this.quote = quote;
		this.movie = movie;
	}
}

rhit.FbMovieQuotesManager = class{
	constructor(uid){
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_MOVIEQUOTE_COLLECTION);
		this._unsubscribe = null;
		this._uid = uid;
	}

	add(quote, movie){
		// Add a new document with a generated id.
		this._ref.add({
			[rhit.FB_KEY_QUOTE] : quote,
			[rhit.FB_KEY_MOVIE] : movie,
			[rhit.FB_KEY_AUTHOR] : rhit.fbAuthManager.uid,
			[rhit.FB_KEY_LAST_TOUCHED] : firebase.firestore.Timestamp.now()
		})
		.then((docRef) => {
			console.log("Document written with ID: ", docRef.id);
		})
		.catch((error) => {
			console.error("Error adding document: ", error);
		});
	}

	beginListening(changeListener){
		let query = this._ref.orderBy(rhit.FB_KEY_LAST_TOUCHED, "desc").limit(50);

		if(this._uid){
			query = query.where(rhit.FB_KEY_AUTHOR,"==", this._uid);
		}

		this._unsubscribe = query.onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
			// querySnapshot.forEach((doc) => {
			// 	console.log(doc.data());
			// });
		});
	}

	stopListening(){
		this._unsubscribe();
	}

	// update(id, quote, movie){

	// }

	// delete(id){

	// }

	get length(){
		return this._documentSnapshots.length;
	}

	getMovieQuoteAtIndex(index){
		const docSnapshot = this._documentSnapshots[index];
		const mq = new rhit.MovieQuote(docSnapshot.id, 
			docSnapshot.get(rhit.FB_KEY_QUOTE), 
			docSnapshot.get(rhit.FB_KEY_MOVIE));
		return mq;
	}

}

rhit.DetailPageController = class {
	constructor() {
		document.querySelector("#submitEditQuote").addEventListener("click", (event) => {
			const quote = document.querySelector("#inputQuote").value;
			const movie = document.querySelector("#inputMovie").value;
			rhit.fbSingleQuoteManager.update(quote, movie);

		});

		document.querySelector("#submitDeleteQuote").addEventListener("click", (event) => {
			rhit.fbSingleQuoteManager.delete().then(() => {
				console.log("Document delete successfully");
				window.location.href = "/list.html";
			})
			.catch(function(error){
				console.error("Error delete document: ", error);
			});
		});

		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
		});

		$("#editQuoteDialog").on("show.bs.modal", function (event) {
			//pre animation
			document.querySelector("#inputQuote").value = rhit.fbSingleQuoteManager.quote;
			document.querySelector("#inputMovie").value = rhit.fbSingleQuoteManager.movie;
		});
		
		$("#editQuoteDialog").on("shown.bs.modal", function (event) {
			//post animation
			document.querySelector("#inputQuote").focus();
		});



		rhit.fbSingleQuoteManager.beginListening(this.updateView.bind(this));
	}

	updateView() {
		document.querySelector("#cardQuote").innerHTML = rhit.fbSingleQuoteManager.quote;
		document.querySelector("#cardMovie").innerHTML = rhit.fbSingleQuoteManager.movie;

		console.log(rhit.fbSingleQuoteManager.author+" "+rhit.fbAuthManager.uid);


		if(rhit.fbSingleQuoteManager.author == rhit.fbAuthManager.uid){
			document.querySelector("#menuEdit").style.display = "flex";
			document.querySelector("#menuDelete").style.display = "flex";
		}

	}
}
   

rhit.FbSingleQuoteManager = class {
	constructor(movieQuoteId) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_MOVIEQUOTE_COLLECTION).doc(movieQuoteId);
	}
	
	beginListening(changeListener) {
		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				this._documentSnapshot = doc;
				console.log("Document data:", doc.data());
				changeListener();
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
				// window.location.href ="/";
			}
		});
	}

	stopListening() {
		this._unsubscribe();
	}
	
	update(quote, movie) {
		this._ref.update({
			[rhit.FB_KEY_QUOTE] : quote,
			[rhit.FB_KEY_MOVIE] : movie,
			[rhit.FB_KEY_LAST_TOUCHED] : firebase.firestore.Timestamp.now()
		})
		.then(() => {
			console.log("Document update with ID: ", docRef.id);
		})
		.catch(function(error){
			console.error("Error adding document: ", error);
		});
	}
	
	delete() {
		return this._ref.delete();
	}

	get quote(){
		return this._documentSnapshot.get(rhit.FB_KEY_QUOTE);
	}

	get movie(){
		return this._documentSnapshot.get(rhit.FB_KEY_MOVIE);
	}

	get author(){
		return this._documentSnapshot.get(rhit.FB_KEY_AUTHOR);
	}
}


// rhit.storage = rhit.storage || {};
// rhit.storage.MOVIEQUOTE_ID_KEY = "movieQuoteId";
// rhit.storage.getMovieQuoteId = function () {
// 	const mqId = sessionStorage.getItem(rhit.storage.MOVIEQUOTE_ID_KEY);
// 	if(!mqId){
// 		console.log("No id");
// 	}
// 	return mqId;
// }

// rhit.storage.setMovieQuoteId = function (movieQuoteId) {
// 	sessionStorage.setItem(rhit.storage.MOVIEQUOTE_ID_KEY, movieQuoteId);
// }

rhit.LoginPageController = class{
	constructor(){
		document.querySelector("#rosefireButton").onclick = (event) => {
			rhit.fbAuthManager.signIn();
		};
	}
}

rhit.FbAuthManager = class{
	constructor(){
		this._user = null;
	}

	beginListening(changeListener){
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			changeListener();
		});
	}

	signIn(){
		// Please note this needs to be the result of a user interaction
		// (like a button click) otherwise it will get blocked as a popup
		Rosefire.signIn("ce14e6b6-d066-450f-ab98-6b0a65efd5e9", (err, rfUser) => {
			if (err) {
				console.log("Rosefire error!", err);
			return;
			}
			console.log("Rosefire success!", rfUser);
			
			// TODO: Use the rfUser.token with your server.
			firebase.auth().signInWithCustomToken(rfUser.token).catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.error("Customer auth error",errorCode, errorMessage);
			});
		});
  
	}

	signOut(){
		firebase.auth().signOut().catch((error) => {
			// An error happened.
			console.log("Sign out error");
		});
	}

	get isSignedIn(){
		return !!this._user;
	}

	get uid(){
		return this._user.uid;
	}
}


rhit.checkForRedirects = function(){
	if(document.querySelector("#loginPage") && rhit.fbAuthManager.isSignedIn){
		window.location.href ="/list.html";
	}

	if(!document.querySelector("#loginPage") && !rhit.fbAuthManager.isSignedIn){
		window.location.href ="/";
	}
};

rhit.initializePage = function(){
	if(document.querySelector("#listPage")){
		const uid = new URLSearchParams(window.location.search).get("uid");
		console.log(`list page for ${uid}`);

		rhit.fbMovieQuotesManager = new rhit.FbMovieQuotesManager(uid);
		new rhit.ListPageController();
	}

	if(document.querySelector("#detailPage")){
		// const movieQuoteId = rhit.storage.getMovieQuoteId();
		const movieQuoteId = new URLSearchParams(window.location.search).get("id");
		console.log(`Detail page for ${movieQuoteId}`);
		if(!movieQuoteId){
			console.log("error, no id");
			window.location.href="/";
		}
		rhit.fbSingleQuoteManager = new rhit.FbSingleQuoteManager(movieQuoteId);
		new rhit.DetailPageController();

	}

	if(document.querySelector("#loginPage")){
		
		new rhit.LoginPageController();

	}
};

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.fbAuthManager.beginListening(() => {
		rhit.checkForRedirects();
		rhit.initializePage();
	});


	

	//Temp code for Read and Add
	// const ref = firebase.firestore().collection("MovieQuotes");
	// ref.onSnapshot((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //         console.log(doc.data());
    //     });
    // });
	
	// ref.add({
	// 	quote: "My second test",
	// 	movie: "My second movie",
	// 	lastTouched: firebase.firestore.Timestamp.now()
	// });


};

rhit.main();
