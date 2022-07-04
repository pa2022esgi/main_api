import {UserService} from "../services";
import express, {Request, Response, Router} from "express";
import {checkAuth} from "../middlewares";

export class UserController{

    userService = UserService.getInstance();

    async getAllUsers(req:Request,res:Response){
        const users = await this.userService.getAllUsers();
        res.json(users);
    }

    async addOneUser(req:Request,res:Response){
        try {
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
        } catch (e) {
            res.status(400).end();
        }
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

    async me(req: Request, res: Response) {
        res.json(req.body.auth);
    }

    buildRoutes():Router {
        const router = express.Router();
        router.use(express.json())

        router.get("/",this.getAllUsers.bind(this));
        router.post("/",this.addOneUser.bind(this));
        router.delete("/:id",this.deleteOneByLogin.bind(this));

        router.get("/me", checkAuth(), this.me.bind(this));
        return router;
    }
}