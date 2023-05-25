const navbtns = document.getElementById("NAVIGATION").getElementsByTagName('input');
const maintabs = document.getElementsByTagName('main');

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