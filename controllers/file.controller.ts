import express, {Request, Response, Router} from "express";
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

                const file = await FileService.getInstance().uploadProfilePicture(req.files.file!, user);

                res.json(file);
            }
        } catch (e) {
            res.status(400).end();
        }
    }

    async uploadUserDocuments(req: any, res:Response) {
        try {
            if (req.files) {
                const user = await UserService.getInstance().getOneById(req.params.user);
                if(!user) {
                    res.status(404).end();
                    return;
                }

                const file = await FileService.getInstance().uploadUserDocument(req.files.file!, user);

                res.json(file);
            }
        } catch (e) {
            res.status(400).end();
        }
    }

    async deleteUserFile(req: Request, res: Response) {
        try {
            const success = await FileService.getInstance().deleteById(req.params.id);

            if(success) {
                res.status(200).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    buildRoutes():Router {
        const router = express.Router();

        router.post("/:user/documents/profile", checkAuth(), this.uploadProfilePicture.bind(this));
        router.post("/:user/documents", checkAuth(), this.uploadUserDocuments.bind(this));
        router.delete("/:user/documents/:id", checkAuth(), this.deleteUserFile.bind(this));
        return router;
    }
}