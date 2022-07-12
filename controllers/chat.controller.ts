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
                res.status(404).send({msg: 'Aucun professeur avec cet identifiant'}).end();
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

    async getUserChats(req: Request, res: Response) {
        try {
            const user = await UserService.getInstance().getOneById(req.params.user);
            if(!user) {
                res.status(404).end();
                return;
            }

            const chats = await ChatService.getInstance().getUserChats(user);

            res.json(chats)
        } catch (e) {
            res.status(400).end();
        }
    }

    async getChat(req: Request, res: Response) {
        try {
            const chat = await ChatService.getInstance().getChat(req.params.id);

            if (!chat) {
                res.status(404).end();
                return;
            }

            return res.json(chat);
        } catch (e) {
            res.status(400).end();
        }
    }

    buildRoutes():Router {
        const router = express.Router();
        router.use(express.json())

        router.get("/users/:user/chats", checkAuth(), this.getUserChats.bind(this));
        router.post("/chats", checkAuth(), this.createChat.bind(this));
        router.get("/chats/:id", checkAuth(), this.getChat.bind(this));

        return router;
    }

}