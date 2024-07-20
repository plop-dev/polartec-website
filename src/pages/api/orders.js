import Order from '../../schemas/order';

export const prerender = false;
export const POST = async ({ request, cookies, locals }) => {
	const body = await request.json().then(res => {
		return res;
	});
	console.log(body, '<- POST body');
	const userId = body._id;
	console.log(userId);
	const orders = await Order.find({ userId: userId }).catch(error => console.log(error, 'Order.find errored'));

	console.log(orders, '<- orders');
	if (!orders) {
		console.log('none: true');
		return new Response(JSON.stringify({ none: true }), {
			headers: { 'Content-Type': 'application/json' },
		});
	}

	console.log('returned orders array');
	return new Response(JSON.stringify(orders), {
		headers: { 'Content-Type': 'application/json' },
	});
};
