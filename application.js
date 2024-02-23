//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
// This whole thing needs comments atleast where there are 	//
//					classes & Functions						//
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////


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
		(data.data_bs_toggle) ? elmt.setAttribute("data-bs-toggle", data.data_bs_toggle):"";
		(data.data_bs_target) ? elmt.setAttribute("data-bs-target", data.data_bs_target):"";
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

function cardElmt(data,params) {
	if(data == 'None') return '';
	var content = '';
	if (params.keys) for (const key of params.keys) {
		(!/N\/A|None/.test(data[key])) ?
			content += `<${params.subtag}>${data[key]}</${params.subtag.split(' ')[0]}>`:'';
	}
	if (!content) content = data ;
	var html = `<${params.tag} class='${params.classes}'>${content}</${params.tag.split(' ')[0]}>`
	return html
}


//Page class creates a main page 
//and a btn to navigate to the page
//!!! THIS IS A VIRTUAL CLASS 
class Page {
	constructor(title,navlocation){
		this.title = title;
		// create a nav button and place it at the location
		const navHTML = `
			<input type="radio" class="btn-check" name="navigation" id="${title}_nav" autocomplete="off">
			<label class="btn btn-outline-primary" for="${title}_nav">${title}</label>
		` ;
		navlocation.insertAdjacentHTML('afterbegin',navHTML);
		this.navbtn = [navlocation.children[0],navlocation.children[1]];

		// create a page and place it in the body of document
		const pageHTML = `<main class="container" id="${title}_nav"></main>`;
		document.body.insertAdjacentHTML('beforeend',pageHTML);
		this.page = document.body.lastChild;

		this.navbtn[0].addEventListener('click',()=>changeTab(this.navbtn[1]));
	}
	static radioCounter = 0;
}

//ContentPage allows the creation of content.
export default class ContentPage extends Page{
	constructor(title,navlocation){
		super(title,navlocation);
	}

	createJumbotron(params){
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
		// add to Page.radioCounter to avoid crossing radios
		Page.radioCounter += 1;
		const stripHTML = `
		<section class="d-flex flex-row flex-nowrap gap-1 navbar sticky-top p-0 bg-0 rounded-2">
		</section>`;
		this.page.insertAdjacentHTML('beforeend',stripHTML);
		const strip = this.page.children[this.page.children.length - 1];
		//r_ to denote recursive calls 
		for (const child of r_Layout(params,'children')){
			strip.appendChild(child);};
		strip.radioNumber = Page.radioCounter;
		return strip;
	}
	createContent(data,params){
		const contentHTML = `<section class="row m-0"></section>`;
		this.page.insertAdjacentHTML('beforeend',contentHTML);
		const container = this.page.children[this.page.children.length - 1];

		for (const item of data) {
			container.insertAdjacentHTML('beforeend',ContentPage.cardtypes.long(item,params));
		}

		return container;
	}

	static cardtypes = {
		long : (data,params) => {
			const title = (params.title) ? cardElmt(data[params.title],{tag:'h4 class="card-title"'}):'';
			const badge = (params.badge) ? cardElmt(data[params.badge],{tag:'div class="badge text-dark bg-primary rounded-pill"'}):'';
			var attributes = '';
			var customElements = '';
			for (var key of Object.keys(params)) {
				if (/title|badge|attributes/.test(key)) continue;
				customElements += cardElmt(data,params[key]) + '\n';
			}
			for (const attrib of params.attributes) {
				if (!/\b(?:No|no|None|none|N\/A)\b/.test(data[attrib])){
					attributes += `${attrib}="${data[attrib]}"`;
				}
			}
			return `
			<div class="card col-md-6" ${attributes}>
				<div class="card-body">
					${title}
					${badge}
					${customElements}
				</div>
			</div>`
		}
	}
}

//FormPage allows the addition of a form to the document
// in page form
export class FormPage extends Page {
	constructor(title,navlocation){
		super(title,navlocation);
	}

