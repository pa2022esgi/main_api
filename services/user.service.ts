import {UserDocument, UserModel, UserProps} from "../models/user.model";
import {UserTypeProps} from "../models/user-type.model";

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
            type: userProps.type,
            login: userProps.login,
            password: userProps.password,
            address: userProps.address,
            phone: userProps.phone
        });
        return await userModel.save();
    }

    public async deleteById(id: string): Promise<boolean> {
        const res = await UserModel.deleteOne({_id: id}).exec();
        return res.deletedCount === 1;
    }
}