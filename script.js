import CPage,{FormPage as FPage, Modal} from '/application.js'

class Profile {
	constructor(){
		this.id = '320fjwe2w3';
		this.name = ['',''];
		this.email = [''];
		this.level = [''];
		this.major = [''];
		this.data = {};
	}

	getdata(key){return this.data[key];}
	overwriteData(key,item){this.data[key] = item;}
}

const user = new Profile();
const nav = document.getElementsByTagName('nav')[0];

const profPage = new FPage('Profile',document.getElementById('UserNavs'));
const schPage = new CPage('Scholarships',document.getElementById('UserNavs'));
const testPage = new CPage('test',document.getElementById('UserNavs'));

schPage.navbtn[0].click();


const stripparams = [
	{
		type:'section',
		classes: 'd-flex flex-row flex-nowrap gap-1 overflow-auto',
		children:[
			{type:'div',classes:'btn-group',handle:'primary_filters',
			children:[
				{type:'rad-l', id:"Recomended", text:"Recomended"},
				{type:'rad-l', id:"Applied", text:"Applied"},
				{type:'rad-l', id:"Favorites", text:"Favorites"},
				{type:'rad-l', id:"AllScholar", text:"All"}
			]},
			{type:'div',classes:'btn-group',handle:'secondary_filters',
			children:[]}
		]
	},
	{type:'div', classes:'btn-group p-0 m-0', handle:'filter_fncts',
	children:[
		{type:'button',classes:'btn btn-danger',text:'del', data_bs_toggle:"modal", data_bs_target:"#Delete_Filter_Modal"},
		{type:'button',classes:'btn btn-primary',text:'add', data_bs_toggle:"modal", data_bs_target:"#Add_Filter_Modal"}
	]}
]

const formparams = [
	{"Name":['First','Last']},
	{"Email":["example@email.com"], type: 'email'},
	{"Level":['']},
	{"Major":["Computer Engineering"]}
]

const schParams = {
	title:'Title',badge:'Amount',
	Dategroup:{tag:'span', subtag:'div class="infoItem"', keys:['Opens','Due']},
	IMGgroup:{tag:'div class="btn-group text-dark bg-secondary icon-group"'},
	infoGroup:{tag:'span', subtag:'div class="infoItem"',
		keys:['Major Type','Grade Eligibility','GPA','Geography','Special Eligibility',]},
	attributes:['Opens','Due','Renewable','Service/\ncharacter-based','Academic Merit-based','Need-based','Gender-based','Must identify as Black/ minority','link'],
};


let debuglist = [];
debuglist.push(schPage.createJumbotron());
debuglist.push(schPage.createNavStrip(stripparams));
// debuglist.push(testPage.createContent());
debuglist.push(profPage.createImg());
debuglist.push(profPage.createForm(formparams));


fetch('./Sheet1.json')
    .then((response) => response.json())
    .then((json) => {
		debuglist.push(schPage.createContent(json,schParams));
	})
	.then(()=>{
		const cardIconGroups = 
			document.getElementsByClassName('icon-group');
		const IconsTemplate = [
			document.createElement('img'),
			document.createElement('img'),
			document.createElement('img'),
			document.createElement('img'),
			document.createElement('img'),
			document.createElement('img'),
			document.createElement('img')
		]
		IconsTemplate[0].src = 'icons/renewable.png';
		IconsTemplate[1].src = 'icons/character.png';
		IconsTemplate[2].src = 'icons/merit.png';
		IconsTemplate[3].src = 'icons/need.png';
		IconsTemplate[4].src = 'icons/minority.png';
		IconsTemplate[5].src = 'icons/male.png';
		IconsTemplate[6].src = 'icons/female.png';
		for (const iconGroup of cardIconGroups) {
			const dup = [];
			for (const temp of IconsTemplate) {
				dup.push(temp.cloneNode(true))
			}
			iconGroup.innerHTML = '';
			iconGroup.append(...dup);
		}
	});


console.debug(debuglist);


/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////Scholarship Filters/////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
const filters_nav = {
	primaries: document.getElementById('primary_filters'),
	secondaries: document.getElementById('secondary_filters'),
	actions: document.getElementById('filter_fncts').children,
}

const filterparams = [
	{"Label":[''], 'required':true},
	{"_IMGbtn":[
		'renewable.png','character.png','merit.png',
		'need.png','minority.png','male.png','female.png'], type: 'rad-l'},
	{"Window":['',''], type: 'range'},
	{"GPA":[''], type: 'range'},
	{"Major":["Computer Engineering"]},
	{"Key Words":["STEM, senior, sports"]}
]

