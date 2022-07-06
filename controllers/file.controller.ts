import express, {Response, Router} from "express";
import {checkAuth} from "../middlewares";
import {FileService, UserService} from "../services";

export class FileController {

    async uploadProfilePicture(req: any, res:Response) {

        try {
            if (req.files) {
                const user = await UserService.getInstance().getOneById(req.params.user);
                if(!user) {
                    res.status(404).end();
                    return;
                }

                const url = await FileService.getInstance().uploadProfilePicture(req.files.file!, user);

                res.send({url}).end();
            }
        } catch (e) {
            res.status(400).end();
        }

    }

    buildRoutes():Router {
        const router = express.Router();

        router.post("/:user/documents/profile", checkAuth(), this.uploadProfilePicture.bind(this));

        return router;
    }
}