import {FileModel, UserDocument, UserModel} from "../models";

const cloudinary = require("cloudinary");
require('dotenv').config()
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export class FileService {

    private static instance?:FileService;

    static getInstance():FileService{
        if(!FileService.instance){
            FileService.instance = new FileService();
        }
        return FileService.instance;
    }

    async uploadProfilePicture(file: any, user: UserDocument) {
        const result =  await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "auto"
        })

        const doc = new FileModel({
            url: result.url,
        });

        await doc.save();
        user.profile_img = doc;
        await user.save();

        return result.url;
    }

    private constructor() {}

}