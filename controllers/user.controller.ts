import {UserService} from "../services/user.service";
import express, {Request, Response, Router} from "express";

export class UserController{

    userService = UserService.getInstance();
    public static instance?:UserController;

    private constructor() {
    }

    async getAllUsers(req:Request,res:Response){
        const users = await this.userService.getAllUsers();
        res.json(users);
    }

    async addOneUser(req:Request,res:Response){
        const reqBody = req.body;
        const user = await this.userService.addOneUser({
            name: reqBody.name,
            type: reqBody.type
        });
        res.json(user);
    }

    buildRoutes():Router {
        const router = express.Router();

        router.get("/",this.getAllUsers.bind(this));

        router.post("/",express.json(),this.addOneUser.bind(this));

        return router;
    }

    static getInstance():UserController{
        if(!UserController.instance){
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }
}