const filterGroup = document.getElementById('FGroup');
const addfilterbtn = document.getElementById('addfltbtn');
const flabelinp = document.getElementById('flabelinp');


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

