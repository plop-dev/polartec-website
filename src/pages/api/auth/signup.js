import bcrypt from 'bcrypt';
import User from '../../../schemas/user';

async function hashPassword(password) {
	try {
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);
		return hash;
	} catch (error) {
		console.log('An error occured: ' + error.message + '\n' + error);
	}
}

export const prerender = false;
export const POST = async ({ request }) => {
	const body = await request.json().then(res => res);
	// console.log(body);
	const { displayName, uniqueName, email, password } = body;

	const hashedPassword = await hashPassword(password).then(res => res);

	// check if user already has an account (check email)
	const accountsWithEmail = await User.find({ email: email });

	if (!accountsWithEmail || accountsWithEmail.length <= 0) {
		// check if the unique name is already taken
		const accountsWithUniqueName = await User.find({ uniqueName: uniqueName });

		if (!accountsWithUniqueName || accountsWithUniqueName.length <= 0) {
			// valid account details, create a new user document
			const newUser = await User.create({
				displayName,
				uniqueName,
				email,
				password: hashedPassword,
			});
			console.log('account created\nname:', displayName, 'email:', email);

			return new Response(JSON.stringify({ success: true }), {
				headers: { 'Content-Type': 'application/json' },
			});
		} else {
			return new Response(JSON.stringify({ errorMessage: 'Unique name is taken.' }), {
				headers: { 'Content-Type': 'application/json' },
			});
		}
	} else {
		return new Response(JSON.stringify({ errorMessage: 'Email is already in use.' }), {
			headers: { 'Content-Type': 'application/json' },
		});
	}
};
