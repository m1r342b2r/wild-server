import { Request, Response, Router } from 'express';

class IndexRoutes {
	router: Router;
	constructor() {
		this.router = Router();
		this.routes();
	}

	routes() {
		this.router.get('/', (req, res) => {
			res.json({ messaje: 'HOME PAGE' });
		});
	}
}

const indexRoutes = new IndexRoutes();
indexRoutes.routes();

export default indexRoutes.router;