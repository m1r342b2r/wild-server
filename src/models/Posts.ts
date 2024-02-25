import { Schema, model } from 'mongoose';

const postSchema = new Schema({
	title: { type: String, required: true },
	url: { type: String, required: true, unique: true, lowercase: true },
	content: { type: String, required: true },
	image: { type: String, required: true },
	createAt: { type: Date, default: Date.now() },
	updateAt: Date
})

export default model('Post', postSchema);
