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

    async getOneByLogin(login: string): Promise<UserDocument | null> {
        return await UserModel.findOne({login : login}).exec();
    }

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

    public me(token: string | undefined): string {
        const extracted = AuthUtil.getToken(token)

        const content = jwt.decode(extracted, {complete: false})
        content.iat = new Date(content.iat * 1000).toISOString();
        content.exp = new Date(content.exp * 1000).toISOString();

        return content;
    }
}
