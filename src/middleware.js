import User from './schemas/user';
import { Types as MongooseTypes } from 'mongoose';
const ObjectId = MongooseTypes.ObjectId;

function isObjectIdValid(id) {
	if (ObjectId.isValid(id)) {
		if (String(new ObjectId(id)) === id) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

export const onRequest = async ({ cookies, locals, url }, next, pattern = /dashboard\/.*/) => {
	if (pattern.test(url.pathname)) {
		const userId = cookies.get('userId').value.split('*SID-')[0];
		let isValidUserId;
		if (userId) isValidUserId = isObjectIdValid(userId);

		if (isValidUserId) {
			return next();
		} else {
			return new Response(null, {
				status: 302,
				headers: {
					Location: '/auth/login',
				},
			});
		}
	} else {
		return next();
	}
};
