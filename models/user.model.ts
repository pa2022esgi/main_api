import mongoose, {Schema, Document, Model} from "mongoose";
import {FileProps} from "./file.model";

const userSchema = new Schema({
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    role: {
        type: Schema.Types.String,
        required: true
    },
    firstname: {
        type: Schema.Types.String,
    },
    lastname: {
        type: Schema.Types.String,
    },
    address: {
        type: Schema.Types.String
    },
    phone: {
        type: Schema.Types.String,
    },
    birthdate: {
        type: Schema.Types.Date,
    },
    profile_img: {
        type: Schema.Types.ObjectId,
        ref: "File",
        autopopulate: true
    },
    documents: [{
        type: Schema.Types.ObjectId,
        ref: "File",
        autopopulate: true
    }]
}, {
    collection: "users",
    timestamps: true,
    versionKey: false
});

userSchema.plugin(require('mongoose-autopopulate'));

userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
}

export interface UserProps {
    _id: string;
    password?: string;
    role: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    birthdate: Date;
    profile_img: FileProps;
    documents: FileProps[];
}

export type UserDocument = UserProps & Document;
export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema);