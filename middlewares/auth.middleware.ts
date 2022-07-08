import {Request, RequestHandler} from "express";
import {AuthUtil} from "../utils";
import {UserService} from "../services";

const jwt = require('jsonwebtoken')

export function checkAuth(): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            const token = AuthUtil.getToken(req.headers.authorization);

            jwt.verify(token, process.env.SECRET);
            const user = jwt.decode(token, {complete: false})

            req.body.auth =  await UserService.getInstance().getOneById(user.id);

            next();
        } catch(err) {
            res.status(401).end();
        }
    }
}