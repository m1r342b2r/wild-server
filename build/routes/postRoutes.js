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
const Posts_1 = __importDefault(require("../models/Posts"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
class PostRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield Posts_1.default.find();
            res.json(posts);
        });
    }
    getPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Posts_1.default.findOne({ url: req.params.url });
            res.json(post);
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, url, content, image } = req.body;
            // Colicos Renales
            try {
                const newPost = new Posts_1.default({ title, url, content, image });
                const result = yield newPost.save();
                res.json({ data: newPost });
            }
            catch (error) {
                res.status(404).send({ error: `Error: ${error}` });
            }
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { url } = req.params;
                const post = yield Posts_1.default.findOneAndUpdate({ url }, req.body, { new: true });
                res.json(post);
            }
            catch (error) {
                res.status(404).send({ message: `Error: ${error}` });
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { url } = req.params;
                yield Posts_1.default.findOneAndDelete({ url });
                res.json({ message: 'Post deleted succeddfully' });
            }
            catch (error) {
                res.status(404).send({ message: `Error: ${error}` });
            }
        });
    }
    routes() {
        this.router.get('/', authMiddleware_1.default.verifyToken, this.getPosts);
        this.router.get('/:url', authMiddleware_1.default.verifyToken, this.getPost);
        this.router.post('/', authMiddleware_1.default.verifyToken, this.createPost);
        this.router.put('/:url', authMiddleware_1.default.verifyToken, this.updatePost);
        this.router.delete('/:url', authMiddleware_1.default.verifyToken, this.deletePost);
    }
}
const postRoutes = new PostRoutes();
exports.default = postRoutes.router;
//# sourceMappingURL=postRoutes.js.map