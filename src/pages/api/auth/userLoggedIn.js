import User from '../../../schemas/user';

export const prerender = false;
export async function POST({ request, cookies, redirect }) {
	const body = await request.json().then(res => res);
	const userId = body.userId;
	if (userId) {
		const user = await User.findOne({ _id: userId });

		if (!user) {
			console.log('invalid: no user');
			return new Response(JSON.stringify({ redirect: true }), {
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response(JSON.stringify(user), {
			headers: { 'Content-Type': 'application/json' },
		});
	} else {
		console.log('invalid: no userId');
		return new Response(JSON.stringify({ redirect: true }), {
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
