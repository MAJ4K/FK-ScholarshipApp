const nav = document.getElementsByTagName('nav')[0];


export function changeTab(navbtn) {
	const id = navbtn.attributes.for.value;
	const tabs = document.getElementsByTagName('main');

	for (const tab of tabs) {
		tab.classList.remove('active');
		if (tab.id == id) tab.classList.add('active');
	}
}

const elmtBlender = {
	'rad-l': (data) => {
		const radio = document.createElement('input');
		const label = document.createElement('label');

		radio.type = 'radio';
		radio.classList.add('btn-check');
		radio.name = 'pageRadio'+Page.radioCounter;
		radio.id = data.id;
		radio.autocomplete = 'off';
		label.classList.add('btn',
		 `btn-outline-${(data.added)?data.added:'primary'}`);
		label.setAttribute('for',data.id);
		label.innerText = data.text;
		label.preNode = radio;
		(data.handle) ? label.id = data.handle:"";
		return label;
	},
	'default': (data) => {
		const elmt = document.createElement(data.type);
		(data.classes) ? elmt.classList.add(...data.classes.split(' ')):"";
		(data.text) ? elmt.innerText = data.text:"";
		(data.handle) ? elmt.id = data.handle:"";
		return elmt;
	}
}

export function r_Layout(objData,r_key = null){
	var elements = [];
	if (r_key){
		for (const subData of objData) {
			const elmt = (subData.type == 'rad-l') ?
				elmtBlender[subData.type](subData) :
				elmtBlender.default(subData);
			if (subData[r_key])
			for (const subelmt of r_Layout(subData[r_key],r_key)) {
				if (subelmt.preNode) elmt.appendChild(subelmt.preNode);
				elmt.appendChild(subelmt);
			};
			elements.push(elmt);
		}
	}
	return elements;
}



class Page {
	constructor(title){
		this.title = title;
		// create a page with connected nav button
		const navHTML = `
			<input type="radio" class="btn-check" name="navigation" id="${title}_nav" autocomplete="off">
			<label class="btn btn-outline-primary" for="${title}_nav">${title}</label>
		` ;
		const pageHTML = `<main class="container" id="${title}_nav"></main>`;
		nav.insertAdjacentHTML('afterbegin',navHTML);
		nav.insertAdjacentHTML('afterend',pageHTML);

		this.navbtn = [nav.children[0],nav.children[1]];
		this.page = nav.nextSibling;

		this.navbtn[0].addEventListener('click',()=>changeTab(this.navbtn[1]));
	}
	static radioCounter = 0;
}

export default class ContentPage extends Page{
	constructor(title){
		super(title);
	}

	createJumbotron(){
		const carHTML = `
		<!-- Carousel -->
		<section id="demo" class="carousel slide my-1" data-bs-ride="carousel">

			<!-- Indicators/dots -->
			<div class="carousel-indicators">
				<button type="button" data-bs-target="#demo" data-bs-slide-to="0" class="active"></button>
				<button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
				<button type="button" data-bs-target="#demo" data-bs-slide-to="2"></button>
			</div>

			<!-- The slideshow/carousel -->
			<div class="carousel-inner">
				<div class="carousel-item active">
					<img alt="Los Angeles" class="d-block w-100">
				</div>
				<div class="carousel-item">
					<img alt="Chicago" class="d-block w-100">
				</div>
				<div class="carousel-item">
					<img alt="New York" class="d-block w-100">
				</div>
			</div>

			<!-- Left and right controls/icons -->
			<button class="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
				<span class="carousel-control-prev-icon"></span>
			</button>
			<button class="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
				<span class="carousel-control-next-icon"></span>
			</button>
		</section>`;
		this.page.insertAdjacentHTML('beforeend',carHTML);

		return this.page.children[this.page.children.length - 1];
	}
	createNavStrip(params){
		Page.radioCounter += 1;
		const stripHTML = `
		<section class="d-flex flex-row flex-nowrap gap-1 navbar sticky-top p-0 bg-0 rounded-2">
		</section>`;
		this.page.insertAdjacentHTML('beforeend',stripHTML);
		const strip = this.page.children[this.page.children.length - 1];
		for (const child of r_Layout(params,'children')){
			strip.appendChild(child);};
		strip.radioNumber = Page.radioCounter;
		return strip;
	}
	createContent(){
		const contentHTML = `<section class="row m-0"></section>`;
		this.page.insertAdjacentHTML('beforeend',contentHTML);
		const container = this.page.children[this.page.children.length - 1];

		container.insertAdjacentHTML('beforeend',ContentPage.cardtypes.long);

		return container;
	}

	static cardtypes = {
		long : `
		<div class="card col-md-6">
			<div class="card-body">
				<h4 class="card-title">Card title</h4>
				<p class="card-text">Some example text. Some example text.</p>
				<a href="#" class="card-link">Card link</a>
				<a href="#" class="card-link">Another link</a>
			</div>
		</div>`
	}
}


export class FormPage extends Page {
	constructor(title){
		super(title)
	}

	createImg(){
		const bgElmt = document.createElement('span');
		const imgElmt = document.createElement('img');
		imgElmt.src = 'icons\/fklogo.png';
		imgElmt.classList.add('d-block');
		imgElmt.height = 100;
		bgElmt.classList.add(
			'rounded-circle','bg-light','mx-auto','my-1');
		bgElmt.appendChild(imgElmt);
		this.page.appendChild(bgElmt);

		return imgElmt;
	}
	createForm(params){
		const formElmt = document.createElement('form');
		const btnsElmt = document.createElement('div');
		formElmt.classList.add('container');
		btnsElmt.classList.add('mx-0','mt-1');
		this.page.appendChild(formElmt);

		const formBtns = [
			document.createElement('button'),
			document.createElement('button'),
			document.createElement('button')
		]
		formBtns[0].innerText = 'Edit';
		formBtns[0].type = 'button'
		formBtns[0].classList.add('btn','btn-warning','mt-1');
		formBtns[0].hidden = true;
		formBtns[1].innerText = 'Save';
		formBtns[1].classList.add('btn','btn-primary');
		formBtns[1].type = 'button'
		formBtns[2].innerText = 'Cancel';
		formBtns[2].classList.add('btn','btn-danger');
		formBtns[2].type = 'button'
		formBtns.forEach(element => {
			element.addEventListener('click',()=>{
				formBtns[0].hidden = btnsElmt.hidden;
				btnsElmt.hidden = !btnsElmt.hidden;
				for (const inp of formElmt.getElementsByTagName('input')) {
					inp.disabled = btnsElmt.hidden;
				}
			})
		});
		btnsElmt.append(formBtns[2],formBtns[1]);
		
		for (const group of params) {
			const keys = Object.keys(group);
			const elmt = document.createElement('div');
			elmt.classList.add('input-group','row','mx-0');
			const label = document.createElement('span');
			label.classList.add('input-group-text','col-sm-2');
			label.innerText = keys[0];
			elmt.appendChild(label);
			for (const feild of group[keys[0]]) {
				const subElmt = document.createElement('input');
				subElmt.type = (group.type) ? group.type : 'text';
				subElmt.classList.add('form-control');
				subElmt.placeholder = feild;
				elmt.appendChild(subElmt);
			}
			formElmt.appendChild(elmt);
		}
		formElmt.appendChild(btnsElmt);
		formElmt.appendChild(formBtns[0]);

		return formElmt;
	}
}