import {AuthUtil} from "../utils";
import {UserDocument, UserModel, UserProps} from "../models";

const jwt = require('jsonwebtoken')

export class AuthService {

    private static instance?: AuthService;

    public static getInstance(): AuthService {
        if(AuthService.instance === undefined) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private constructor() { }

    public async register(props: Partial<UserProps>): Promise<UserDocument> {

        const model = new UserModel({
            login: props.login,
            password: AuthUtil.sha512(props.password!),
            type: props.type,
        });

        return await model.save();
    }

    public async logIn(props: Partial<UserProps>): Promise<string> {

        const user = await UserModel.findOne({
            login: props.login,
            password: AuthUtil.sha512(props.password!),
        }).exec();

        if (!user) {
            throw new Error('User not found');
        }

        return await jwt.sign({
            id: user.id,
            email: user.login,
            type: user.type
        }, process.env.SECRET, {expiresIn: '1d'})
    }
}
