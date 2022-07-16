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

    async getPopularComments(req: Request, res: Response) {
        try {
            const comments = await CommentService.getInstance().getPopularComments();

            res.json(comments);
        } catch (e) {
            res.status(400).end();
        }
    }

    async getComments(req: Request, res: Response) {
        try {
            const comments = await CommentService.getInstance().getComments();

            res.json(comments);
        } catch (e) {
            res.status(400).end();
        }
    }

    buildRoutes():Router {
        const router = express.Router();
        router.use(express.json())

        router.post("/lessons/:lesson/comments", checkAuth(), this.createComment.bind(this));
        router.delete("/comments/:id", checkAuth(), this.deleteComment.bind(this));
        router.get("/comments/popular", this.getPopularComments.bind(this))
        router.get("/comments", checkAuth(), this.getComments.bind(this))

        return router;
    }
}