var rhit = rhit || {};

rhit.FB_COLLECTION_SPELLS = "Spells";
rhit.FB_KEY_NAME = "name";
rhit.FB_KEY_DESCRIPTION = "description";
rhit.FB_KEY_RANK = "rank";
rhit.fbSpellsCollectionManager = null;

// From: https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.ListPageController = class {
	constructor() {
		document.querySelector("#submitSpell").addEventListener("click", (event) => {
			const name = document.querySelector("#inputName").value;
			const desp = document.querySelector("#inputDescription").value;
			const rank = parseInt(document.querySelector("#inputRank").value);
			rhit.fbSpellsCollectionManager.add(name, desp, rank);

		});

		$("#addSpellDialog").on("show.bs.modal", function (event) {
			//pre animation
			document.querySelector("#inputDescription").value = "";
			document.querySelector("#inputName").value = "";
			document.querySelector("#inputRank").value = "";
		});
		
		$("#addSpellDialog").on("shown.bs.modal", function (event) {
			//post animation
			document.querySelector("#inputName").focus();
		});

		rhit.fbSpellsCollectionManager.beginListening(this.updateList.bind(this));
	}


	updateList() {
		// Make a new quoteListContainer
		const newList = htmlToElement('<div id="spellListContainer"></div>');
		// Fill the quoteListContainer with quote cards using a loop
		for(let i=0; i<rhit.fbSpellsCollectionManager.length;i++){
			const spell = rhit.fbSpellsCollectionManager.getSpellAtIndex(i);
			const newCard = this._createCard(spell);
			newCard.querySelector("button").onclick = (event) => {
				console.log("You clicked delete");
				rhit.fbSpellsCollectionManager.delete(spell.id);
			};

			newList.appendChild(newCard);
		}

		const oldList = document.querySelector("#spellListContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;

		oldList.parentElement.appendChild(newList);
	}

	_createCard(spell){
		return htmlToElement(`
		<div class="mb-2 card">
			<div class="card-body">
				<div class="text-muted">Rank: ${spell.rank}</div>
				<h5 class="card-title"><span class="spell-name">${spell.name}</span>
					<button type="button" class="float-right btn">
					<i class="material-icons">delete</i>
					</button>
				</h5>
				<h6 class="card-subtitle mb-2 text-muted">${spell.description}</h6>
			</div>
		</div>
		`);
	}
}

rhit.Spell = class {
	constructor(id, name, description, rank) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.rank = rank;
	}
}

rhit.FbSpellsCollectionManager = class {
	constructor() {
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_SPELLS);
		this._unsubscribe = null;
	}

	add(name, description, rank) {
		// Add a new document with a generated id.
		this._ref.add({
			[rhit.FB_KEY_DESCRIPTION] : description,
			[rhit.FB_KEY_NAME] : name,
			[rhit.FB_KEY_RANK] : rank
		})
		.then((docRef) => {
			console.log("Document written with ID: ", docRef.id);
		})
		.catch((error) => {
			console.error("Error adding document: ", error);
		});
	}

	beginListening(changeListener) {
		this._unsubscribe = this._ref.orderBy(rhit.FB_KEY_RANK).onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
		});
	}

	stopListening() {
		this._unsubscribe();
	}

	delete(documentIdToDelete) {
		// Delete the document that has this document id.
		this._ref.doc(documentIdToDelete).delete().then(() => {
			console.log("Document delete successfully");
		})
		.catch(function(error){
			console.error("Error delete document: ", error);
		});
	}

	// Other methods as needed.

	getSpellAtIndex(index){
		const docSnapshot = this._documentSnapshots[index];
		const spell = new rhit.Spell(docSnapshot.id, 
			docSnapshot.get(rhit.FB_KEY_NAME), 
			docSnapshot.get(rhit.FB_KEY_DESCRIPTION),
			docSnapshot.get(rhit.FB_KEY_RANK));
		return spell;
	}

	get length(){
		return this._documentSnapshots.length;
	}
}


/* Main */
rhit.main = function () {
	console.log("Ready");
	if (document.querySelector("#listPage")) {
		console.log("You are on the list page. Do stuff!");
		rhit.fbSpellsCollectionManager = new rhit.FbSpellsCollectionManager();
		new rhit.ListPageController();

	}
};

rhit.main();
