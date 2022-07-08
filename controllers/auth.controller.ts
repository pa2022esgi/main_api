import express, {Request, Response, Router} from "express";
import {AuthService, UserService} from "../services";

export class AuthController {

    async register(req: Request, res: Response) {
        try {
            const body = req.body;

            const exist = await UserService.getInstance().getOneByEmail(body.email);
            if (exist) {
                res.status(400).send({ msg: 'Un utilisateur avec cet email existe déjà' }).end();
                return;
            }

            const user = await AuthService.getInstance().register({
                email: body.email,
                password: body.password,
                role: body.role,
            });

            const token = await AuthService.getInstance().logIn({
                email: body.email,
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
                email: body.email,
                password: body.password
            });

            const user = await UserService.getInstance().getOneByEmail(body.email);

            res.json({user: user, token: token});
        } catch(err) {
            res.status(401).send({msg: "Accés refusé"}).end();
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