import * as mongoose from 'mongoose';
const { MONGODB_URI } = import.meta.env;

await mongoose
	.connect(MONGODB_URI)
	.then(() => console.log('Connected to MongoDB.'))
	.catch(error => console.log(error));
