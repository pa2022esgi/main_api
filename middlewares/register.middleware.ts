import {Request, RequestHandler} from "express";
import {UserTypeModel} from "../models";

export function checkRegisterType(): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            const body = req.body
            const error: Record<string, any> = {};

            if(!body.login) {
                error.login = "missing parameter"
            }

            if(!body.password) {
                error.password = "missing parameter"
            }

            if(!body.type) {
                error.type = "missing parameter"
            } else {
                const exist = await UserTypeModel.findById(body.type);

                if(!exist) {
                    res.status(400).end();
                    return;
                }
            }

            next();
        } catch(err) {
            res.status(401).send({ error: 'Access restricted' }).end();
        }
    }
}