import express, {Request, Response, Router} from "express";
import {checkAuth} from "../middlewares";
import {ChatService, UserService} from "../services";

export class ChatController {

    async createChat(req: Request, res: Response) {
        try {
            const body = req.body
            const user1 = await UserService.getInstance().getOneById(body.creator);
            const user2 = await UserService.getInstance().getOneById(body.goal);
            if(!user1) {
                res.status(404).end();
                return;
            }

            if(!user2) {
                res.status(404).send({msg: 'Aucun professeur avec cette identifiant'}).end();
                return;
            }

            const users = [user1, user2];
            const exist = await ChatService.getInstance().exist(users);
            if (exist) {
                res.status(400).send({msg: 'Une conversation avec ce professeur existe déjà'}).end();
                return;
            }

            const chat = await ChatService.getInstance().create(users);

            res.json(chat);
        } catch (e) {
            res.status(400).end();
        }
    }

    buildRoutes():Router {
        const router = express.Router();
        router.use(express.json())

        router.post("", checkAuth(), this.createChat.bind(this));
        return router;
    }

}