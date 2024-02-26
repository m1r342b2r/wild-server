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
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Users_1 = __importDefault(require("../models/Users"));
const log4js_1 = __importDefault(require("log4js"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const logger = log4js_1.default.getLogger();
logger.level = "debug";
require('dotenv').config();
class UserRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield Users_1.default.find({}, { password: 0 });
            res.json(users);
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users_1.default.findOne({ username: req.params.username }, { password: 0 }).populate('posts', 'title url -_id');
            res.json(user);
        });
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nombre, email, password, username } = req.body;
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const newUser = new Users_1.default({ nombre, email, password: hashedPassword, username });
                const user = yield newUser.save();
                res.json({ message: 'User created' });
            }
            catch (error) {
                res.status(404).send({ message: `Error: ${error}` });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.params;
                const user = yield Users_1.default.findOneAndUpdate({ username }, req.body, { new: true });
                res.json(user);
            }
            catch (error) {
                res.status(404).send({ message: `Error: ${error}` });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.params;
                yield Users_1.default.findOneAndDelete({ username });
                res.json({ message: 'User deleted succeddfully' });
            }
            catch (error) {
                res.status(404).send({ message: `Error: ${error}` });
            }
        });
    }
    signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authMsgError = `Authentication failed`;
                const { username, password } = req.body;
                const user = yield Users_1.default.findOne({ username });
                if (!user)
                    throw new Error(authMsgError);
                const userpass = user.password || '';
                const passwordMatch = yield bcrypt_1.default.compare(password, userpass);
                if (!passwordMatch)
                    throw new Error(authMsgError);
                authMiddleware_1.default.createToken(user._id)
                    .then((token) => res.status(200).json({ token }))
                    .catch((error) => {
                    throw new Error(error);
                });
            }
            catch (error) {
                res.status(401).send({ message: error });
            }
        });
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
exports.default = userRoutes.router;
//# sourceMappingURL=userRoutes.js.map