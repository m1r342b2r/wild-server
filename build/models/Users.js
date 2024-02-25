"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    posts: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Post'
        }]
});
exports.default = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=Users.js.map