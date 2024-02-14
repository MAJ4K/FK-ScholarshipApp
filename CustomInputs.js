const SVGNS = "http://www.w3.org/2000/svg";

export default class CustomInput extends HTMLElement{
	static #selectedItem = null
	static #selectIDX = null
	static #svgData = {
		'double-range': `
			<style>
				.handle{
					cursor: pointer;
					fill: royalblue;
				}
				.handle:hover{
					fill: rgb(53, 84, 175);
				}
			</style>
			<line x1="10" y1="50%" x2="calc(100% - 10px)" y2="50%" 
				style="stroke: black;stroke-width:7;
				stroke-linecap:round;" />
			<line x1="30%" y1="50%" x2="70%" y2="50%" class="bg-bar"
				style="stroke: royalblue;stroke-width:3;" />
			<circle class="handle" cx="30%" cy="50%" r="10"/>
			<circle class="handle" cx="70%" cy="50%" r="10"/>
			Sorry, your browser does not support inline SVG.`,
		'default':""
	}

	constructor(...args){
		super(...args)
		const type = this.getAttribute('type');
		this.value = undefined;
		this.step = 0.1;
		const ShadowRoot = this.attachShadow({mode:'closed'});
		
		this.svg = document.createElementNS(SVGNS,'svg');
		this.svg.setAttributeNS(null,'height','100%');
		this.svg.setAttributeNS(null,'width','100%');
		this.svg.innerHTML = CustomInput.#svgData[type];
		this.#init[type]();
		ShadowRoot.append(this.svg);
	}

	#init = {
		'double-range': () => {
			const type = 'double-range';
			this.value = [30.0,70.0];
			this.range = [0.0,100.0];
			if (this.getAttribute('range')){
				var r_str = this.getAttribute('range').split(' ');
				this.range[0] = Number(r_str[0]);
				this.range[1] = Number(r_str[1]);
				this.value[0] = this.range[0] + (this.range[1] - this.range[0]) * 0.3;
				this.value[1] = this.range[0] + (this.range[1] - this.range[0]) * 0.7;
			}

			this.svg.addEventListener('mousedown', startDrag);
			this.svg.addEventListener('mousemove', drag);
			this.svg.addEventListener('mouseup',(e) => endDrag(e,this));
			this.svg.addEventListener('mouseleave',(e) => endDrag(e,this));

			function startDrag(evt) {
				if (evt.target.classList.contains('handle')){
					const svg = evt.target.parentNode;
					CustomInput.#selectedItem = evt.target;
					CustomInput.#selectIDX = (
						[...svg.children].indexOf(evt.target) - 2
					);
				}
			}
			function drag(evt) {
				if (CustomInput.#selectedItem) {
					const svg = CustomInput.#selectedItem.parentNode;
					const svg_width = svg.width.baseVal.value;
					const bgBar = svg.getElementsByClassName('bg-bar')[0];
					evt.preventDefault();
					const offset = clamp(
						evt.offsetX,10,svg_width - 10);
					CustomInput.#selectedItem.setAttributeNS(
						null, "cx", offset);
					bgBar.setAttributeNS(null,`x${CustomInput.#selectIDX}`, offset);
				}
			}
			function endDrag(evt,item) {
				if(CustomInput.#selectedItem){
					var x = CustomInput.#selectedItem.getAttribute('cx');
					item.value[CustomInput.#selectIDX - 1] = item.output['double-range'](x);
				}
				CustomInput.#selectedItem = null;
				CustomInput.#selectIDX = null;
			}
		}
	}

	output = {
		'double-range': (inp) => {
			const slope = (this.range[1] - this.range[0])
					/(this.clientWidth - 10 - 10);
			return this.range[0] + slope * (inp - 10);
		}
	}
}

customElements.define('custom-input',CustomInput);

function clamp(num, min, max) {
  return num <= min 
    ? min 
    : num >= max 
      ? max 
      : num
}

function lerp(start, end, t) {
  return (1 - t) * start + t * end;
}
