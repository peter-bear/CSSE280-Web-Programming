/** namespace. */
var rhit = rhit || {};

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");

	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
		  // User is signed in, see docs for a list of available properties
		  const displayName =user.displayName;
		  const email = user.email;
		  const photoURL = user.photoURL;
		  const phoneNumber = user.phoneNumber;
		  const isAnonymous = user.isAnonymous;
		  const uid = user.uid;
		  console.log("The user is signed in ",uid);
		  console.log("displayName :>> ",displayName);
		  console.log("email :>> ",email);
		  console.log("photoURL :>> ",photoURL);
		  console.log("phoneNumber :>> ",phoneNumber);
		  console.log("isAnonymous :>> ",isAnonymous);
		  console.log('uid :>> ', uid);

		
		} else {
		  // User is signed out
		  console.log("There is no user signed in!");
		}
	});

	const inputEmailEl = document.querySelector("#inputEmail");
	const inputPasswordEl = document.querySelector("#inputPassword");

	document.querySelector("#signOutBtn").onclick = (event) => {
		firebase.auth().signOut().then(() => {
			// Sign-out successful.
			console.log("You are now signed out");
		}).catch((error) => {
			// An error happened.
			console.log("Sign out error");
		});
	};

	document.querySelector("#createAccountBtn").onclick = (event) => {
		firebase.auth().createUserWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value).catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log("Create account error",errorCode, errorMessage);
		});
	};

	document.querySelector("#loginBtn").onclick = (event) => {
		firebase.auth().signInWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value).catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log("Existing account log in error",errorCode, errorMessage);
		});
	};

	document.querySelector("#anonymousBtn").onclick = (event) => {
		firebase.auth().signInAnonymously().catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log("Anonymous auth error",errorCode, errorMessage);
		});
	};


	rhit.startFirebaseUI();
};

rhit.startFirebaseUI = function(){
	 // FirebaseUI config.
	 var uiConfig = {
        signInSuccessUrl: '/',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
      };

      // Initialize the FirebaseUI Widget using Firebase.
      const ui = new firebaseui.auth.AuthUI(firebase.auth());
      // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', uiConfig);
}

rhit.main();
