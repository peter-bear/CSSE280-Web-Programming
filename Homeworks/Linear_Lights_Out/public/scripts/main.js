/** namespace. */
var rhit = rhit || {};

rhit.PageController = class{
	constructor(){
		this.game = new rhit.Game();
		this.title = document.querySelector("#gameTitle");
	
		this.lightBtns = document.querySelectorAll(".lightBtn");
		this.lightBtns.forEach((btn, index) => {
			btn.onclick = (event) => {
				this.game.pressButtonAtIndex(index);
				this.updateView();
			};
		});

		document.querySelector("#newGame").onclick = (event) => {
			this.game = new rhit.Game();
			this.updateView();
		};
		

		this.updateView();
	}

	//update button, title views
	updateView(){
		this.lightBtns.forEach((btn, index) => {
			if(this.game.getButtonValue(index) == rhit.Game.LIGHT_STATE.OFF){
				btn.innerHTML = "0";
				btn.style.color = "white";
				btn.style.background = "rgb(53, 53, 53)";
			}else if(this.game.getButtonValue(index) == rhit.Game.LIGHT_STATE.ON){
				btn.innerHTML = "1";
				btn.style.color = "black";
				btn.style.background = "rgb(248, 192, 46)";
			}
		});

		let cnt = this.game.getCountNum();
		if(cnt == 1){
			this.title.innerHTML = `You have taken ${cnt} move so far`;
		}
		else if(cnt > 1){
			this.title.innerHTML = `You have taken ${cnt} moves so far`;
		}

		if(this.game.isGameWon()){
			if(cnt == 1){
				this.title.innerHTML = `You won in ${cnt} move!`;
			}else if(cnt > 1){
				this.title.innerHTML = `You won in ${cnt} moves!`;
			}
			
		}

		if(cnt == 0){
			this.title.innerHTML = "Make the buttons match";
		}
	}

}

rhit.Game = class{
	static NUM_BUTTONS = 7;
	static LIGHT_STATE = {
		ON: "1",
		OFF: "0"
	}

	constructor(){
		this.buttonValues = [];
		this.numPresses = 0;
		for(let k = 0; k < rhit.Game.NUM_BUTTONS; k++){
			this.buttonValues.push(rhit.Game.LIGHT_STATE.OFF);
		}

		this.randomizeButtons();
	}

	//start from win state and random change the button values
	randomizeButtons(){
		for(let k = 0; k < rhit.Game.NUM_BUTTONS*10 ; k++ ){
			
			this.pressButtonAtIndex(Math.floor(Math.random() * this.buttonValues.length), true);
		}

		if(this.isGameWon()){
			this.pressButtonAtIndex(Math.floor(Math.random() * this.buttonValues.length), true);
		}

		this.numPresses = 0;

	}

	//check whether win
	isGameWon(){
		let on_cnt= 0;
		let off_cnt = 0;
		for(const buttonValue of this.buttonValues){
			if(buttonValue == rhit.Game.LIGHT_STATE.ON) {
				on_cnt++;
			}
			else if(buttonValue == rhit.Game.LIGHT_STATE.OFF) {
				off_cnt++;
			}
		}

		return on_cnt == rhit.Game.NUM_BUTTONS || off_cnt == rhit.Game.NUM_BUTTONS;
	}

	//change button value
	pressButtonAtIndex(index, isSetup = false){
		if(this.isGameWon() && !isSetup)
			return;
		if(index == 0){
			this._changeButtonValue(index+1);
		}else if(index == rhit.Game.NUM_BUTTONS-1){
			this._changeButtonValue(index-1);
		}else{
			this._changeButtonValue(index-1);
			this._changeButtonValue(index+1);
		}
		
		this._changeButtonValue(index);
		this.numPresses += 1;
		
		
		
	}

	// change neighbor buttons
	_changeButtonValue(buttonIndex){
		if(this.buttonValues[buttonIndex] == rhit.Game.LIGHT_STATE.ON){
			this.buttonValues[buttonIndex] = rhit.Game.LIGHT_STATE.OFF;
		}else if(this.buttonValues[buttonIndex] == rhit.Game.LIGHT_STATE.OFF){
			this.buttonValues[buttonIndex] = rhit.Game.LIGHT_STATE.ON;
		}
	}

	//get button value at specific index
	getButtonValue(buttonIndex){
		return this.buttonValues[buttonIndex];
	}
	
	//get count number
	getCountNum(){
		return this.numPresses;
	}
}



/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	new rhit.PageController();
};

rhit.main();
