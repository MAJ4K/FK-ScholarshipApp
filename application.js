const nav = document.getElementsByTagName('nav')[0];

class Page {
	constructor(title){
		this.title = title;
		// create a page with connected nav button
		const navHTML = `
			<input type="radio" class="btn-check" name="navigation" id="${title}" autocomplete="off">
			<label class="btn btn-outline-primary" for="${title}">${title}</label>
		` ;
		const pageHTML = `<main class="container" id="${title}"></main>`;
		nav.insertAdjacentHTML('afterbegin',navHTML);
		nav.insertAdjacentHTML('afterend',pageHTML);

		this.navbtn = [nav.children[0],nav.children[1]];
		this.page = nav.nextSibling;

		this.navbtn[0].addEventListener('click',()=>changeTab(this.navbtn[1]));
	}
}

export function changeTab(navbtn) {
	const id = navbtn.attributes.for.value;
	const tabs = document.getElementsByTagName('main');

	for (const tab of tabs) {
		tab.classList.remove('active');
		if (tab.id == id) tab.classList.add('active');
	}
}

export default class contentPage extends Page{

}
