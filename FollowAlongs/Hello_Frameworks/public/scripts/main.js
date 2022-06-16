/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * PUT_YOUR_NAME_HERE
 */

/** namespace. */
var rhit = rhit || {};

/** globals */
rhit.counter = 0;



/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	// const buttons = document.querySelectorAll("#counterButtons button");
	// for (let i=0;i<buttons.length;i++){
	// 	const button =  buttons[i];
	// 	button.onclick = (event) => {
	// 		console.log(`You pressed:`, button);
	// 	};
	// }

	// for(const button of buttons){
	// 	button.onclick = (event) => {
	// 		// console.log(`You pressed:`, button);
	// 		const dataAmount = parseInt(button.dataset.amount);
	// 		const dataIsMultiplication = button.dataset.isMultiplication == "true";
	// 		//console.log(`Amount: ${dataAmount} Multi: ${dataIsMultiplication}`);
	// 		rhit.updateCounter(dataAmount, dataIsMultiplication);			
	// 	};
	// }

	// buttons.forEach((button) => {
	// 	button.onclick = (event) => {
	// 		console.log(`You pressed:`, button);
	// 	};
	// });

	$("#counterButtons button").click((event)=>{
		const dataAmount = $(event.target).data("amount");
		const dataIsMultiplication = !!$(event.target).data("isMultiplication");
		rhit.updateCounter(dataAmount, dataIsMultiplication);
	});

};

/** function and class syntax examples */
rhit.updateCounter = function (amount, isMultiplication) {
	/** function body */
	if(isMultiplication){
		rhit.counter *= amount;
	}else{
		rhit.counter += amount;
	}
	// document.querySelector("#counterText").innerHTML = `Count = ${rhit.counter}`;
	$("#counterText").html(`Count = ${rhit.counter}`);
};

rhit.main();
