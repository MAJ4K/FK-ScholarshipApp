if ('serviceWorker' in navigator){
	navigator.serviceWorker.register(`sw.js`)
	.then(registration =>{
		console.log("SW Registered", registration);
	}).catch (err => {
		console.error("SW Registration Failed!", err);
	});
} else {
	console.error("This app is not supported");
}

const signinbtns = document.getElementById('SIGNINMODAL')
	.getElementsByTagName('button');
// const provider = new GoogleAuthProvider();
var provider = new firebase.auth.GoogleAuthProvider();

signinbtns[0].addEventListener('click', ()=>{
	firebase.auth()
	.signInWithPopup(provider)
	.then((result) => {
		/** @type {firebase.auth.OAuthCredential} */
		var credential = result.credential;

		// This gives you a Google Access Token. You can use it to access the Google API.
		var token = credential.accessToken;
		// The signed-in user info.
		var user = result.user;
		window.location.href = "application/app.html";
		// IdP data available in result.additionalUserInfo.profile.
			// ...
	}).catch((error) => {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// console.error(errorMessage);
		// The email of the user's account used.
		var email = error.email;
		// The firebase.auth.AuthCredential type that was used.
		var credential = error.credential;
		// ...
	});
});