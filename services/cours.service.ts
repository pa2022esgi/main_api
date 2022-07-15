import {CoursDocument, CoursModel, CoursProps, FileDocument, UserDocument} from "../models";

export class CoursService {
    private static instance?: CoursService;

    public static getInstance(): CoursService {
        if(CoursService.instance === undefined) {
            CoursService.instance = new CoursService();
        }
        return CoursService.instance;
    }

    private constructor() { }

    async createOne(props: Partial<CoursProps>, user: UserDocument, file: FileDocument): Promise<CoursDocument> {
        const model = new CoursModel({
            name : props.name,
            price : props.price,
            user: user,
            text: props.text,
            online: props.online,
            available: props.available,
            cover: file
        });

        return await model.save();
    }

    async getAll(): Promise<CoursDocument[]> {
        return CoursModel.find().exec();
    }

    async getOneById(id: string): Promise<CoursDocument | null> {
        return CoursModel.findById(id).exec();
    }

    async getOneByUser(user: UserDocument): Promise<CoursDocument | null> {
        return CoursModel.findOne({user: user}).exec();
    }

    async deleteById(id: string): Promise<boolean> {
        const res = await CoursModel.deleteOne({_id: id}).exec();
        return res.deletedCount === 1;
    }

    async updateById(id: string, props: Partial<CoursProps>, file: FileDocument | null): Promise<CoursDocument | null> {
        const cours = await this.getOneById(id);
        if(!cours) {
            return null;
        }

        if (file) {
            cours.cover = file;
        }

        if(props.name !== undefined) {
            cours.name = props.name;
        }
        if(props.price !== undefined) {
            cours.price = props.price;
        }
        if (props.online !== undefined) {
            cours.online = props.online
        }
        if (props.available !== undefined) {
            cours.available = props.available
        }
        if (props.text !== undefined) {
            cours.text = props.text
        }

        return await cours.save();
    }

}
