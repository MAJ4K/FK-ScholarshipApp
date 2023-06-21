const surebtn = document.getElementById("SUREBTN");
const surdelbtn = document.getElementById('sureModal').getElementsByTagName('input')[0];

const navbtns = document.getElementById("NAVIGATION").getElementsByTagName('input');
const maintabs = document.getElementsByTagName('main');

const profileForm = document.getElementById("PROFILE");
var profile = JSON.parse(localStorage.getItem("profile"));

const tabfiles = ['Sheet1.json']
const schdatabtn = document.getElementById("SCHDATABTN");
const scholarshipContainer = document.getElementById("CONTENT_CONTAINER");

const filtermenu = document.getElementById("FILTERMENU").children;
const filter = {
	primaries: filtermenu[0].children[0].getElementsByTagName('input'),
	secondaries: filtermenu[0].children[1],
	aux: filtermenu[1].getElementsByTagName('label'),
	form: document.getElementById("FILTERFORM"),
	formerrdiv: document.getElementById("filterInvalidFeedback"),
	addbtn: document.getElementById("addfltbtn"),
	dismissbtn: document.getElementById('filterModal').getElementsByClassName('btn-close')[0]
}
var filterdata = {
	id: 23,
	filters: {}
};
filterdata = JSON.parse(localStorage.getItem("filters"));

var sch_json = undefined;
fetch(tabfiles[0])
  .then((response) => response.json())
  .then((json) => sch_json = json)
	.then(() => cardsFetched());

if (localStorage.getItem("filters"))
	for (const [key, value] of Object.entries(JSON.parse(localStorage.getItem("filters"))['filters'])) {
		addSecondFilter(key,value);
	}
filter.aux[0].addEventListener('click', ()=>{
	surebtn.click();
});
filter.primaries[3].addEventListener('click', ()=>{
	scholarshipContainer.style.setProperty('--all_card_display','flex');
	filter.aux[0].hidden = true;
	surdelbtn.removeEventListener('click',{});
	if (document.getElementById("FILTERSTYLE"))
		document.head.removeChild(document.getElementById("FILTERSTYLE"));
});
filter.addbtn.addEventListener('click', ()=>{
	const filtername = filter.form.getElementsByTagName('input')[0].value;
	if (!filtername) {filter.formerrdiv.innerText = "Invalid Filter Name"; return;}
	for (const labels of filter.secondaries.getElementsByTagName('label'))
		if (labels.innerText == filtername){
			filter.formerrdiv.innerText = "Filter Name Already In Use"; return;
	}

	var data = {name:filtername};
	for (const elm of filter.form.getElementsByTagName('input')) {
		data[elm.name] = elm.value;
		if (elm.type == "checkbox"){data[elm.name] = Boolean(elm.checked);}
	}
	for (const elm of filter.form.getElementsByTagName('select')) {
		data[elm.name] = elm.value;
	}
	filterdata.filters[filtername] = data;
	localStorage.setItem("filters", JSON.stringify(filterdata));
	
	addSecondFilter(filtername,data);	
	filter.dismissbtn.click();	
});
surdelbtn.addEventListener('click',()=>{
	var activeinp = undefined;
	var activelab = undefined;
	var labfound = false;
	for (const elmt of filter.secondaries.children){
		if (labfound) {activelab = elmt; break;}
		if (elmt.checked) {activeinp = elmt; labfound = true;}
	}
	if (!activelab) {return;}
	const filtername = activelab.innerText;
	activeinp.remove(); activelab.remove();
	tempdict = {};
	for (const [key, value] of Object.entries(filterdata.filters)) {
		if (key == filtername) continue;
		tempdict[key] = value;
	}
	filterdata.filters = tempdict;
	localStorage.setItem("filters", JSON.stringify(filterdata));
	filter.aux[0].hidden = true;
	filter.primaries[0].click();
	document.getElementById('sureModal').getElementsByTagName('button')[0].click();
});
function addSecondFilter(filtername,data) {
	filterdata.id += 1;
	const inp = document.createElement('input');
	const lab = document.createElement('label');
	inp.type = "radio";
	inp.classList.add('btn-check');
	inp.name = "filters";
	inp.id = "flt" + filterdata.id;
	inp.autocomplete = "off";
	lab.classList.add('btn','btn-outline-primary');
	lab.htmlFor = "flt" + filterdata.id;
	lab.innerText = filtername;
	lab.addEventListener('click', ()=>{
		filter.aux[0].hidden = false; 
		filterScholarships(data);
	});
	filter.secondaries.appendChild(inp);
	filter.secondaries.appendChild(lab);
}
function filterScholarships(data) {
	scholarshipContainer.style.setProperty('--all_card_display','flex');
	if (document.getElementById("FILTERSTYLE"))
		document.head.removeChild(document.getElementById("FILTERSTYLE"));
	const filterstyle = document.createElement('style');
	filterstyle.id = "FILTERSTYLE";
	document.head.appendChild(filterstyle);
	for (const key of Object.keys(data)) {
		if (data[key] === true) {
			filterstyle.innerHTML += `.content_card[${key}]{display: flex;}` 
			scholarshipContainer.style.setProperty('--all_card_display','none');
		}
	}
}



