import client from '../../../scripts/bot/bot';

export const prerender = false;
export async function GET({ request, cookies, redirect }) {
	cookies.delete('userId', { path: '/' });
	return redirect('/', 302);
}
