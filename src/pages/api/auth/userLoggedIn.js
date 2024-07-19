import User from '../../../schemas/user';

export const prerender = false;
export const POST = async ({ request, cookies }) => {
	const body = await request.json().then(res => res);
	const user = await User.findOne({ _id: body.userId });

	if (!user) {
		return new Response(JSON.stringify(''), {
			headers: { 'Content-Type': 'application/json' },
		});
	}

	return new Response(JSON.stringify(user), {
		headers: { 'Content-Type': 'application/json' },
	});
};
