self.addEventListener('install', e =>{
	e.waitUntil(
		caches.open('static').then(cache =>{
			return cache.addAll(["./manifest.json"]);
		})
	);
});

self.addEventListener('activate', e => {
	clients.claim();
});

self.addEventListener('fetch', e => {
	e.respondWith(
		caches.match(e.request)
		.then(response => {
			return response || fetch(e.request);
		})
	);
});

let credential = undefined;

const messageHandler = {
	login: (e) => {
		credential = e.data.data;
		e.source.navigate('/application/app.html');
	}
}

self.onmessage = (e) => {messageHandler[e.data.type](e)}