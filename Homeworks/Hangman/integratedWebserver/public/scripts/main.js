var rhit = rhit || {};
const adminApiUrl = "http://localhost:3000/api/admin/";
//Reference (Note: the Admin api tells you words.  You are an admin.):
// POST   /api/admin/add      with body {"word": "..."} - Add a word to the word list
// GET    /api/admin/words    													- Get all words
// GET    /api/admin/word/:id 													- Get a single word at index
// PUT    /api/admin/word/:id with body {"word": "..."} - Update a word at index
// DELETE /api/admin/word/:id 													- Delete a word at index

const playerApiUrl = "http://localhost:3000/api/player/";
//Reference (The player api never shares the word. It is a secret.):
// GET    /api/player/numwords    											- Get the number of words
// GET    /api/player/wordlength/:id								 		- Get the length of a single word at index
// GET    /api/player/guess/:id/:letter								  - Guess a letter in a word

rhit.AdminController = class {
	constructor() {
		// Note to students, the contructor is done.  You will be implementing the methods one at a time.
		// Connect the buttons to their corresponding methods.
		document.querySelector("#addButton").onclick = (event) => {
			const createWordInput = document.querySelector("#createWordInput");
			this.add(createWordInput.value);
			createWordInput.value = "";
		};
		document.querySelector("#readAllButton").onclick = (event) => {
			this.readAll();
		};
		document.querySelector("#readSingleButton").onclick = (event) => {
			const readIndexInput = document.querySelector("#readIndexInput");
			this.readSingle(parseInt(readIndexInput.value));
			readIndexInput.value = "";
		};
		document.querySelector("#updateButton").onclick = (event) => {
			const updateIndexInput = document.querySelector("#updateIndexInput");
			const updateWordInput = document.querySelector("#updateWordInput");
			this.update(parseInt(updateIndexInput.value), updateWordInput.value);
			updateIndexInput.value = "";
			updateWordInput.value = "";
		};
		document.querySelector("#deleteButton").onclick = (event) => {
			const deleteIndexInput = document.querySelector("#deleteIndexInput");
			this.delete(parseInt(deleteIndexInput.value));
			deleteIndexInput.value = "";
		};
	}

	add(word) {
		if (!word) {
			console.log("No word provided.  Ignoring request.");
			return;
		}
		// console.log(`TODO: Add the word ${word} to the backend`);

		// TODO: Add your code here.
		fetch(adminApiUrl+"add", {
			method:"POST",
			headers:{"Content-Type":"application/json"},
			body:JSON.stringify({"word":word})
		})
		.catch((err) => {
			console.log(err);
		});

	}

	readAll() {
		// console.log(`TODO: Read all the words from the backend, then update the screen.`);

		// TODO: Add your code here.
		fetch(adminApiUrl+"words", {
			method:"GET",
		})
		.then(response =>  response.json())
		.then(data=>{
			// Hint for something you will need later in the process (after backend call(s))
			document.querySelector("#readAllOutput").innerHTML = data.words;
		})
		.catch((err) => {
			console.log(err);
		});

		
	}

	readSingle(index) {
		if (Number.isNaN(index)) {
			console.log("No index provided.  Ignoring request.");
			return;
		}
		// console.log(`TODO: Read the word for index ${index} from the backend, then update the screen.`);

		// TODO: Add your code here.
		fetch(adminApiUrl+"word/"+index, {
			method:"GET",
		})
		.then(response =>  response.json())
		.then(data=>{	
			// Hint for something you will need later in the process (after backend call(s))
			document.querySelector("#readSingleOutput").innerHTML = data.word;
		})
		.catch((err) => {
			console.log(err);
		});

	}

	update(index, word) {
		if (Number.isNaN(index)) {
			console.log("No index provided.  Ignoring request.");
			return;
		}
		if (!word) {
			console.log("No word provided.  Ignoring request.");
			return;
		}
		// console.log(`TODO: Update the word ${word} at index ${index} on the backend.`);

		// TODO: Add your code here.
		fetch(adminApiUrl+"word/"+index, {
			method:"PUT",
			headers:{"Content-Type":"application/json"},
			body:JSON.stringify({"word":word})
		})
		.catch((err) => {
			console.log(err);
		});

	}

	delete(index) {
		if (Number.isNaN(index)) {
			console.log("No index provided.  Ignoring request.");
			return;
		}
		// console.log(`TODO: Delete the word at index ${index} from the backend.`);

		// TODO: Add your code here.
		fetch(adminApiUrl+"word/"+index, {
			method:"DELETE",
		})
		.catch((err) => {
			console.log(err);
		});

	}
}

