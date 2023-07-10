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

const threadedFunctions = {
	login: loginToApp
}
self.onmessage = (e) => {threadedFunctions[e.data.type](e.data.data);};
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
	console.log("hello from sw.js");
}
