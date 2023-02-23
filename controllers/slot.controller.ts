import express, {Request, Response, Router} from "express";
import {checkAuth} from "../middlewares";
import {CommentService, CoursService, SlotService, UserService} from "../services";

export class SlotController {

    async createSlot(req: Request, res:Response) {
        try {
            const body = req.body;

            const user = await UserService.getInstance().getOneById(body.user);
            if (!user) {
                res.status(400).end();
                return;
            }

            const lesson = await CoursService.getInstance().getOneById(req.params.lesson)
            if (!lesson) {
                res.status(400).end();
                return;
            }

            const slot = await SlotService.getInstance().createSlot({
                date: body.date,
                start_time: body.start_time,
                end_time: body.end_time,
                user: user,
                cours: lesson,
                online: body.online
            });

            return res.json(slot);
        } catch (e) {
            res.status(400).end();
        }
    }

    async getSlots(req: Request, res: Response) {
        try {
            const cours = await CoursService.getInstance().getOneById(req.params.lesson);

            if (!cours) {
                res.status(400).end();
                return;
            }

            const slots = await SlotService.getInstance().getSlots(cours, req.query.type!.toString());

            res.json(slots);
        } catch (e) {
            res.status(400).end();
        }
    }

    async getUserSlots(req: Request, res: Response) {
        try {
            const user = await UserService.getInstance().getOneById(req.params.user);

            if (!user) {
                res.status(400).end();
                return;
            }

            const slots = await SlotService.getInstance().getUserSlots(user, req.query.type!.toString());

            res.json(slots);
        } catch (e) {
            res.status(400).end();
        }
    }

    async deleteSlot(req: Request, res: Response) {
        try {
            const success = await SlotService.getInstance().deleteById(req.params.id);

            if(success) {
                res.status(200).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async paySlot(req: Request, res: Response) {
        try {
            const slot = await SlotService.getInstance().findOneById(req.params.id);

            if (!slot) {
                res.status(404).end();
                return;
            }

            await SlotService.getInstance().paySlot(slot, req.body.token);

            res.status(200).end();
        } catch (e) {
            res.status(400).end();
        }
    }

    async getAllSlots(req: Request, res: Response) {
        try {
            let groupBy = false;

            if (req.query.groupBy && req.query.groupBy === 'true') {
                groupBy = true
            }

            const slots = await SlotService.getInstance().getAllSlots(groupBy);

            res.json(slots);
        } catch (e) {
            res.status(400).end();
        }
    }

    buildRoutes():Router {
        const router = express.Router();
        router.use(express.json())

        router.post("/cours/:lesson/slots", checkAuth(), this.createSlot.bind(this));
        router.get("/cours/:lesson/slots", checkAuth(), this.getSlots.bind(this));
        router.get("/users/:user/slots", checkAuth(), this.getUserSlots.bind(this));
        router.delete("/slots/:id", checkAuth(), this.deleteSlot.bind(this));
        router.put("/slots/:id/pay", checkAuth(), this.paySlot.bind(this));
        router.get("/slots", checkAuth(), this.getAllSlots.bind(this));

        return router;
    }


}