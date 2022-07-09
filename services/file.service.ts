import {FileModel, UserDocument, UserModel} from "../models";

const cloudinary = require("cloudinary");
require('dotenv').config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export class FileService {

    private static instance?:FileService;

    static getInstance():FileService{
        if(!FileService.instance){
            FileService.instance = new FileService();
        }
        return FileService.instance;
    }

    async deleteById(id: string): Promise<boolean> {
        const res = await FileModel.deleteOne({_id: id}).exec();
        return res.deletedCount === 1;
    }

    async uploadDocument(file: any, user: UserDocument) {
        const result =  await cloudinary.v2.uploader.upload(file.tempFilePath, {
            resource_type: "auto",
            folder: "documents/" + user._id
        })

        const doc = new FileModel({
            url: result.url,
            name: file.name
        });
        await doc.save();

        return doc;
    }

    async uploadUserDocument(file: any, user: UserDocument) {
        const result =  await cloudinary.v2.uploader.upload(file.tempFilePath, {
            resource_type: "auto",
            folder: "user_doc/" + user._id
        })

        const doc = new FileModel({
            url: result.url,
            name: file.name
        });
        await doc.save();

        user.documents.push(doc);
        await user.save();

        return doc;
    }

    async findOneById(id: string) {
        return await FileModel.findById(id).exec();
    }

    async uploadProfilePicture(file: any, user: UserDocument) {
        const result =  await cloudinary.v2.uploader.upload(file.tempFilePath, {
            resource_type: "auto",
            folder: "profile_pic/" + user._id
        })

        const doc = new FileModel({
            url: result.url,
            name: file.name
        });
        await doc.save();

        user.profile_img = doc;
        await user.save();

        return doc;
    }

    private constructor() {}

}