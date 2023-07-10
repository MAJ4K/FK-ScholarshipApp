importScripts("https://www.gstatic.com/firebasejs/8.0/firebase.js");

self.addEventListener('install', e =>{
	e.waitUntil(
		caches.open('static').then(cache =>{
			return cache.addAll(["./manifest.json"]);
		})
	);
	console.log("Install!");
});

self.addEventListener('fetch', e => {
	e.respondWith(
		caches.match(e.request)
		.then(response => {
			return response || fetch(e.request);
		})
	)
});

const messageHandler = {
	login: loginToApp
}
self.onmessage = (e) => {messageHandler[e.data.type](e.data.data);};
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

const config = {
	apiKey: "AIzaSyDbID1v5io7yGBCh57hX1GxPcpHDBJdpW0",
	authDomain: "fk-tempfeedapp.firebaseapp.com",
	projectId: "fk-tempfeedapp",
	storageBucket: "fk-tempfeedapp.appspot.com",
	messagingSenderId: "999171750618",
	appId: "1:999171750618:web:b9ed2bad07e2f8051c03e3"
};
firebase.initializeApp(config);

function loginToApp() {
	firebase.auth()
	.signInWithPopup(provider)
	.then((result) => {
		/** @type {firebase.auth.OAuthCredential} */
		var credential = result.credential;

		// This gives you a Google Access Token. You can use it to access the Google API.
		var token = credential.accessToken;
		// The signed-in user info.
		var user = result.user;
		postMessage({type:"logedIn",data:result});
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
}
