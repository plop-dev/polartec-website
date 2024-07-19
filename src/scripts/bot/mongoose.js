import * as mongoose from 'mongoose';
// const { MONGODB_URI } = import.meta.env;
import dotenv from 'dotenv';
dotenv.config();
const { MONGODB_URI } = process.env;

await mongoose
	.connect(MONGODB_URI)
	.then(() => console.log('Connected to MongoDB.'))
	.catch(error => console.log(error));
