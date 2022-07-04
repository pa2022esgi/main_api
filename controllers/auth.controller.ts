import express, {Request, Response, Router} from "express";
import {checkAuth} from "../middlewares";
import {AuthService} from "../services";

export class AuthController {

    async register(req: Request, res: Response) {
        try {
            const body = req.body;

            const exist = await AuthService.getInstance().getOneByLogin(body.login);

            if (exist) {
                res.status(400).send({ error: 'Already exist' }).end();
                return;
            }

            const user = await AuthService.getInstance().register({
                login: body.login,
                password: body.password,
                type: body.type,
            });

            const token = await AuthService.getInstance().logIn({
                login: body.login,
                password: body.password
            });

            res.json({user: user, token: token});
        } catch(err) {
            res.status(400).end();
        }
    }

    async logIn(req: Request, res: Response) {
        try {
            const body = req.body;

            const token = await AuthService.getInstance().logIn({
                login: body.login,
                password: body.password
            });

            const user = await AuthService.getInstance().getOneByLogin(body.login);

            res.json({user: user, token: token});
        } catch(err) {
            res.status(401).send({ error: 'Invalid credentials' }).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.use(express.json())
        router.post('/register', this.register.bind(this));
        router.post('/login', this.logIn.bind(this));
        return router;
    }
}