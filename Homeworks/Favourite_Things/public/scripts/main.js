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

	$("#counterButtons button").click((event)=>{
		const dataAmount = $(event.target).data("amount");
		const dataIsMultiplication = !!$(event.target).data("isMultiplication");
		rhit.updateCounter(dataAmount, dataIsMultiplication);
	});

	$("#colorButtons button").click((event)=>{
		const color = $(event.target).data("name");
		rhit.updateColor(color);
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
	$("#counterText").html(`${rhit.counter}`);
};


rhit.updateColor = function(color){
	$("#favoriteColorBox").css("background-color", color);
	console.log(color);
	$("#favoriteColorBox").html(color);
}

rhit.main();
