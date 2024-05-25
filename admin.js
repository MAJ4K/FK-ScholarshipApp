import CPage,{FormPage as FPage, Modal} from '/application.js'

const nav = document.createElement('section');
const profilesPage = new CPage('Profiles', nav);
const additionPage = new CPage('AddContent', nav);
const adminStyle = document.createElement('style');

adminStyle.textContent = `
#addContentBtn{
	border: solid royalblue 0.2em;
	width: 10em; height: 10em;
	margin: auto;
	border-radius: .5em;
}
#addContentBtn.active{
	width: 100%; height: 100%;
	display: grid;
	grid-template-rows: auto 1fr;
}
#addContentBtn.active>div{
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	padding: 1em 0;
}
`;


initialize()
function initialize() {
document.head.appendChild(adminStyle);
document.getElementsByTagName('nav')[0].insertAdjacentElement('afterbegin',nav);
	nav.id = 'AdminNavs';
	nav.hidden = true;

	document.getElementById('LoadingIndicator').addEventListener('click',()=>{
		const userNav = document.getElementById('UserNavs');
		userNav.hidden = nav.hidden;
		nav.hidden = !nav.hidden;
		if(!nav.hidden) nav.children[0].click();
		else userNav.children[0].click();

	});

	const addBtn = document.createElement('section');
	const filebtn_ph = document.createElement('input');
	const item_container = document.createElement('div');
	const content_form = document.createElement('form');
	filebtn_ph.type = 'file';
	filebtn_ph.hidden = true;
	additionPage.page.appendChild(filebtn_ph);
	additionPage.page.appendChild(addBtn);
	addBtn.id = 'addContentBtn';
	addBtn.append(item_container,content_form);
	addBtn.addEventListener('click',()=>{
		if (addBtn.classList.contains('active')) return;
		filebtn_ph.click();
	});
	filebtn_ph.addEventListener('change',()=>{
		if (filebtn_ph.files.length == 0) return;
		for (const file of filebtn_ph.files) {
			if (!file.type) continue;
			const item = document.createElement('input');
			item.type = 'button';
			item.addEventListener('click',() => content_item_settings(file));
			item.value = file.name.split('.')[0];
			item.classList.add('btn');
			item_container.appendChild(item);
		}
		if (item_container.children.length == 0) return;
		addBtn.classList.add('active');
	});
}

function content_item_settings(item) {
	console.log(item)
}