"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const videoRoutes_1 = __importDefault(require("./routes/videoRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = process.env.PORT || 4000;
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://youtube-clone-api-sigma.vercel.app"], // frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use((0, express_fileupload_1.default)({
    useTempFiles: true, // store files temporarily
    tempFileDir: "/tmp/",
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/api/v1/users", userRoutes_1.default);
app.use("/api/v1/videos", videoRoutes_1.default);
app.use("/api/v1/comments", commentRoutes_1.default);
(0, db_1.default)();
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
