import { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Result, query } from 'express-validator'; // To validate the answers
const protectedRoutes = require('../middlewares/authMiddleware');
import User from '../models/Users';
import log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = "debug";

require('dotenv').config();

class UserRoutes {
	router: Router;

	constructor() {
		this.router = Router();
		this.routes();
	}

	public async getUsers(req: Request, res: Response): Promise<void> {
		const users = await User.find({},{password: 0});
		res.json(users);
	}

	public async getUser(req: Request, res: Response): Promise<void> {
		const user = await User.findOne({ username: req.params.username },{password: 0}).populate('posts', 'title url -_id');
		res.json(user);
	}
	
	public async signUp(req: Request, res: Response): Promise<void> {
		try {
			const { nombre, email, password, username } = req.body;
			const hashedPassword = await bcrypt.hash(password, 10);
			const newUser = new User({ nombre, email, password: hashedPassword, username });
			const user = await newUser.save();
			res.json({message: 'User created'});
		} catch (error) {
			res.status(404).send({message: `Error: ${error}`});
		}
	}

	public async updateUser(req: Request, res: Response): Promise<void> {
		try {
			const { username } = req.params;
			const user = await User.findOneAndUpdate({username}, req.body, { new: true });
			res.json(user);
		} catch (error) {
			res.status(404).send({message: `Error: ${error}`});
		}
	}

	public async deleteUser(req: Request, res: Response): Promise<void> {
		try {
			const { username } = req.params;
			await User.findOneAndDelete({username});
			res.json({message: 'User deleted succeddfully'});
		} catch (error) {
			res.status(404).send({message: `Error: ${error}`});
		}
	}

	public async signIn(req: Request, res: Response): Promise<void> {
		try {
			const authMsgError = `Authentication failed`;
			const TOKEN: string = (process.env.TOKEN as string);
			const { username, password } = req.body;
			const user = await User.findOne({username});
			if (!user) throw new Error(authMsgError);
			const userpass = user.password || '';
			const passwordMatch = await bcrypt.compare(password, userpass);
			if (!passwordMatch) throw new Error(authMsgError);
			const token = jwt.sign({ userId: user._id }, TOKEN, { expiresIn: '1h' });
			res.status(200).json({token})
		} catch (error) {
			res.status(401).send({message: error});
		}
	}

	routes() {
		this.router.get('/', this.getUsers);
		this.router.get('/:username', this.getUser);
		this.router.post('/signUp', this.signUp);
		this.router.put('/:username', this.updateUser);
		this.router.delete('/:username', this.deleteUser);
		this.router.post('/signIn', this.signIn);
	}
}

const userRoutes = new UserRoutes();
export default userRoutes.router;
