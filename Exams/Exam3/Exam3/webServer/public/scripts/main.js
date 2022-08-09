var rhit = rhit || {};

rhit.GameController = class {
	constructor() {
		this._gameId = "";
		this._counter = 0;
		this._displayText = "Click new game";
		this._cheatDisplayText = "Cheat displays here";

		document.querySelector("#newGameBtn").onclick = () => {
			this.newGame(100);
		}

		document.querySelector("#makeGuessBtn").onclick = () => {
			const guess = document.querySelector("#inputNextGuess").value;
			this.guess(guess);
		
		}

		document.querySelector("#cheatBtn").onclick = () => {
			document.querySelector("#inputGameId").value = this._gameId;
			this.cheat(this._gameId);
		}
		
		this.updateView();
	}
	
	newGame(maxValue){
		fetch('/api/newgame/'+maxValue, {
			method:"POST",
		})
		.then(response =>  response.json())
		.then(data =>{
			// console.log(data);
			this._displayText = data.display;
			this._gameId = data.gameid;
			this._counter = data.counter;
			this._cheatDisplayText = "Cheat displays here";
		})
		.then(() => {
			document.querySelector("#inputNextGuess").value = "";
			document.querySelector("#inputGameId").value = "";
			this.updateView();
		})
		.catch((err) => {
			console.log(err);
		});
	}

	guess(value){
		fetch(`/api/guess/${this._gameId}/${value}`, {
			method:"PUT",
		})
		.then(response =>  response.json())
		.then(data =>{
			this._displayText = data.display;
			this._gameId = data.gameid;
			this._counter = data.counter;
		})
		.then(() => {
			this.updateView();
		})
		.catch((err) => {
			console.log(err);
		});
	}

	cheat(gameId){
		fetch(`/api/cheat/${gameId}`, {
			method:"GET",
		})
		.then(response =>  response.json())
		.then(data =>{
			this._cheatDisplayText = JSON.stringify(data);
		})
		.then(() => {
			this.updateView();
		})
		.catch((err) => {
			console.log(err);
		});
	}

	updateView() {
		document.querySelector("#guessDisplay").innerHTML = this._displayText;
		document.querySelector("#cheatDisplay").innerHTML = this._cheatDisplayText;
	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	new rhit.GameController();
};

rhit.main();
