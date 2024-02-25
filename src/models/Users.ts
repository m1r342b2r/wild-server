import { Schema, model } from 'mongoose';

const userSchema = new Schema({
	nombre: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, unique: true },
	username: { type: String, required: true },
	createdAt: { type: Date, default: Date.now() },
	posts: [{
		type: Schema.Types.ObjectId,
		ref: 'Post'
	}]
})

export default model('User', userSchema);
