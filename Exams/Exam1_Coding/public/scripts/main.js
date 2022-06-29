var rhit = rhit || {};

/** globals */
rhit.variableName = "";

rhit.HpController = class {
	constructor(){
		this.housePoint = new rhit.HousePoints();
		this.selectedRadio = "g";
		
		document.querySelectorAll("input[type=radio]").forEach((element, index) => {
			element.onclick = (event) => {
				this.clearAll();
				element.checked = true;
				this.selectedRadio = element.value;
				
			};
		});

		document.querySelector("#gain").onclick = (event) => {
			
			this.housePoint.change(this.selectedRadio, parseInt(document.querySelector("#inputScore").value));
			this.updateView();
		};

		document.querySelector("#lose").onclick = (event) => {
			this.housePoint.change(this.selectedRadio, -1*parseInt(document.querySelector("#inputScore").value));
			this.updateView();
		};

		this.updateView();

	}

	clearAll(){
		const radios = document.querySelectorAll("input[type=radio]");
		radios.forEach((element, index) => {
			element.checked = false;
		});
	}

	updateView(){
		document.querySelector("#g_score").innerText = this.housePoint.g_point;
		document.querySelector("#s_score").innerText = this.housePoint.s_point;
		document.querySelector("#h_score").innerText = this.housePoint.h_point;
		document.querySelector("#r_score").innerText = this.housePoint.r_point;
	}
}

rhit.HousePoints = class {
	constructor() {
		this.g_point = 0;
		this.s_point = 0;
		this.h_point = 0;
		this.r_point = 0;

	}

	change(house, points) {
		switch (house) {
			case "g":
				this.g_point += points;
				if(this.g_point < 0) this.g_point = 0;
				break;
			case "s":
				this.s_point += points;
				if(this.s_point < 0) this.s_point = 0;
				break;
			case "h":
				this.h_point += points;
				if(this.h_point < 0) this.h_point = 0;
				break;
			case "r":
				this.r_point += points;
				if(this.r_point < 0) this.r_point = 0;
				break;
			default:
				break;
		}
	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	new this.HpController();

};

rhit.main();
