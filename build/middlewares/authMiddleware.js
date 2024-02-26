"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthVerify {
    constructor() { }
    createToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const TOKEN = process.env.TOKEN;
            const token = jsonwebtoken_1.default.sign({ userId: userId }, TOKEN, { expiresIn: '1h' });
            return token;
        });
    }
    verifyToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const TOKEN = process.env.TOKEN;
            const token = req.header('Authorization');
            if (!token)
                res.status(401).send({ error: `Access denied` });
            try {
                const decoded = jsonwebtoken_1.default.verify(token || '', TOKEN);
            }
            catch (error) {
                res.status(401).json({ error: `Invalid token` });
            }
        });
    }
}
const authVerify = new AuthVerify();
exports.default = authVerify;
//# sourceMappingURL=authMiddleware.js.map