rhit.PlayerController = class {
	constructor() {
		// Note to students, you can declare instance variables here (or later) to track the state for the game in progress.
		this._index = 0;
		this._length = 0;
		this._word_length = 0;
		this._locations = [];
		this._displayedWord = "";
		this._incorrectLetters = "";
		this._init_state = true;
		this._pressedKey = "";


		// Connect the Keyboard inputs
		const keyboardKeys = document.querySelectorAll(".key");
		for (const keyboardKey of keyboardKeys) {
			keyboardKey.onclick = (event) => {
				this.handleKeyPress(keyboardKey.dataset.key);
			};
		}
		// Connect the new game button
		document.querySelector("#newGameButton").onclick = (event) => {
			this.handleNewGame();
		}
		this.handleNewGame(); // Start with a new game.
	}

	handleNewGame() {
		// console.log(`TODO: Create a new game and update the view (after the backend calls).`);
		this._init_state = true;
		// TODO: Add your code here.
		fetch(playerApiUrl+"numwords/", {
			method:"GET",
		})
		.then(response =>  response.json())
		.then(data =>{
			this._length = data.length;
			this._index = Math.floor(Math.random() * this._length);
		})
		.then(() => {
			fetch(playerApiUrl+"wordlength/"+this._index, {
				method:"GET",
			})
			.then(response =>  response.json())
			.then(data =>{
				this._word_length = data.length;
				this.updateView();
			})
			.catch((err) => {
				console.log(err);
			});	
		})
		.catch((err) => {
			console.log(err);
		});
	}

	handleKeyPress(keyValue) {
		// console.log(`You pressed the ${keyValue} key`);

		// TODO: Add your code here.
		this._init_state = false;
		this._pressedKey = keyValue;

		fetch(playerApiUrl+"guess/"+this._index+"/"+keyValue, {
			method:"GET",
		})
		.then(response =>  response.json())
		.then(data =>{
			this._word_length = data.length;
			this._index = data.index;
			this._locations = data.locations;
			this.updateView();
		})
		.catch((err) => {
			console.log(err);
		});
	}

	updateView() {
		// console.log(`TODO: Update the view.`);
		// TODO: Add your code here.
		const keyboardKeys = document.querySelectorAll(".key");
		if(this._init_state){
			this._displayedWord = "";
			this._incorrectLetters = "";
			for(let i=0;i<this._word_length;i++){
				this._displayedWord += "_";
			}
			
			for (const keyboardKey of keyboardKeys) {
				keyboardKey.style.visibility = "initial";
			}
		}else{
			for (const keyboardKey of keyboardKeys) {
				if (keyboardKey.dataset.key == this._pressedKey) {
					keyboardKey.style.visibility = "hidden";
				}
			}

			if(this._locations.length <= 0 ){
				this._incorrectLetters += this._pressedKey;
			}else{
				for(let i=0;i<this._locations.length;i++){
					let tmp = this._locations[i];
					let front = this._displayedWord.substring(0, tmp);
					let end = this._displayedWord.substring(tmp+1, this._word_length);
					this._displayedWord = front + this._pressedKey + end;
			
				}
			}
		}

		document.querySelector("#displayWord").innerHTML = this._displayedWord;
		document.querySelector("#incorrectLetters").innerHTML = this._incorrectLetters;
	

		// Some hints to help you with updateView.
		// document.querySelector("#displayWord").innerHTML = "____";
		// document.querySelector("#incorrectLetters").innerHTML = "ABCDE";

		// const keyboardKeys = document.querySelectorAll(".key");
		// for (const keyboardKey of keyboardKeys) {
		// 	if (some condition based on keyboardKey.dataset.key) {
		// 		keyboardKey.style.visibility = "hidden";
		// 	} else {
		// 		keyboardKey.style.visibility = "initial";
		// 	}
		// }
	}
}

/* Main */
rhit.main = function () {
	console.log("Ready");
	if (document.querySelector("#adminPage")) {
		console.log("On the admin page");
		new rhit.AdminController();
	}
	if (document.querySelector("#playerPage")) {
		console.log("On the player page");
		new rhit.PlayerController();
	}
};

rhit.main();