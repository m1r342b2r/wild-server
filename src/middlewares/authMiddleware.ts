import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = "debug";

class AuthVerify {
	constructor() {}

	public async createToken ( userId: Object ): Promise<String> {
		const TOKEN: string = (process.env.TOKEN as string);
		const token = jwt.sign({ userId: userId }, TOKEN, { expiresIn: '1h' });
		return token;
	}
	
	public async verifyToken ( req: Request, res: Response ): Promise<void> {
		const TOKEN: string = (process.env.TOKEN as string);
		const token = req.header('Authorization');
		if (!token) {
			logger.debug(`ERROR: Access denied. Empty token.`)
			res.status(401).send({error: `Access denied`})
		} else {
			try {
				const decoded = jwt.verify(token || '', TOKEN);
				res.status(200).json({message: `Access granted.`});
			} catch (error) {
				res.status(401).json({error: `Invalid token`});
			}
		}
	}
}

const authVerify = new AuthVerify();
export default authVerify;
