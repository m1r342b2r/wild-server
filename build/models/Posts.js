"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    createAt: { type: Date, default: Date.now() },
    updateAt: Date
});
exports.default = (0, mongoose_1.model)('Post', postSchema);
//# sourceMappingURL=Posts.js.map