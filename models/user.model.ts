import mongoose, {Schema,Document,Model} from "mongoose";
import {UserTypeProps} from "./user-type.model";

const UserSchema = new Schema({
    login: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    name: {
        type: Schema.Types.String,
        required: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    type: {
        type: Schema.Types.Number,
        ref: "UserType"
    },
    address: {
        type: Schema.Types.String
    },
    phone: {
        type: Schema.Types.Number,
    }
}, {
    collection: "users",
    timestamps: true,
    versionKey: false
});

export interface UserProps{
    login:string;
    password:string;
    name:string;
    type:UserTypeProps;
    address:string;
    phone:number;
}

export type UserDocument = UserProps & Document;

export const UserModel:Model<UserDocument> = mongoose.model<UserDocument>("users",UserSchema);