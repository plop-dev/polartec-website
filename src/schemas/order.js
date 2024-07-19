import * as mongoose from 'mongoose';
const { MONGODB_URI } = import.meta.env;

const orderSchema = new mongoose.Schema({
	userEmail: {
		type: String,
		required: true,
	},
	dateOrdered: {
		type: Date,
		default: Date.now,
	},
	fileName: {
		type: String,
		required: true,
	},
	file: {
		data: Buffer,
		contentType: String,
	},
});

await mongoose
	.connect(MONGODB_URI)
	.then(() => console.log('Connected to MongoDB.'))
	.catch(error => console.log(error));

export default mongoose.models.Order || mongoose.model('Order', orderSchema, 'orders');
