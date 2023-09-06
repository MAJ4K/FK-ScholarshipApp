self.addEventListener('install', e =>{
	e.waitUntil(
		caches.open('static').then(cache =>{
			return cache.addAll(["./manifest.json"]);
		})
	);
});

self.addEventListener('activate', e => {
	e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
	const processRequest = () => {
		if (self.location.origin != getOriginFromUrl(e.request.url) || !credential){
			return e.request;
		}
		const myHeaders = new Headers();
		// myHeaders.append('Authorization', 'Bearer ' + credential);
		myHeaders.append('user',credential);
		return new Request(e.request,{headers: myHeaders});
	}
	e.respondWith(
		caches.match(e.request)
		.then(response => {
			return response || fetch(processRequest());
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

const getOriginFromUrl = (url) => {
  const pathArray = url.split('/');
  const protocol = pathArray[0];
  const host = pathArray[2];
  return protocol + '//' + host;
};