	// adds an image to the content of the page
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
	// creates a form for the page
	// !!SHOULD DELETE PREVIOUS FORM!!
	createForm(params){
		const formElmt = document.createElement('form');
		const btnsElmt = document.createElement('div');
		formElmt.classList.add('container');
		btnsElmt.classList.add('mx-0','mt-1');
		this.page.appendChild(formElmt);

		const formBtns = {
			edit:document.createElement('button'),
			save:document.createElement('button'),
			cancel:document.createElement('button')
		};
		this.formBtns = formBtns;
		formBtns.edit.innerText = 'Edit';
		formBtns.edit.type = 'button'
		formBtns.edit.classList.add('btn','btn-warning','mt-1');
		formBtns.edit.hidden = true;
		formBtns.save.innerText = 'Save';
		formBtns.save.classList.add('btn','btn-primary');
		formBtns.save.type = 'button'
		formBtns.cancel.innerText = 'Cancel';
		formBtns.cancel.classList.add('btn','btn-danger');
		formBtns.cancel.type = 'button'
		for (const element of Object.values(formBtns)) {
			element.addEventListener('click',()=>{
				formBtns.edit.hidden = btnsElmt.hidden;
				btnsElmt.hidden = !btnsElmt.hidden;
				for (const inp of formElmt.getElementsByTagName('input')) {
					inp.disabled = btnsElmt.hidden;
				}
			})
		}
		btnsElmt.append(formBtns.cancel,formBtns.save);
		
		formSetup(formElmt,params);
		formElmt.appendChild(btnsElmt);
		formElmt.appendChild(formBtns.edit);
		formBtns.cancel.click();

		return formElmt;
	}
}


export class Modal{
	constructor(title,btnMode = 1){
		const id = title.replace(" ","_").replace(/[\W]/gi,"");
		
		const btnsHtml = `
			${(btnMode & 1) ? `<button type="button" class="btn btn-primary">Apply</button>`:''}
			${(btnMode & 2) ? `<button type="button" class="btn btn-danger">Delete</button>`:''}
			${(btnMode & 4) ? `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>`:''}`
		const modalHtml = `
		<figure class="modal" id="${id}_Modal">
		<div class="modal-dialog"><div class="modal-content">

			<!-- Modal Header -->
			<div class="modal-header">
				<h4 class="modal-title">${title}</h4>
				<input type="button" class="btn-close" data-bs-dismiss="modal">
			</div>

			<!-- Modal footer -->
			<div class="modal-footer">
				${btnsHtml}
			</div>

		</div></div>
		</figure>`;
		document.body.insertAdjacentHTML('beforeend',modalHtml);

		this.element = document.body.children[document.body.children.length - 1];
	}

	close(){
		const btn = this.element.getElementsByClassName('btn-close')[0];
		btn.click();
	}

	createForm(params){
		this.form = document.createElement('form');
		this.form.classList.add('modal-body');
		const header = this.element.getElementsByClassName('modal-header')[0];
		header.insertAdjacentElement('afterend',this.form);

		formSetup(this.form,params);
		return this.form;
	}
}

// sets up a form for Modal and Page use
function formSetup(form,params) {
	for (const group of params) {
		const keys = Object.keys(group);
		const elmt = document.createElement('div');
		(group.type == 'rad-l') ? 
			elmt.classList.add('btn-group') :
			elmt.classList.add('input-group', 'mx-0');
		const label = document.createElement('span');
		label.classList.add('input-group-text','col-sm-2');
		label.innerText = keys[0];
		(keys[0][0] != '_') ? elmt.appendChild(label):'';
		for (const feild of group[keys[0]]) {
			const subtype = (group.type) ? group.type : 'text';
			const require = (group.required) ? 'required':'';
			var subElmtHtml = `
				<input type="${subtype}" name="${keys[0]}" class="form-control" placeholder="${feild}" ${require}>`;
			if (group.type == 'rad-l'){
				const feildb = feild.split('.');
				const labelitem = (feildb[1] == 'png') ? `<img src="icons/${feild}" class="form-icons">` : feild;
				subElmtHtml = `
					<input type="checkbox" class="btn-check" name="pageRadio1" id="${feildb[0]}" autocomplete="off">
					<label class="btn btn-outline-secondary" for="${feildb[0]}">${labelitem}</label>`;
			}
			if (group.type == 'double-range'){
				subElmtHtml = `<custom-input type="double-range" name="${keys[0]}" range="${feild}"></custom-input>`
			}
			elmt.insertAdjacentHTML('beforeend',subElmtHtml);
		}
		form.appendChild(elmt);
	}
}