const filterModal = new Modal('Add Filter');
filterModal.createForm(filterparams);
const filterDelPrompt = new Modal('Delete Filter?',6);

const filterModalbtns = [];
filterModalbtns.push(...filterModal.element
	.getElementsByClassName('modal-footer')[0]
	.getElementsByTagName('button')
)
filterModalbtns.push(...filterDelPrompt.element
	.getElementsByClassName('modal-footer')[0]
	.getElementsByTagName('button')
)

//"Submit" add filter form after clicking Apply
filterModalbtns[0].addEventListener('click',()=>{
	const form = filterModal.form
	const feilds = form.getElementsByTagName('input');
	const filterdata = user.getdata('filters') || {};
	
	// Validate form feilds
	var isValid = true;
	const invalidateForm = (errtext,fid = 0) => {
		feilds[fid].classList.add('is-invalid');
		isValid = false;
		console.log(errtext);
	}
	for (const filter of Object.keys(filterdata)) {
		if (filter == feilds[0].value){
			invalidateForm("There is already a filter with that label");
			break;
		}
	}
	if(!/^[\w.-]+$/gi.test(feilds[0].value)){
		invalidateForm(`Improper Formatting: 
		label must contain 1 or more characters
		Allowed Characters = [0-9][a-z][A-Z][_]
		`)
	}
	if(!isValid){return}

	//assemble new filter data
	const filterAssembly = {}
	const addvalue = (name,value) => {
		if(filterAssembly[name]) 
			filterAssembly[name].push(value);
		else filterAssembly[name] = [value];
	}
	for (const feild of feilds) {
		if (feild.name == 'Label') continue;
		switch (feild.type) {
			case 'checkbox':
				addvalue(feild.name,feild.checked);
				break;
			default:
				addvalue(feild.name,feild.value);
		}
	}
	//Save filter data
	filterdata[feilds[0].value] = filterAssembly;
	user.overwriteData('filters',filterdata);

	updateFilters();

	//Clear Modal
	for (const feild of feilds) {
		switch (feild.type) {
			case 'checkbox':
				feild.checked = false;
				break;
			default:
				feild.value = '';
		}
	}

	filterModal.close();
});

//Update Secondary filters in Scholarships Tab
function updateFilters() {
	const nodeAssembly = [];
	//assemble new filter btns
	for (const filter of Object.entries(user.getdata('filters'))){
		const check = document.createElement('input');
		const label = document.createElement('label');
		check.type = 'radio'
		check.classList.add('btn-check')
		check.name = filters_nav.primaries
			.getElementsByTagName('input')[0].name
		check.id = filter[0]
		check.autocomplete = 'off'
		label.classList.add('btn','btn-outline-secondary')
		label.setAttribute('for',filter[0]);
		label.innerText = filter[0];
		label.addEventListener('click',()=>filterByData(...filter))
		nodeAssembly.push(check);
		nodeAssembly.push(label);
	}
	//Replace buttons from filters_nav.secondaries
	filters_nav.secondaries.replaceChildren(...nodeAssembly);
}

const schStyle = document.createElement('style');
schStyle.id = 'SCH_FILTER';
document.head.appendChild(schStyle);
//Recomended: filter scholarships as uploaded from the Internet

//Applied & Favorites: filter scholarships to 
//show only Applied or Favorited

//All filter: erase active filter mode and show all Scholarships
filters_nav.primaries.getElementsByTagName('input')[3]
	.addEventListener('click',() => {
		schStyle.innerText = "";
	});
filters_nav.primaries.getElementsByTagName('input')[3].click();

//Secondary Filters: show scholarships according to data
function filterByData(name,data) {
	console.log(name,data);
	schStyle.innerText = `
		#Scholarships_nav .card {display: none;}
		${(data.pageRadio1[0]) ? "#Scholarships_nav .card[renewable] {display: block;}" : ""}
		${(data.pageRadio1[1]) ? "#Scholarships_nav .card[character-based] {display: block;}" : ""}
		${(data.pageRadio1[2]) ? "#Scholarships_nav .card[merit-based] {display: block;}" : ""}
		${(data.pageRadio1[3]) ? "#Scholarships_nav .card[need-based] {display: block;}" : ""}
		${(data.pageRadio1[4]) ? "#Scholarships_nav .card[minority] {display: block;}" : ""}
		${(data.pageRadio1[5]) ? '#Scholarships_nav .card[gender-based="Male"] {display: block;}' : ""}
		${(data.pageRadio1[6]) ? '#Scholarships_nav .card[gender-based="Female"] {display: block;}' : ""}
	`;
}
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

