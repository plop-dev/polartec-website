//#region
const overlay = document.getElementById('overlay');

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
