import { Types as MongooseTypes } from 'mongoose';
const ObjectId = MongooseTypes.ObjectId;
import User from './schemas/user';

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
		if (cookies.get('userId')) {
			const userId = cookies.get('userId').value.split('*SID-')[0];
			let isValidUserId;
			if (userId) isValidUserId = isObjectIdValid(userId);

			if (isValidUserId) {
				const user = await User.findOne({ _id: userId });
				if (user) {
					locals.user = user;
					locals.user.redirect = false;
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
				return new Response(null, {
					status: 302,
					headers: {
						Location: '/auth/login',
					},
				});
			}
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
