import Order from '../../schemas/order';

export const prerender = false;
export const POST = async ({ request, cookies }) => {
	const userId = cookies.get('id');
	const orders = await Order.find({ id: userId });

	return new Response(JSON.stringify(orders), {
		headers: { 'Content-Type': 'application/json' },
	});
};
