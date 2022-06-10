import mongoose, {Schema,Document,Model} from "mongoose";

const UserSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    type: {
        type: Schema.Types.String,
        required: true
    }
});

export interface UserProps{
    name:string;
    type:string;
}

export type UserDocument = UserProps & Document;

export const UserModel:Model<UserDocument> = mongoose.model<UserDocument>("users",UserSchema);