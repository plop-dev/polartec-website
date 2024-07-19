import Order from '../../schemas/order';

export const prerender = false;
export const POST = async ({ request, cookies, locals }) => {
	const body = await request.json().then(res => {
		return res;
	});
	const userId = body._id;
	const orders = await Order.find({ userId: userId });

	if (!orders) {
		return new Response(JSON.stringify({ none: true }), {
			headers: { 'Content-Type': 'application/json' },
		});
	}

	return new Response(JSON.stringify(orders), {
		headers: { 'Content-Type': 'application/json' },
	});
};
