const navbtns = document.getElementsByTagName('nav')[0].getElementsByTagName('input');

for (const btn of navbtns) {
	btn.addEventListener('click',()=>{
		const relatedtab = document.getElementById(btn.value);
		const contentTabs = document.getElementsByTagName('main');
		for (const tab of contentTabs) tab.classList.remove('active');
		relatedtab.classList.add('active');
	});
}