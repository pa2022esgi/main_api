import express, {Request, Response, Router} from "express";
import {checkAuth} from "../middlewares";
import {CommentService, CoursService} from "../services";

export class CommentController {

    async createComment(req: Request, res: Response) {
        try {
            const cours = await CoursService.getInstance().getOneById(req.params.lesson)

            if (!cours) {
                res.status(404).end();
                return
            }

            const comment = await CommentService.getInstance().createOne(req.body, req.body.auth, cours);

            res.json(comment);
        } catch (e) {
            res.status(400).end();
        }
    }

    async deleteComment(req: Request, res: Response) {
        try {
            const success = await CommentService.getInstance().deleteById(req.params.id);

            if(success) {
                res.status(200).send().end();
            } else {
                res.status(404).send().end();
            }
        } catch (e) {
            res.status(400).end();
        }
    }
    buildRoutes():Router {
        const router = express.Router();
        router.use(express.json())

        router.post("/lessons/:lesson/comments", checkAuth(), this.createComment.bind(this));
        router.delete("/comments/:id", checkAuth(), this.deleteComment.bind(this));

        return router;
    }
}