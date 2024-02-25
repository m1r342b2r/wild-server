import { Request, Response, Router } from 'express';
import { query } from 'express-validator'; // To validate the answers
import User from '../models/Users';
import log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = "debug";

class UserRoutes {
	router: Router;

	constructor() {
		this.router = Router();
		this.routes();
	}

	public async getUsers(req: Request, res: Response): Promise<void> {
		const users = await User.find();
		res.json(users);
	}

	public async getUser(req: Request, res: Response): Promise<void> {
		const user = await User.findOne({ username: req.params.username }).populate('posts', 'title url -_id');
		res.json(user);
	}
	
	public async createUser(req: Request, res: Response): Promise<void> {
		try {
			const { nombre, email, password, username } = req.body;
			const newUser = new User({ nombre, email, password, username });
			const user = await newUser.save();
			res.json({data: user});
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

	routes() {
		this.router.get('/', this.getUsers);
		this.router.get('/:username', this.getUser);
		this.router.post('/', this.createUser);
		this.router.put('/:username', this.updateUser);
		this.router.delete('/:username', this.deleteUser);
	}
}

const userRoutes = new UserRoutes();
export default userRoutes.router;
