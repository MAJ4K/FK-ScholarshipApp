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
	id: 023,
	filters: {}
};

var sch_json = undefined;
fetch(tabfiles[0])
  .then((response) => response.json())
  .then((json) => sch_json = json)
	.then(() => cardsFetched());

for (const [key, value] of Object.entries(JSON.parse(localStorage.getItem("filters"))['filters'])) {
	addSecondFilter(key,value);
}
filter.aux[0].addEventListener('click', ()=>{
	surebtn.click();
});
for (const btns of filter.primaries) {
	btns.addEventListener('click', ()=>{
		filter.aux[0].hidden = true;
		surdelbtn.removeEventListener('click',{});
	});
}
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
function filterScholarships() {}



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
	if (Object.keys(profile).length === 0) return;
	for (const item of profileItems) {
		const name = item.children[0].innerText;
		for(const i in item.getElementsByTagName('input')){
			item.getElementsByTagName('input')[i].value = profile[name][i];
		}
	}
	return true;
}

function cardsFetched() {
	for (const item of sch_json) {
		if (item["Title"] == "None") continue;
		const title = item["Title"][1];
		const amtWnd = `
			${(item["Amount"] != "None") ? item["Amount"] : ""}
			${(item["Opens"] != "None" && item["Due"] != "None") ? item["Opens"] + "-" + item["Due"]  :
			 (item["Opens"] != "None") ? item["Opens"] : 
			 (item["Due"] != "None") ? item["Due"] : ""}
		`;
		
		const qtemp = (condition,icon) => {
			return (condition) ? `
				<span class="badge bg-secondary">
					<img src="icons/${icon}.png" alt="Service/Character-Based">
				</span>
				`: ''
		};
		const rnw = /Yes|yes/.test(item['Renewable']);//1
		const chr = /Yes|yes/.test(item['Service/\r\ncharacter-based']);
		const ack = /Yes|yes/.test(item['Academic Merit-based']);//3
		const ned = /Yes|yes/.test(item['Need-based']);
		const mle = /Male|male/.test(item['Gender-based']);//5
		const fml = /Female|female/.test(item['Gender-based']);//6
		const mnr = /Yes|yes/.test(item['Must identify as Black/ minority']);
		const qualifiers = `
			${qtemp(rnw,"renewable")} ${qtemp(chr,"character")} ${qtemp(ack,"merit")}
			${qtemp(ned,"need")} ${qtemp(mle,"male")} ${qtemp(fml,"female")}
			${qtemp(mnr,"minority")}
		`;

		scholarshipContainer.innerHTML += `
		<div class="content_card rounded-2">
			<img src="icons/logo-king.png" alt="ph">
			<div class="v_divider"></div>
			<div>
				<h6>${title}</h6>
				<p>${amtWnd}</p>
				<footer>${qualifiers}</footer>
			</div>
		</div>`;
	}
	addContentModal();
}
function addContentModal() {
	for (const [i, child] of [...scholarshipContainer.children].entries()) {
		const title = child.getElementsByTagName('h6')[0].innerText;
		const amtWnd = child.getElementsByTagName('p')[0].innerText;
		const qualifiers = child.getElementsByTagName('footer')[0].innerHTML;
		const link = sch_json[i]["Title"][0];
		child.addEventListener('click', () => {
			const scholarshipModal = document.getElementById('scholarshipModal');
			scholarshipModal.getElementsByClassName('modal-title')[0].innerText = title;
			scholarshipModal.getElementsByClassName('modal-body')[0].innerText = amtWnd;
			scholarshipModal.getElementsByClassName('modal-body')[0].innerHTML += qualifiers;
			scholarshipModal.getElementsByTagName('a')[0].href = link;
			schdatabtn.click();
		});
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
//functional operations
// inp.addEventListener('click', ()=>{
// 	delfltlab.hidden = false;
// 	currentflt = [inp,lab];
// 	const dat = JSON.parse(localStorage.getItem(data['filtername']));
// 	const famt = [dat['rangef'],dat['ranget']];
// 	const fMajor = dat['Major'].toLowerCase();
// 	const fLevel = dat['Level'].toLowerCase();
// 	const fYear = dat['Year'].toLowerCase();

// 	for (const i in sch_json) {
// 		var amt = sch_json[i]['Amount'].replace(/,|\$/g,'').split(/-|\//);
// 		for(const l in amt)	amt[l] = parseInt(amt[l]);

// 		if (famt[0] && famt[1]){
// 			if(!amt[0]){
// 				scholarshipContainer.children[i].hidden = true;
// 				continue;
// 			}
// 			if (Math.max(amt[0],famt[0]) > Math.min(famt[1],amt[amt.length - 1])){
// 				scholarshipContainer.children[i].hidden = true;
// 				continue;
// 			}

// 		}

// 		const rnw = /Yes|yes/.test(sch_json[i]['Renewable']);//1
// 		const chr = /Yes|yes/.test(sch_json[i]['Service/\r\ncharacter-based']);
// 		const ack = /Yes|yes/.test(sch_json[i]['Academic Merit-based']);//3
// 		const ned = /Yes|yes/.test(sch_json[i]['Need-based']);
// 		const mle = /Male|male/.test(sch_json[i]['Gender-based']);//5
// 		const fml = /Female|female/.test(sch_json[i]['Gender-based']);//6
// 		const mnr = /Yes|yes/.test(sch_json[i]['Must identify as Black/ minority']);
		
// 		const level = sch_json[i]['Grade Eligibility'];
// 		const year = sch_json[i]['Grade Eligibility'];
// 		const major = sch_json[i]['Major Type'];

// 		const dates = {
// 			"January" : 1,"February" :2,"March" :3,"April" :4,
// 			"May" :5,"June" :6,"July" :7,"August" :8,
// 			"September" :9,"October" :10,"November" :11,"December" :12
// 		};
// 		var opn = [dates[sch_json[i]['Opens']], parseInt(dat['opens'])];
// 		var due = [dates[sch_json[i]['Due']], parseInt(dat['closes'])];
		
// 		if ((opn[1] && !due[1]) && (opn[1] != opn[0])){
// 			scholarshipContainer.children[i].hidden = true;
// 			continue;
// 		}
// 		if ((!opn[1] && due[1]) && (due[0] != due[1])){
// 			scholarshipContainer.children[i].hidden = true;
// 			continue;
// 		}
// 		if (opn[1] && due[1]){
// 			if (opn[0] == undefined) opn[0] = due[0];
// 			if (due[0] == undefined) due[0] = opn[0];
// 			if (opn[0] > due[0]) due[0] += 12;
// 			if (opn[1] > due[1]) due[1] += 12;
// 			if (Math.max(...opn) > Math.min(...due)){
// 				scholarshipContainer.children[i].hidden = true;
// 				continue;
// 			}
// 		}

// 		var schooling = [1,1,1];
// 		if (fLevel){
// 			if (!level) {
// 				scholarshipContainer.children[i].hidden = true;
// 				continue;
// 			}
// 			var words1 = fLevel.split(/\s+/g),
// 			words2 = level.toLowerCase().split(/\s+/g);

// 			for (var k = 0; k < words1.length; k++) {
// 				for (var j = 0; j < words2.length; j++) {
// 					if (words1[k] == words2[j]) {
// 						schooling[0] = 1;
// 					}
// 				}
// 			}
// 		}
// 		if (fMajor){
// 			if (!level) {
// 				scholarshipContainer.children[i].hidden = true;
// 				continue;
// 			}
// 			var words1 = fMajor.split(/\s+/g),
// 			words2 = major.toLowerCase().split(/\s+/g);

// 			for (var k = 0; k < words1.length; k++) {
// 				for (var j = 0; j < words2.length; j++) {
// 					if (words1[k] == words2[j]) {
// 						schooling[1] = 1;
// 					}
// 				}
// 			}
// 		}
// 		if (fYear){
// 			if (!level) {
// 				scholarshipContainer.children[i].hidden = true;
// 				continue;
// 			}
// 			var words1 = fYear.split(/\s+/g),
// 			words2 = year.toLowerCase().split(/\s+/g);

// 			for (var k = 0; k < words1.length; k++) {
// 				for (var j = 0; j < words2.length; j++) {
// 					if (words1[k] == words2[j]) {
// 						schooling[2] = 1;
// 					}
// 				}
// 			}
// 		}
// 		if ((Math.max(...schooling) == 0) && (fYear || fLevel || fMajor)){
// 			scholarshipContainer.children[i].hidden = true;
// 			continue;
// 		}

// 		if (dat['renewable'] || dat['character'] 
// 		||dat['merit'] || dat['need'] || dat['male'] 
// 		||dat['female'] || dat['minority']){
// 			const idk = [
// 				dat['renewable'] && rnw,
// 				dat['character'] && chr,
// 				dat['merit'] && ack,
// 				dat['need'] && ned,
// 				dat['male'] && mle,
// 				dat['female'] && fml,
// 				dat['minority'] && mnr
// 			]
// 			var condition = false;
// 			for (const tst of idk) {
// 				if (tst) condition = true;
// 			}
// 			if (!condition) {
// 				scholarshipContainer.children[i].hidden = true;
// 				continue;
// 			};
// 		}
// 		scholarshipContainer.children[i].hidden = false;
// 	} 
// });*/