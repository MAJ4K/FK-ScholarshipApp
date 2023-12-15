import CPage,{FormPage as FPage, Modal} from '/application.js'
const nav = document.getElementsByTagName('nav')[0];

const profPage = new FPage('Profile');
const schPage = new CPage('Scholarships');
const testPage = new CPage('test');

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
			children:[
				{type:'rad-l', added:"secondary", id:"test", text:"test"},
				{type:'rad-l', added:"secondary", id:"test1", text:"test"},
				{type:'rad-l', added:"secondary", id:"test2", text:"test"},
				{type:'rad-l', added:"secondary", id:"test3", text:"test"},
				{type:'rad-l', added:"secondary", id:"test4", text:"test"},
			]}
		]
	},
	{type:'div', classes:'btn-group p-0 m-0', handle:'filter_fncts',
	children:[
		{type:'button',classes:'btn btn-danger',text:'del'},
		{type:'button',classes:'btn btn-primary',text:'add'}
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
	infoGroup:{tag:'span', subtag: 'div class="infoItem"',
		keys:['Major Type','Grade Eligibility','GPA','Geography','Special Eligibility',]},
	attributes:['Opens','Due','Renewable','Service/\ncharacter-based','Academic Merit-based','Need-based','Gender-based','Must identify as Black/ minority','link'],
};


let debuglist = [];
debuglist.push(schPage.createJumbotron());
debuglist.push(schPage.createNavStrip(stripparams));
// debuglist.push(testPage.createContent());
debuglist.push(profPage.createImg());
debuglist.push(profPage.createForm(formparams));


var scholarship_data;
fetch('./Sheet1.json')
    .then((response) => response.json())
    .then((json) => {
		debuglist.push(schPage.createContent(json,schParams));
	})
	.then(()=>{
		const cardIconGroups = document.getElementsByClassName('icon-group');
		const IconsTemplate = [
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
		IconsTemplate[4].src = 'icons/male.png';
		IconsTemplate[5].src = 'icons/female.png';
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
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

const filters = {
	primaries: document.getElementById('primary_filters').getElementsByTagName('label'),
	secondaries: document.getElementById('secondary_filters'),
	actions: document.getElementById('filter_fncts').children,
}

const filterModal = new Modal('filterModal');

filters.actions[0].addEventListener('click',() => {
	console.log('delete filter');
});
filters.actions[1].addEventListener('click',() => {
	console.log('add filter');
	filterModal.element.classList.add('active');
});
