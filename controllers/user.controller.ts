import {UserService} from "../services/user.service";
import express, {Request, Response, Router} from "express";

export class UserController{

    userService = UserService.getInstance();

    async getAllUsers(req:Request,res:Response){
        const users = await this.userService.getAllUsers();
        res.json(users);
    }

    async addOneUser(req:Request,res:Response){
        const reqBody = req.body;

        const user = await this.userService.addOneUser({
            name: reqBody.name,
            type: reqBody.type,
            password: reqBody.password,
            login: reqBody.login,
            address: reqBody.address,
            phone: reqBody.phone
        });

        res.json(user);
    }

    async deleteOneByLogin(req:Request,res:Response){
        try {
            const success = await this.userService.deleteById(req.params.id);

            if(success) {
                res.status(200).send({message : "User successfully deleted"}).end();
            } else {
                res.status(404).send({error : "User not found"}).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    buildRoutes():Router {
        const router = express.Router();

        router.get("/",this.getAllUsers.bind(this));

        router.post("/",express.json(),this.addOneUser.bind(this));

        router.delete("/:id",express.json(),this.deleteOneByLogin.bind(this));

        return router;
    }
}