/** namespace. */
var rhit = rhit || {};

rhit.PageController = class{
	constructor(){
		this.game = new rhit.Game();

		const squares = document.querySelectorAll(".square");

		squares.forEach((square, index) => {
			square.onclick = (event) => {
				this.game.pressedButtonAtIndex(index);
				this.updateView();
			}
		});

		document.querySelector("#newGameButton").onclick = (event) => {
			this.game = new rhit.Game();
			this.updateView();
		}

		this.updateView();
	}

	updateView(){
		const squares = document.querySelectorAll(".square");
		squares.forEach((square, index) => {
			square.innerHTML = this.game.getMarkAtIndex(index);
		});
		document.querySelector("#gameStateText").innerHTML = this.game.state;
	}
};

rhit.Game = class{
	static Mark = {
		X:"X",
		O: "O",
		NONE: " "
	}

	static State = {
		X_TURN : "X's Turn",
		O_TURN : "O's Turn",
		X_WIN : "X Wins!",
		O_WIN : "O Wins!",
		TIE: "Tie Game"
	}

	constructor(){
		this.board = [];
		this.state = rhit.Game.State.X_TURN;
		for(let k = 0; k <9;k++) this.board.push(rhit.Game.Mark.NONE);
		
	}

	pressedButtonAtIndex(buttonIndex){
		if(this.state == rhit.Game.State.X_WIN ||
			this.state == rhit.Game.State.O_WIN ||
			this.state == rhit.Game.State.TIE  ){
				return;
		}
		if(this.board[buttonIndex] == rhit.Game.Mark.NONE){
			if(this.state == rhit.Game.State.X_TURN){
				this.board[buttonIndex] = rhit.Game.Mark.X;
				this.state = rhit.Game.State.O_TURN;
			}
			else if(this.state == rhit.Game.State.O_TURN){
				this.board[buttonIndex] = rhit.Game.Mark.O;
				this.state = rhit.Game.State.X_TURN;
			}
		}

		this._checkForGameOver();
		// console.log(this.board," ",this.state);
	
	}

	_checkForGameOver(){
		//check for a tie game
		if(!this.board.includes(rhit.Game.Mark.NONE)){
			this.state = rhit.Game.State.TIE;
		}

		const linesOf3 = [];
		linesOf3.push(this.board[0] + this.board[1] + this.board[2]);
		linesOf3.push(this.board[3] + this.board[4] + this.board[5]);
		linesOf3.push(this.board[6] + this.board[7] + this.board[8]);
		
		linesOf3.push(this.board[0] + this.board[3] + this.board[6]);
		linesOf3.push(this.board[1] + this.board[4] + this.board[7]);
		linesOf3.push(this.board[2] + this.board[5] + this.board[8]);

		linesOf3.push(this.board[0] + this.board[4] + this.board[8]);
		linesOf3.push(this.board[2] + this.board[4] + this.board[6]);
		
		for(const lineOf3 of linesOf3){
			if(lineOf3 == "XXX"){
				this.state = rhit.Game.State.X_WIN;
			}else if(lineOf3 == "OOO"){
				this.state = rhit.Game.State.O_WIN;
			}
		}


	}

	getMarkAtIndex(buttonIndex){
		return this.board[buttonIndex];
	}

	getState(){
		return this.state;
	}

};

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	new rhit.PageController();
};

rhit.main();
