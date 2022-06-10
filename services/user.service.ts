import {UserDocument, UserModel, UserProps} from "../models/user.model";

export class UserService{

    private static instance?:UserService;

    static getInstance():UserService{
        if(!UserService.instance){
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    private constructor() {}

    public getAllUsers():Promise<UserDocument[]>{
        return UserModel.find().exec();
    }

    public async addOneUser(userProps:UserProps):Promise<UserDocument>{
        const userModel = new UserModel({
            name: userProps.name,
            type: userProps.type
        });
        return await userModel.save();
    }
}