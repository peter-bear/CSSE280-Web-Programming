/** namespace. */
var rhit = rhit || {};

/** globals */
rhit.FB_PHOTO_COLLECTION = "photos";
rhit.FB_KEY_URL = "imgUrl";
rhit.FB_KEY_CAPTION = "caption";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.myFbManager = null;
rhit.mySingleFbManager = null;

// From https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}


rhit.ViewController = class {
	constructor() {
		document.querySelector("#submitPhoto").addEventListener("click", (event) => {
			const url = document.querySelector("#inputImageUrl").value;
			const caption = document.querySelector("#inputCaption").value;
			rhit.myFbManager.add(url, caption);

		});

		$("#addPhotoDialog").on("show.bs.modal", function (event) {
			//pre animation
			document.querySelector("#inputImageUrl").value = "";
			document.querySelector("#inputCaption").value = "";
		});
		
		$("#addPhotoDialog").on("shown.bs.modal", function (event) {
			//post animation
			document.querySelector("#inputImageUrl").focus();
		});

		// Start listening
		rhit.myFbManager.beginListening(this.updateList.bind(this));
	}

	updateList() {
		// Make a new quoteListContainer
		const newList = htmlToElement('<div id="columns"></div>');
		// Fill the quoteListContainer with quote cards using a loop
		for(let i=0; i<rhit.myFbManager.length;i++){
			const mq = rhit.myFbManager.getIndexAt(i);
			const newCard = this._createCard(mq);
			
			newCard.onclick = (event) => {
				
				// rhit.storage.setMovieQuoteId(mq.id);
				window.location.href = `/detailPage.html?id=${mq.id}`;
			};

			newList.appendChild(newCard);
		}


		const oldList = document.querySelector("#columns");
		oldList.removeAttribute("id");
		oldList.hidden = true;

		oldList.parentElement.appendChild(newList);
	}

	_createCard(photo){
		return htmlToElement(`<div class="pin">
        <img class="img-fluid" alt="Responsive image"
          src="${photo.url}">
        <p class="caption">${photo.caption}</p>
      </div>`);
	}
}

rhit.Pic = class{
	constructor(url, caption, id){
		this.url = url;
		this.caption = caption;
		this.id = id;
	}
}


rhit.FbQueueManager = class {
	constructor() {
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_PHOTO_COLLECTION);
		this._unsubscribe = null;
	}

	beginListening(changeListener){
		this._unsubscribe = this._ref.orderBy(rhit.FB_KEY_LAST_TOUCHED, "desc").limit(50).onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
			// querySnapshot.forEach((doc) => {
			// 		console.log(doc.data());
			// });
			
		});
	}

	stopListening(){
		this._unsubscribe();
	}

	add(url, caption){
		this._ref.add({
			[rhit.FB_KEY_URL] : url,
			[rhit.FB_KEY_CAPTION] : caption,
			[rhit.FB_KEY_LAST_TOUCHED] : firebase.firestore.Timestamp.now()
		})
		.then((docRef) => {
			console.log("Document written with ID: ", docRef.id);
		})
		.catch((error) => {
			console.error("Error adding document: ", error);
		});
	}

	getIndexAt(index){
		const docSnapshot = this._documentSnapshots[index];
		const mq = new rhit.Pic(docSnapshot.get(rhit.FB_KEY_URL), 
			docSnapshot.get(rhit.FB_KEY_CAPTION), 
			docSnapshot.id);
		
		return mq;
	}

	get length(){
		return this._documentSnapshots.length;
	}



}

rhit.DetailPageController = class {
	constructor() {
		document.querySelector("#submitEditPhoto").addEventListener("click", (event) => {
			const url = rhit.mySingleFbManager.url;
			const caption = document.querySelector("#inputCaption").value;
			rhit.mySingleFbManager.update(url, caption);

		});

		document.querySelector("#submitDeletePhoto").addEventListener("click", (event) => {
			rhit.mySingleFbManager.delete().then(() => {
				console.log("Document delete successfully");
				window.location.href = "/";
			})
			.catch(function(error){
				console.error("Error delete document: ", error);
			});
		});

		$("#editPhotoDialog").on("show.bs.modal", function (event) {
			//pre animation
			document.querySelector("#inputCaption").value = rhit.mySingleFbManager.caption;
		
		});
		
		$("#editPhotoDialog").on("shown.bs.modal", function (event) {
			//post animation
			document.querySelector("#inputCaption").focus();
		});

		rhit.mySingleFbManager.beginListening(this.updateView.bind(this));
	}

	updateView() {
		console.log( rhit.mySingleFbManager.url+" "+rhit.mySingleFbManager.caption);
		document.querySelector("#cardImg").src = rhit.mySingleFbManager.url;
		document.querySelector("#cardCaption").innerHTML = rhit.mySingleFbManager.caption;
	}
}



rhit.FbSingleManager = class {
	constructor(photoId) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_PHOTO_COLLECTION).doc(photoId);
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
	
	update(url, caption) {
		this._ref.update({
			[rhit.FB_KEY_URL] : url,
			[rhit.FB_KEY_CAPTION] : caption,
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

	get url(){
		return this._documentSnapshot.get(rhit.FB_KEY_URL);
	}

	get caption(){
		return this._documentSnapshot.get(rhit.FB_KEY_CAPTION);
	}
}




/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");

	if(document.querySelector("#listPage")){
		rhit.myFbManager = new rhit.FbQueueManager();
		new rhit.ViewController();
	}

	if(document.querySelector("#detailPage")){
		const photoId = new URLSearchParams(window.location.search).get("id");
		console.log(`Detail page for ${photoId}`);
		if(!photoId){
			console.log("error, no id");
			window.location.href="/";
		}

		rhit.mySingleFbManager = new rhit.FbSingleManager(photoId);
		new rhit.DetailPageController();
	}

};

rhit.main();
