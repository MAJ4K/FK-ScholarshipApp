import Page from '/application.js'
const nav = document.getElementsByTagName('nav')[0];

const profiles = new Page('Profile')
const page = new Page('Scholarships');
const page2 = new Page('Internships');

profiles.page.innerText = 'profile'; 
page.page.innerText = page.title; 
page2.page.innerText = page2.title; 

page.navbtn[0].click();
