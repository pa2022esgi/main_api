import express, {Router, Request, Response} from "express";
import {CommentService, CoursService, FileService, UserService} from "../services";
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
            let filter: any = {};
            let sort = '';

            if (req.query.sortBy && req.query.sortBy !== 'null') {
                sort = req.query.sortBy.toString()
            }

            if (req.query.online && req.query.online === 'true') {
                filter.online = true
            }

            if (req.query.search && req.query.search !== 'null') {
                filter.name = { $regex: '.*' + req.query.search + '.*' }
            }

            const allCours = await CoursService.getInstance().getAll(filter, sort);

            res.json(allCours);
        } catch(err) {
            res.status(500).end();
        }
    }


    async getOneCours(req: Request, res: Response) {
        try {
            const cours = await CoursService.getInstance().getOneById(req.params.id);
            if(!cours) {
                res.status(404).end();
                return;
            }

            if (req.query.user && req.query.user !== 'null') {
                const user = await UserService.getInstance().getOneById(req.query.user.toString());

                if (!user) {
                    res.status(400).end();
                    return;
                }

                cours.canComment = await CommentService.getInstance().canComment(user , cours);
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

    async getPopularCours(req: Request, res: Response) {
        try {
            const cours = await CoursService.getInstance().getPopulars();

            res.json(cours);
        } catch (e) {
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.use(express.json());
        router.post('/users/:user/cours', checkAuth(), this.createCours.bind(this));
        router.get('/users/:user/cours', checkAuth(), this.getUserCours.bind(this));
        router.get('/cours/popular', this.getPopularCours.bind(this));
        router.put('/cours/:id', checkAuth(), this.updateCours.bind(this));
        router.get('/cours/:id', this.getOneCours.bind(this));
        router.get('/cours', this.getAllCours.bind(this));

        return router;
    }
}