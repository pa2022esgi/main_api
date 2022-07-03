import {config} from "dotenv";
import express from 'express';
import {Request, Response} from "express";
import mongoose from "mongoose";
import {AuthController, CoursController, InfoController} from "./controllers";
import {SeedUtil} from "./utils/seed.util";
import {UserController} from "./controllers/user.controller";

config();

async function startServer(): Promise<void> {
    const PORT = process.env.PORT
    const userController = UserController.getInstance();

    await mongoose.connect(process.env.MONGO_URI as string, {
        auth: {
            username: process.env.MONGO_USER  as string,
            password: process.env.MONGO_PASSWORD as string
        }
    });

    await SeedUtil.seed(true,false);

    const app = express();

    app.use((req, res, next) => {
        res.append('Access-Control-Allow-Origin', ['*']);
        res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.append('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });

    var cors = require('cors')
    app.listen(80, function () {
        console.log('CORS-enabled web server listening on port 80')
    })
    app.get('/', function (req: Request, res: Response) {
        res.send("Welcome to api_front !");
    })

    const authController = new AuthController();
    app.use('/auth', authController.buildRoutes());
    const coursController = new CoursController();
    app.use('/cours', coursController.buildRoutes());
    const infoController = new InfoController();
    app.use('/info', infoController.buildRoutes());
    app.use('/users',userController.buildRoutes());

    app.listen(process.env.PORT, function () {
        console.log("Server started & listening on port " + PORT);
    })
}

startServer().catch(console.error);