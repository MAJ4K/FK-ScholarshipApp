const nav = document.getElementsByTagName('nav')[0];
	const navbtns = nav.getElementsByTagName('label');

for (const btn of navbtns) {
	btn.addEventListener('click', () => changeTab(btn));
}

function changeTab(navbtn) {
	const id = navbtn.attributes.for.value;
	const pages = document.getElementsByTagName('main');

	for (const page of pages) {
		page.classList.remove('active');
		if (page.id == id) page.classList.add('active');
	}
}