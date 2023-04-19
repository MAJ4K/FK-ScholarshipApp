const filterGroup = document.getElementById('FGroup');
const addfilterbtn = document.getElementById('addfltbtn');
const flabelinp = document.getElementById('flabelinp');

var sch_json = undefined
fetch('./scholarships.json')
  .then((response) => response.json())
  .then((json) => sch_json = json)
	.then(() => scholarshipsFetched());

function addfilterbutton() {
	if (!flabelinp.value) return;
	const inp = document.createElement('input');
	const lab = document.createElement('label');
	const ident = "ts" + filterGroup.children.length + "fltrad";

	inp.type = "radio";
	inp.classList.add("btn-check");
	inp.name = "fltRadio";
	inp.id = ident;
	lab.innerText = flabelinp.value;
	lab.classList.add("btn");
	lab.classList.add("btn-outline-secondary");
	lab.htmlFor = ident
	filterGroup.appendChild(inp);
	filterGroup.appendChild(lab);
}

function scholarshipsFetched() {
	const scholarshipContainer = document.getElementById('SCHOLARSHIPCONTAINER');
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