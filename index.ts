import {config} from "dotenv";
import express from 'express';
import {Request, Response} from "express";
import mongoose from "mongoose";
import {AuthController, CoursController, UserController} from "./controllers";
import {SeedUtil} from "./utils/seed.util";

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

    const cors = require('cors');
    app.use(cors({
        origin:['http://localhost:4200','http://127.0.0.1:4200'],
        credentials:true
    }));

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', ['*']);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        next();
    });

    app.get('/', function (req: Request, res: Response) {
        res.send("Welcome to api_front !");
    })

    const authController = new AuthController();
    app.use('/auth', authController.buildRoutes());
    const coursController = new CoursController();
    app.use('/cours', coursController.buildRoutes());
    const userController = new UserController();
    app.use('/users', userController.buildRoutes());

    app.listen(process.env.PORT, function () {
        console.log("Server started & listening on port " + PORT);
    })
}

startServer().catch(console.error);