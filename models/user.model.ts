import mongoose, {Schema, Document, Model} from "mongoose";

const userSchema = new Schema({
    login: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    type: {
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
}, {
    collection: "users",
    timestamps: true,
    versionKey: false
});

userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
}

export interface UserProps {
    _id: string;
    password?: string;
    type: string;
    firstname: string;
    lastname: string;
    login: string;
    phone: string;
    address: string;
    birthdate: Date;
}

export type UserDocument = UserProps & Document;
export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema);