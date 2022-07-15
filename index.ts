import {config} from "dotenv";
import express from 'express';
import {Request, Response} from "express";
import mongoose from "mongoose";
import {
    AuthController,
    CoursController,
    UserController,
    FileController,
    SocketController,
    ChatController, SlotController
} from "./controllers";
import {SeedUtil} from "./utils";
import {CommentController} from "./controllers";

config();

async function startServer(): Promise<void> {
    const PORT = process.env.PORT

    await mongoose.connect(process.env.MONGO_URI as string, {
        auth: {
            username: process.env.MONGO_USER  as string,
            password: process.env.MONGO_PASSWORD as string
        }
    });

    await SeedUtil.seed(true,false);

    const app = express();

    const fileUpload = require('express-fileupload');
    app.use(fileUpload({useTempFiles: true}))

    const cors = require('cors');
    app.use(cors({
        origin: process.env.FRONT_URL,
        credentials:true
    }));

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', ['*']);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
        next();
    });

    app.get('/', function (req: Request, res: Response) {
        res.send("Welcome to api_front !");
    })

    const authController = new AuthController();
    app.use('/auth', authController.buildRoutes());
    const coursController = new CoursController();
    app.use('', coursController.buildRoutes());
    const userController = new UserController();
    app.use('/users', userController.buildRoutes());
    const fileController = new FileController();
    app.use('', fileController.buildRoutes());
    const chatController = new ChatController();
    app.use('', chatController.buildRoutes());
    const slotController = new SlotController();
    app.use('', slotController.buildRoutes());
    const commentController = new CommentController();
    app.use('', commentController.buildRoutes());

    const server = app.listen(process.env.PORT, function () {
        console.log("Server started & listening on port " + PORT);
    })

    SocketController.init(server)
}

startServer().catch(console.error);