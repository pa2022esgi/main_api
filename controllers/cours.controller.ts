import express, {Router, Request, Response} from "express";
import {CoursService, FileService, UserService} from "../services";
import {checkAuth} from "../middlewares";

export class CoursController {
    async createCours(req: any, res: Response) {
        const body = req.body;
        try {
            const user = await UserService.getInstance().getOneById(req.params.user);
            if(!user) {
                res.status(404).end();
                return;
            }

            const file = await FileService.getInstance().findOneById(body.file);
            if(!file) {
                res.status(404).end();
                return;
            }

            const cours = await CoursService.getInstance().createOne(body, user, file);

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
                res.status(404).send().end();
                return;
            }
            res.json(cours);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async getUserCours(req: Request, res: Response){
        try {
            const user = await UserService.getInstance().getOneById(req.params.user);
            if(!user) {
                res.status(404).end();
                return;
            }

            const cours = await CoursService.getInstance().getOneByUser(user);
            if(!cours) {
                res.status(404).send({msg : "Cet utilsateur n'a aucun cours"}).end();
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
            const body = req.body;

            let cover = null;

            if (body.file) {
                const file = await FileService.getInstance().findOneById(body.file);
                if(!file) {
                    res.status(404).end();
                    return;
                } else {
                    cover = file;
                }
            }

            const cours = await CoursService.getInstance().updateById(req.params.id, body, cover);

            if(!cours) {
                res.status(404).end();
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
        router.post('/users/:user/cours', checkAuth(), this.createCours.bind(this));
        router.get('/users/:user/cours', checkAuth(), this.getUserCours.bind(this));
        router.put('/cours/:id', this.updateCours.bind(this));

        router.get('/cour/:id',  this.getOneCours.bind(this));
        router.get('/cours', this.getAllCours.bind(this));
        router.get('/cour/:id',  this.getOneCours.bind(this));
        router.delete('/cour/:id', this.deleteCours.bind(this));
        return router;
    }
}