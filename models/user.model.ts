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
    name: {
        type: Schema.Types.String,
        required: false
    },
    type: {
        type: Schema.Types.String,
    },
    address: {
        type: Schema.Types.String
    },
    phone: {
        type: Schema.Types.Number,
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
    name: string;
    type: string;
    login: string;
    password?: string;
    phone: number;
    address: string;
}

export type UserDocument = UserProps & Document;
export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema);