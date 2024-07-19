import Order from '../../schemas/order';

export const prerender = false;
export const POST = async ({ request, cookies }) => {
	if (cookies.get('userId')) {
		const userId = cookies.get('userId').value.split('*SID-')[0];
		const orders = await Order.find({ userId: userId });

		if (!orders) {
			return new Response(JSON.stringify({ orders: false }), {
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response(JSON.stringify(orders), {
			headers: { 'Content-Type': 'application/json' },
		});
	} else {
		return new Response(JSON.stringify({ redirect: true }), {
			headers: { 'Content-Type': 'application/json' },
		});
	}
};
