import {UserDocument, UserModel, UserProps} from "../models";
import {AuthUtil} from "../utils";

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

    public async addOneUser(userProps: Partial<UserProps>):Promise<UserDocument>{
        const userModel = new UserModel({
            firstname: userProps.firstname,
            role: userProps.role,
            email: userProps.email,
            password: userProps.password,
            address: userProps.address,
            phone: userProps.phone
        });
        return await userModel.save();
    }

    async getOneById(id: string): Promise<UserDocument | null> {
        return UserModel.findById(id).exec();
    }

    async getOneByEmail(email: string): Promise<UserDocument | null> {
        return await UserModel.findOne({email : email}).exec();
    }

    public async deleteById(id: string): Promise<boolean> {
        const res = await UserModel.deleteOne({_id: id}).exec();
        return res.deletedCount === 1;
    }

    public async updateById(id: string, props: UserProps): Promise<UserDocument | null> {
        const user = await this.getOneById(id);
        if(!user) {
            return null;
        }

        if (props.email !== undefined) {
            user.email = props.email;
        }
        if (props.firstname !== undefined) {
            user.firstname = props.firstname;
        }
        if (props.lastname !== undefined) {
            user.lastname = props.lastname;
        }
        if (props.phone !== undefined) {
            user.phone = props.phone;
        }
        if (props.address !== undefined) {
            user.address = props.address;
        }
        if (props.birthdate !== undefined) {
            user.birthdate = props.birthdate;
        }
        if (props.password !== undefined) {
            user.password = AuthUtil.sha512(props.password);
        }

        return await user.save();
    }
}