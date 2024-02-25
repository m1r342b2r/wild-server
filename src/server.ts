import express from 'express';
import { query } from 'express-validator';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = "debug";

require('dotenv').config();

import indexRoutes from './routes/indexRoutes';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';

class Server {
	// Todo lo que se defina aquí se inicializará ni bien se instancie la clase Server
	public app: express.Application;

	constructor() {
		this.app = express();
		this.config();
		this.routes();
	}

	// Este método será para configurar el servidor
	async config() {
		// Connection to DB
		const DBURI: string = (process.env.MONGODB_URL as string);
		mongoose.connect(DBURI).then(db => logger.debug('DB Connected.'))

		// Configurations
		const SERVERPORT: string = (process.env.SERVER_PORT as string);
		this.app.set('port', SERVERPORT || 3001);
		// Middlewares
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(morgan('dev'));
		this.app.use(helmet());
		this.app.use(compression());
		this.app.use(cors());
		this.app.use(query());
	}

	// Método para configurar las rutas
	routes() {
		this.app.use(indexRoutes);
		this.app.use('/api/posts', postRoutes);
		this.app.use('/api/users', userRoutes);
	}

	// Método para iniciar el server.
	start() {
		this.app.listen(this.app.get('port'), () => {
			logger.debug(`Server listen on port: ${this.app.get('port')}`);
		})
	}
}

const server = new Server();
server.start();