for (const btn of navbtns) {
	btn.addEventListener('change', ()=>{
		if (!btn.checked) return;
		for (const maintab of maintabs) {
			maintab.classList.remove('active');
		}
		const tab = document.getElementById(btn.value);
		tab.classList.add('active');
	});
}

restoreProfileValues();
function editProfile() {
	const profileInputs = profileForm.getElementsByTagName('input');
	profileInputs[profileInputs.length - 3].hidden = true;
	profileInputs[profileInputs.length - 2].hidden = false;
	profileInputs[profileInputs.length - 1].hidden = false;
	for (const inp of profileInputs) {
		if(!inp.classList.contains('form-control')) break;
		inp.disabled = false;
	}
}
function saveProfile(save) {
	const profileInputs = profileForm.getElementsByTagName('input');
	profileInputs[profileInputs.length - 3].hidden = false;
	profileInputs[profileInputs.length - 2].hidden = true;
	profileInputs[profileInputs.length - 1].hidden = true;
	for (const inp of profileInputs) {
		if(!inp.classList.contains('form-control')) break;
		inp.disabled = true;
	}
	const profileItems = profileForm.getElementsByTagName('div');
	if (save) {
		for (const item of profileItems) {
			var itemData = [];
			for(const dat of item.getElementsByTagName('input')){
				itemData.push(dat.value);
			}
			profile[item.children[0].innerText] = itemData;
		}
		localStorage.setItem('profile',JSON.stringify(profile));
	} else {restoreProfileValues();}
}
function restoreProfileValues() {
	const profileItems = profileForm.getElementsByTagName('div');
	if (!profile||Object.keys(profile).length === 0) return;
	for (const item of profileItems) {
		const name = item.children[0].innerText;
		for(const i in item.getElementsByTagName('input')){
			item.getElementsByTagName('input')[i].value = profile[name][i];
		}
	}
	return true;
}

function cardsFetched() {
	const scholarshipModal = document.getElementById('scholarshipModal');
	for (const item of sch_json){
		const rnw = /Yes|yes/.test(item['Renewable']);//1
		const chr = /Yes|yes/.test(item['Service/\ncharacter-based']);
		const ack = /Yes|yes/.test(item['Academic Merit-based']);//3
		const ned = /Yes|yes/.test(item['Need-based']);
		const fml = /Female|female/.test(item['Gender-based']);//6
		const mle = (fml) ? false : /Male|male/.test(item['Gender-based']);//5
		const mnr = /Yes|yes/.test(item['Must identify as Black/ minority']);

		const card = document.createElement('div');
		if (item["Title"] == "None") continue;
		const title = item["Title"][1];
		const link = item["Title"][0];
		const amtWnd = `
			${(item["Amount"] != "None") ? item["Amount"] : ""}
			${(item["Opens"] != "None" && item["Due"] != "None") ? item["Opens"] + "-" + item["Due"]  :
				(item["Opens"] != "None") ? item["Opens"] : 
				(item["Due"] != "None") ? item["Due"] : ""}
		`;
		const qtemp = (condition,icon) => {
			return (condition) ? `
				<span class="badge bg-secondary">
					<img src="/icons/${icon}.png" alt="${icon}">
				</span>
				`: '';
		};
		const qualifiers = `
			${qtemp(rnw,"renewable")} ${qtemp(chr,"character")} ${qtemp(ack,"merit")}
			${qtemp(ned,"need")} ${(fml) ? qtemp(fml,"female") : qtemp(mle,"male")}
			${qtemp(mnr,"minority")}
		`;

		card.innerHTML = `
		<img src="/icons/logo-king.png" alt="ph">
		<div class="v_divider"></div>
		<div>
			<h6>${title}</h6>
			<p>${amtWnd}</p>
			<footer>${qualifiers}</footer>
		</div>`;

		(rnw) ? card.setAttribute('renewable',rnw):"";
		(chr) ? card.setAttribute('character',chr):"";
		(ack) ? card.setAttribute('merit',ack):"";
		(ned) ? card.setAttribute('need',ned):"";
		(mle) ? card.setAttribute('male',mle):"";
		(fml) ? card.setAttribute('female',fml):"";
		(mnr) ? card.setAttribute('minority',mnr):"";
		card.classList.add("content_card","rounded-2");
	
		card.addEventListener('click', () => {
			scholarshipModal.getElementsByClassName('modal-title')[0].innerText = title;
			scholarshipModal.getElementsByClassName('modal-body')[0].innerText = amtWnd;
			scholarshipModal.getElementsByClassName('modal-body')[0].innerHTML += qualifiers;
			scholarshipModal.getElementsByTagName('a')[0].href = link;
			schdatabtn.click();
		});
		scholarshipContainer.appendChild(card);
	}
}
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////