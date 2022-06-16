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
rhit.variableName = "";

/** function and class syntax examples */
rhit.functionName = function () {
	/** function body */
};

rhit.ClassName = class {
	constructor() {

	}

	methodName() {

	}
}

// Some fetch examples. Your code can be different, just some examples.
// rhit.ApiManager = class {
// 	constructor() {}

// 	async sendScores(scores) {
// 		const url = "/api/scores";
// 		const options = {
// 			method: "PUT",
// 			headers: {
// 				"Content-Type": 'application/json'
// 			},
// 			body: JSON.stringify({
// 				"scores": scores
// 			}),
// 		};
// 		const response = await fetch(url, options);
// 		const data = await response.json();
// 		console.log("Send scores response data: ", data);
// 		return data["scores"];
// 	}

// 	async getPars() {
// 		const response = await fetch("/api/pars");
// 		const data = await response.json();
// 		console.log("Pars response data: ", data);
// 		return data["pars"];
// 	}
// }

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
};

rhit.main();
