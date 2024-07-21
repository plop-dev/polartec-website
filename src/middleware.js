import { Types as MongooseTypes } from 'mongoose';
import User from './schemas/user';
import { encrypt, decrypt } from './tools/encryption';

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
		if (cookies.get('userId')) {
			const userId = decrypt(cookies.get('userId').value);
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
