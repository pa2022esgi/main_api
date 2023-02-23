import {FileModel, UserDocument} from "../models";
import { PutObjectCommand, DeleteObjectCommand, S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const fs = require('fs');
require('dotenv').config()

const client = new S3Client({
    credentials: {
        accessKeyId: process.env.STORAGE_ACCESS_KEY as string,
        secretAccessKey: process.env.STORAGE_SECRET_KEY as string,
    },
    region: process.env.STORAGE_REGION,
})
  
const bucketName = process.env.STORAGE_BUCKET_NAME

export class FileService {

    private static instance?:FileService;

    static getInstance():FileService{
        if(!FileService.instance){
            FileService.instance = new FileService();
        }
        return FileService.instance;
    }

    async deleteById(id: string): Promise<boolean> {
        const file = await FileModel.findById(id).exec();

        if(!file) {
            return false;
        }

        const paramsDelete = {
            Bucket: bucketName,
            Key: file.url.split(`https://${bucketName}.s3.amazonaws.com/`)[1]
        }

        await client.send(new DeleteObjectCommand(paramsDelete))

        const res = await FileModel.deleteOne({_id: id}).exec();
        return res.deletedCount === 1;
    }

    async uploadDocument(file: any, user: UserDocument) {
        const paramsUpload = {
            Bucket: bucketName,
            Key: `documents/${user._id}/${file.name}`,
            Body: fs.readFileSync(file.tempFilePath),
            ContentType: file.mimetype
        }
        
        await client.send(new PutObjectCommand(paramsUpload))

        const url = `https://${bucketName}.s3.amazonaws.com/documents/${user._id}/${file.name}`

        const doc = new FileModel({
            url: url,
            name: file.name
        });
        await doc.save();

        return doc;
    }

    async uploadUserDocument(file: any, user: UserDocument) {
        const paramsUpload = {
            Bucket: bucketName,
            Key: `user_doc/${user._id}/${file.name}`,
            Body: fs.readFileSync(file.tempFilePath),
            ContentType: file.mimetype
        }
        
        await client.send(new PutObjectCommand(paramsUpload))

        const url = `https://${bucketName}.s3.amazonaws.com/user_doc/${user._id}/${file.name}`

        const doc = new FileModel({
            url: url,
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

    async getUserDocumentById(id: string) {
        const file = await FileModel.findById(id).exec();

        if (!file) {
            return null;
        }

        const params = {
            Bucket: bucketName,
            Key: file.url.split(`https://${bucketName}.s3.amazonaws.com/`)[1]
        }

        const command = new GetObjectCommand(params);

        return await getSignedUrl(client, command, { expiresIn: 3600 });
    }

    async uploadProfilePicture(file: any, user: UserDocument) {
        const paramsUpload = {
            Bucket: bucketName,
            Key: `profile_pic/${user._id}/${file.name}`,
            Body: fs.readFileSync(file.tempFilePath),
            ContentType: file.mimetype
        }
        
        await client.send(new PutObjectCommand(paramsUpload))

        const url = `https://${bucketName}.s3.amazonaws.com/profile_pic/${user._id}/${file.name}`

        const doc = new FileModel({
            url: url,
            name: file.name
        });
        await doc.save();

        user.profile_img = doc;
        await user.save();

        return doc;
    }

    private constructor() {}

}