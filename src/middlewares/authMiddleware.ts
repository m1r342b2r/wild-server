import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

class AuthVerify {
	constructor() {}
	
	public async verifyToken ( req: Request, res: Response ): Promise<void> {
		const TOKEN: string = (process.env.TOKEN as string);
		const token = req.header('Authorization');
		if (!token) res.status(401).send({error: `Access denied`});

		try {
			const decoded = jwt.verify(token || '', TOKEN);
		} catch (error) {
			res.status(401).json({error: `Invalid token`});
		}
	}
}

const authVerify = new AuthVerify();
export default authVerify;
