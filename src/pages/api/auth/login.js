import bcrypt from 'bcrypt';
import User from '../../../schemas/user';
import { AstroCookies } from 'astro';
import randomId from '../../../tools/randomId';

export const prerender = false;
export const POST = async ({ request, cookies }) => {
	const body = await request.json().then(res => res);
	// console.log(body);
	const { userId, password } = body;
	let user;

	// find user with unique name or email
	const userWithEmail = await User.findOne({ email: userId });
	if (!userWithEmail) {
		// doesn't match with any emails in db, check with unique name
		const userWithUniqueName = await User.findOne({ uniqueName: userId });
		if (!userWithUniqueName) {
			console.log('account not found');
			return new Response(JSON.stringify({ errorMessage: 'Account not found.' }), {
				headers: { 'Content-Type': 'application/json' },
			});
		} else {
			user = userWithUniqueName;
		}
	} else {
		user = userWithEmail;
	}

	if (await bcrypt.compare(password, user.password)) {
		const rid = randomId();
		cookies.set('userId', `${user.id}*SID-${rid}`, { sameSite: 'lax', path: '/' });

		return new Response(JSON.stringify({ success: true }), {
			headers: { 'Content-Type': 'application/json' },
		});
	} else {
		return new Response(JSON.stringify({ errorMessage: 'Incorrect password.' }), {
			headers: { 'Content-Type': 'application/json' },
		});
	}
};
