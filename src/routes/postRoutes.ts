import { Request, Response, Router } from 'express';
import Post from '../models/Posts';
import authModule from '../middlewares/authMiddleware';

class PostRoutes {
	router: Router;

	constructor() {
		this.router = Router();
		this.routes();
	}

	public async getPosts(req: Request, res: Response): Promise<void> {
		const posts = await Post.find();
		res.json(posts);
	}

	public async getPost(req: Request, res: Response): Promise<void> {
		const post = await Post.findOne({ url: req.params.url });
		res.json(post);
	}
	
	public async createPost(req: Request, res: Response): Promise<void> {
		const { title, url, content, image } = req.body;
		// Colicos Renales
		try {
			const newPost = new Post({ title, url, content, image });
			const result = await newPost.save();
			res.json({data: newPost});
		} catch (error) {
			res.status(404).send({error: `Error: ${error}`});
		}
	}

	public async updatePost(req: Request, res: Response): Promise<void> {
		try {
			const { url } = req.params;
			const post = await Post.findOneAndUpdate({url}, req.body, { new: true });
			res.json(post);
		} catch (error) {
			res.status(404).send({message: `Error: ${error}`});
		}
	}

	public async deletePost(req: Request, res: Response): Promise<void> {
		try {
			const { url } = req.params;
			await Post.findOneAndDelete({url});
			res.json({message: 'Post deleted succeddfully'});
		} catch (error) {
			res.status(404).send({message: `Error: ${error}`});
		}
	}

	routes() {
		this.router.get('/', authModule.verifyToken, this.getPosts);
		this.router.get('/:url', authModule.verifyToken, this.getPost);
		this.router.post('/', authModule.verifyToken, this.createPost);
		this.router.put('/:url', authModule.verifyToken, this.updatePost);
		this.router.delete('/:url', authModule.verifyToken, this.deletePost);
	}
}

const postRoutes = new PostRoutes();
export default postRoutes.router;
