import {config} from "dotenv";
import express from 'express';
import {Request, Response} from "express";
import mongoose from "mongoose";

config();

async function startServer(): Promise<void> {
    const PORT = process.env.PORT

    await mongoose.connect(process.env.MONGO_URI as string, {
        auth: {
            username: process.env.MONGO_USER  as string,
            password: process.env.MONGO_PASSWORD as string
        }
    });

    const app = express();
    app.get('/', function (req: Request, res: Response) {
        res.send("Welcome to api_front !");
    })


    app.listen(process.env.PORT, function () {
        console.log("Server started & listening on port " + PORT);
    })
}

startServer().catch(console.error);