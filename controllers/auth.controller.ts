import express, {Request, Response, Router} from "express";
import {checkAuth,checkRegisterType} from "../middlewares";
import {AuthService} from "../services/auth.service";

export class AuthController {

    async register(req: Request, res: Response) {
        try {
            const body = req.body;

            const user = await AuthService.getInstance().register({
                login: body.login,
                password: body.password,
                type: body.type,
            });

            res.json(user);

        } catch(err) {
            console.log(err)
            res.status(400).end();
        }
    }

    async logIn(req: Request, res: Response) {
        try {
            const token = await AuthService.getInstance().logIn({
                login: req.body.login,
                password: req.body.password
            });

            res.json({
                access_token: token
            });
        } catch(err) {
            res.status(401).send({ error: 'Invalid credentials' }).end();
        }
    }

    async me(req: Request, res: Response) {
        try {
            const decoded = AuthService.getInstance().me(req.headers.authorization);

            res.json(decoded);
        } catch(err) {
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.use(express.json())
        router.post('/register', checkRegisterType(), this.register.bind(this));
        router.post('/login', this.logIn.bind(this));
        router.get('/me', checkAuth(), this.me.bind(this));
        return router;
    }
}