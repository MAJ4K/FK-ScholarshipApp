var numcustomflts = 15;
const filterForm = document.getElementById('filterForm');
const filterBtns = document.getElementById('FilterBtns');
const delfltbtn = document.getElementById('delfltbtn');
const delfltlab = document.getElementById('delfltlab');
var currentflt;
const filterGroup = document.getElementById('FGroup');
const addfilterbtn = document.getElementById('addfltbtn');
const flabelinp = document.getElementById('flabelinp');
const profInputs = document.getElementById('ProfData-inputs').getElementsByTagName('input');
const scholarshipContainer = document.getElementById('SCHOLARSHIPCONTAINER');
var profData = [];
const profEdtbtns = [
	document.getElementById('editprofinp'),
	document.getElementById('uedtprofinp')
];

var sch_json = undefined;
fetch('./scholarships.json')
  .then((response) => response.json())
  .then((json) => sch_json = json)
	.then(() => scholarshipsFetched());

filterForm.addEventListener('submit', e => {
	e.preventDefault();
	if (!flabelinp.value) return false;
	const inp = document.createElement('input');
	const lab = document.createElement('label');
	const ident = "ts" + numcustomflts + "fltrad";
	numcustomflts += 1;

	inp.type = "radio";
	inp.classList.add("btn-check");
	inp.name = "fltRadio";
	inp.id = ident;
	lab.innerText = flabelinp.value;
	lab.classList.add("btn");
	lab.classList.add("btn-outline-secondary");
	lab.htmlFor = ident;
	filterGroup.appendChild(inp);
	filterGroup.appendChild(lab);
	//saved data operations
	const ifeilds = e.target.getElementsByTagName('input');
	const ofeilds = e.target.getElementsByTagName('select');
	var data = {};
	data['checkboxes'] = false;
	for (const inpt of ifeilds) {
		if (inpt.type != 'checkbox'){
			data[inpt.name] = inpt.value;
			inpt.value = null;
		}
		else {
			data[inpt.name] = inpt.checked;
			inpt.checked = false;
		}
	}
	for (const oinpt of ofeilds){
		data[oinpt.name] = oinpt.value;
	}
	localStorage.setItem(data['filtername'],JSON.stringify(data));
	//functional operations
	inp.addEventListener('click', ()=>{
		delfltlab.hidden = false;
		currentflt = [inp,lab];
		const dat = JSON.parse(localStorage.getItem(data['filtername']));
		const famt = [dat['rangef'],dat['ranget']];
		const fMajor = dat['Major'].toLowerCase();
		const fLevel = dat['Level'].toLowerCase();
		const fYear = dat['Year'].toLowerCase();

		for (const i in sch_json) {
			var amt = sch_json[i]['Amount'].replace(/,|\$/g,'').split(/-|\//);
			for(const l in amt)	amt[l] = parseInt(amt[l]);

			if (famt[0] && famt[1]){
				if(!amt[0]){
					scholarshipContainer.children[i].hidden = true;
					continue;
				}
				if (Math.max(amt[0],famt[0]) > Math.min(famt[1],amt[amt.length - 1])){
					scholarshipContainer.children[i].hidden = true;
					continue;
				}

			}

			const rnw = /Yes|yes/.test(sch_json[i]['Renewable']);//1
			const chr = /Yes|yes/.test(sch_json[i]['Service/\r\ncharacter-based']);
			const ack = /Yes|yes/.test(sch_json[i]['Academic Merit-based']);//3
			const ned = /Yes|yes/.test(sch_json[i]['Need-based']);
			const mle = /Male|male/.test(sch_json[i]['Gender-based']);//5
			const fml = /Female|female/.test(sch_json[i]['Gender-based']);//6
			const mnr = /Yes|yes/.test(sch_json[i]['Must identify as Black/ minority']);
			
			const level = sch_json[i]['Grade Eligibility'];
			const year = sch_json[i]['Grade Eligibility'];
			const major = sch_json[i]['Major Type'];

			const dates = {
				"January" : 1,"February" :2,"March" :3,"April" :4,
				"May" :5,"June" :6,"July" :7,"August" :8,
				"September" :9,"October" :10,"November" :11,"December" :12
			};
			var opn = [dates[sch_json[i]['Opens']], parseInt(dat['opens'])];
			var due = [dates[sch_json[i]['Due']], parseInt(dat['closes'])];
			
			if ((opn[1] && !due[1]) && (opn[1] != opn[0])){
				scholarshipContainer.children[i].hidden = true;
				continue;
			}
			if ((!opn[1] && due[1]) && (due[0] != due[1])){
				scholarshipContainer.children[i].hidden = true;
				continue;
			}
			if (opn[1] && due[1]){
				if (opn[0] == undefined) opn[0] = due[0];
				if (due[0] == undefined) due[0] = opn[0];
				if (opn[0] > due[0]) due[0] += 12;
				if (opn[1] > due[1]) due[1] += 12;
				if (Math.max(...opn) > Math.min(...due)){
					scholarshipContainer.children[i].hidden = true;
					continue;
				}
			}

			var schooling = [1,1,1];
			if (fLevel){
				if (!level) {
					scholarshipContainer.children[i].hidden = true;
					continue;
				}
				var words1 = fLevel.split(/\s+/g),
				words2 = level.toLowerCase().split(/\s+/g);

				for (var k = 0; k < words1.length; k++) {
					for (var j = 0; j < words2.length; j++) {
						if (words1[k] == words2[j]) {
							schooling[0] = 1;
						}
					}
				}
			}
			if (fMajor){
				if (!level) {
					scholarshipContainer.children[i].hidden = true;
					continue;
				}
				var words1 = fMajor.split(/\s+/g),
				words2 = major.toLowerCase().split(/\s+/g);

				for (var k = 0; k < words1.length; k++) {
					for (var j = 0; j < words2.length; j++) {
						if (words1[k] == words2[j]) {
							schooling[1] = 1;
						}
					}
				}
			}
			if (fYear){
				if (!level) {
					scholarshipContainer.children[i].hidden = true;
					continue;
				}
				var words1 = fYear.split(/\s+/g),
				words2 = year.toLowerCase().split(/\s+/g);

				for (var k = 0; k < words1.length; k++) {
					for (var j = 0; j < words2.length; j++) {
						if (words1[k] == words2[j]) {
							schooling[2] = 1;
						}
					}
				}
			}
			if ((Math.max(...schooling) == 0) && (fYear || fLevel || fMajor)){
				scholarshipContainer.children[i].hidden = true;
				continue;
			}

			if (dat['renewable'] || dat['character'] 
			||dat['merit'] || dat['need'] || dat['male'] 
			||dat['female'] || dat['minority']){
				const idk = [
					dat['renewable'] && rnw,
					dat['character'] && chr,
					dat['merit'] && ack,
					dat['need'] && ned,
					dat['male'] && mle,
					dat['female'] && fml,
					dat['minority'] && mnr
				]
				var condition = false;
				for (const tst of idk) {
					if (tst) condition = true;
				}
				if (!condition) {
					scholarshipContainer.children[i].hidden = true;
					continue;
				};
			}
			scholarshipContainer.children[i].hidden = false;
		} 
	});
});
filterBtns.getElementsByTagName('input')[3].addEventListener('click',()=>{
	delfltlab.hidden = true;
	for (const scholarcard of scholarshipContainer.children) {
		scholarcard.hidden = false;		
	}
});
delfltlab.addEventListener('click', ()=>{
	localStorage.removeItem(currentflt[1].innerText);
	currentflt[0].remove();
	currentflt[1].remove();
	filterBtns.getElementsByTagName('input')[3].click();
});

function scholarshipsFetched() {
	sch_json.forEach(scholarship => {
		const card = document.createElement('div');
		var eligibilities = "";
		Object.keys(scholarship).forEach(key => {
			if (["Title","Opens","Due","Amount"].includes(key)
			|| ["N/A","No","no","General"].includes(scholarship[key])){}
			else if (["Yes","Female","Male"].includes(scholarship[key])){
				switch (key) {
					case "Gender-based":
						if (["Male","male"].includes(scholarship[key]))
						eligibilities += `
							<span class="badge bg-secondary">
								<img src="icons/male.png" alt="male">
							</span>
							`;
						if (["Female","female"].includes(scholarship[key]))
						eligibilities += `
							<span class="badge bg-secondary">
								<img src="icons/female.png" alt="female">
							</span>
							`;
						break;
					case "Renewable":
						eligibilities += `
							<span class="badge bg-secondary">
								<img src="icons/renewable.png" alt="Renewable">
							</span>
							`;
						break;
					case "Service/\r\ncharacter-based":
						eligibilities += `
							<span class="badge bg-secondary">
								<img src="icons/character.png" alt="Service/Character-Based">
							</span>
							`;
						break;
					case "Academic Merit-based":
						eligibilities += `
							<span class="badge bg-secondary">
								<img src="icons/merit.png" alt="Academic/Merit-Based">
							</span>
							`;
						break;
					case "Need-based":
						eligibilities += `
							<span class="badge bg-secondary">
								<img src="icons/need.png" alt="Need-Based">
							</span>
							`;
						break;
					case "Must identify as Black/ minority":
						eligibilities += `
							<span class="badge bg-secondary">
								<img src="icons/minority.png" alt="must identify as black/ minority">
							</span>
							`;
						break;
					default:
						eligibilities += `<span class="badge bg-secondary">${scholarship[key]}</span>`;
						break;
				}
			}
			else eligibilities += `<span class="badge bg-secondary">${scholarship[key]}</span>`;
		});
		card.classList.add('card');
		card.classList.add('col-lg-6');
		card.innerHTML = `
			<img src="icons/logo-king.png" class="card-img">
			<div class="card-divide"></div>
			<div class="card-body">
				<h4 class="card-title">${scholarship['Title']}</h4>
				<p class="card-text">
					${scholarship['Opens']}-${scholarship['Due']}
					${scholarship['Amount']}
				</p>
				${eligibilities}
			</div>`;
		scholarshipContainer.appendChild(card);
	});
}

function editProfile(){
	for (const input of profInputs) {input.disabled = false;}
	profEdtbtns[0].hidden = true;
	profEdtbtns[1].hidden = false;
}
function saveProfile() {
	while (profData.length != 0) profData.pop();
	for (const input of profInputs) {
		input.disabled = true;
		profData.push(input.value);
	}
	profEdtbtns[1].hidden = true;
	profEdtbtns[0].hidden = false;
}
function revertProfile() {
	for (const input of profInputs) {
		input.disabled = true;
		input.value = null;
	}
	for (const i in profData) {profInputs[i].value = profData[i]}
	profEdtbtns[1].hidden = true;
	profEdtbtns[0].hidden = false;
}