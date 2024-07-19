import Order from '../../schemas/order';

export const prerender = false;
export const POST = async ({ request }) => {
	const body = await request.json().then(res => res);

	const data = [
		{
			fileName: 'test.stl',
			plasticType: 'PLA',
			plasticColour: 'white',
			status: 'printing',
			dateOrdered: '3rd November 2023',
			price: '£2.04',
		},
	]; // Your data here

	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' },
	});
};
