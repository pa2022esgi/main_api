import express, {Router, Request, Response} from "express";
import { CoursService } from "../services";
import {checkAuth, checkCours,} from "../middlewares";

export class CoursController {
    async createCours(req: Request, res: Response) {
        const body = req.body;
        if(!body.name || !body.price || !body.user || !body.score){
            res.status(400).end();
            return;
        }
        try {
            const cours = await CoursService.getInstance().createOne({
                name: body.name,
                price: body.price,
                user: body.user,
                score: body.score,
            });

            res.json(cours);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async getAllCours(req: Request, res: Response) {
        try {
            const allCours = await CoursService.getInstance().getAll();
            res.json(allCours);
        } catch(err) {
            res.status(500).end();
        }
    }


    async getOneCours(req: Request, res: Response) {
        try {
            const cours = await CoursService.getInstance().getOneById(req.params.id);
            if(!cours) {
                res.status(404).send({error : "Cours not found"}).end();
                return;
            }
            res.json(cours);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async deleteCours(req: Request, res: Response) {
        try {
            const success = await CoursService.getInstance().deleteById(req.params.id);
            if(success) {
                res.status(200).send({message : "Cours successfully deleted"}).end();
            } else {
                res.status(404).send({error : "Cours not found"}).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async updateCours(req: Request, res: Response) {
        try {
            const cours = await CoursService.getInstance().updateById(req.params.id, req.body);

            if(!cours) {
                res.status(404).send({error : "Cours not found"}).end();
                return;
            }

            res.json(cours);
        } catch (err) {
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.use(express.json());
        router.post('/', this.createCours.bind(this));
        router.get('/cours', this.getAllCours.bind(this));
        router.get('/cour/:id',  this.getOneCours.bind(this));
        router.delete('/cour/:id', this.deleteCours.bind(this));
        router.put('/cour/:id', [checkCours()], this.updateCours.bind(this));
        return router;
    }
}