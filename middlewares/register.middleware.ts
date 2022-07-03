import {Request, RequestHandler} from "express";

export function checkRegisterType(): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            const body = req.body
            const error: Record<string, any> = {};

            const emailRegex = /^\s*[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}\s*$/;
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}/ ;

            if(!body.login) {
                error.login = "missing parameter login"
            } else if(!emailRegex.test(body.login)){
                error.login = "bad format";
            }

            if(!body.password) {
                error.password = "missing parameter password"
            } else if(!passwordRegex.test(<string>body.password)){
                error.password = "min 8 characters, 1 uppercase, 1 number";
            }

            if(!body.type) {
                error.type = "missing parameter"
            } else {
                if (!["élève", "professeur"].includes(body.type)) {
                    error.type = "bad format"
                }
            }

            if (Object.keys(error).length !== 0) {
                console.log(error)
                res.status(400).send(error).end();
                return;
            }

            next();
        } catch(err) {
            res.status(400).end();
        }
    }
}