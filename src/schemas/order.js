import * as mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	userEmail: {
		type: String,
		required: true,
	},
	customMessage: {
		type: String,
		required: false,
	},
	colour: {
		type: String,
		required: true,
	},
	plasticType: {
		type: String,
		required: true,
	},
	layerHeight: {
		type: String,
		required: true,
	},
	infill: {
		type: Number,
		required: true,
	},
	price: {
		type: mongoose.SchemaTypes.Mixed,
		default: 'TBC',
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
	status: {
		type: String,
		default: 'Order sent',
		required: true,
	},
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema, 'Orders');
