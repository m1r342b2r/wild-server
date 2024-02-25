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
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const log4js_1 = __importDefault(require("log4js"));
const logger = log4js_1.default.getLogger();
logger.level = "debug";
require('dotenv').config();
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    // Este método será para configurar el servidor
    config() {
        return __awaiter(this, void 0, void 0, function* () {
            // Connection to DB
            const DBURI = process.env.MONGODB_URL;
            mongoose_1.default.connect(DBURI).then(db => logger.debug('DB Connected.'));
            // Configurations
            const SERVERPORT = process.env.SERVER_PORT;
            this.app.set('port', SERVERPORT || 3001);
            // Middlewares
            this.app.use(express_1.default.json());
            this.app.use(express_1.default.urlencoded({ extended: false }));
            this.app.use((0, morgan_1.default)('dev'));
            this.app.use((0, helmet_1.default)());
            this.app.use((0, compression_1.default)());
            this.app.use((0, cors_1.default)());
            this.app.use((0, express_validator_1.query)());
        });
    }
    // Método para configurar las rutas
    routes() {
        this.app.use(indexRoutes_1.default);
        this.app.use('/api/posts', postRoutes_1.default);
        this.app.use('/api/users', userRoutes_1.default);
    }
    // Método para iniciar el server.
    start() {
        this.app.listen(this.app.get('port'), () => {
            logger.debug(`Server listen on port: ${this.app.get('port')}`);
        });
    }
}
const server = new Server();
server.start();
//# sourceMappingURL=server.js.map