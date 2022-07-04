import {Request, RequestHandler} from "express";

export function checkCours(all: boolean = false): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            const body = req.body;
            const error: Record<string, any> = {};

            if (all) {
                if(!body.name) {
                    error.name = "missing parameter"
                }

                if(!body.price) {
                    error.price = "missing parameter"
                }

                if(!body.user) {
                    error.user = "missing parameter"
                }

                if(!body.score) {
                    error.score = "missing parameter"
                }

            }


            if (Object.keys(error).length !== 0) {
                res.status(400).send(error).end();
                return;
            }

            next();
        } catch(err) {
            res.status(400).send().end();
        }
    }
}