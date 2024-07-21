import CryptoJS from 'crypto-js';
const key = import.meta.env.USER_ID_ENCRYPTION_KEY;

function decrypt(cipherText) {
	const decrypted = CryptoJS.AES.decrypt(cipherText, key);
	return decrypted.toString(CryptoJS.enc.Utf8);
}

function encrypt(clearText) {
	const encrypted = CryptoJS.AES.encrypt(clearText, key);
	return encrypted.toString();
}

export { decrypt, encrypt };
