const overlay = document.getElementById('overlay');
const loader = document.getElementById('loader');

//#region
function showModal(id) {
	document.getElementById(id).classList.add('open');
	setTimeout(() => {
		document.getElementById(id).style.display = 'flex';
	}, 200);
	overlay.classList.add('on');
}
function hideModal(id) {
	document.getElementById(id).classList.remove('open');
	setTimeout(() => {
		document.getElementById(id).style.display = 'none';
	}, 150);
	overlay.classList.remove('on');
}
//#endregion

//#region

function startLoad() {
	loader.style.display = 'flex';
	overlay.classList.add('on');
}
function stopLoad() {
	loader.style.display = 'none';
	overlay.classList.remove('on');
}
//#endregion

//#region
function hideSupportMessage() {
	document.getElementById('mobile-support').style.display = 'none';
}
//#endregion
