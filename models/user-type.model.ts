import mongoose, {Schema, Document, Model} from "mongoose";

const userTypeSchema = new Schema({
    role: {
        type: Schema.Types.String,
        required: true
    },

}, {
    collection: "user_types",
    versionKey: false
});

export interface UserTypeProps {
    role: string;
}

export type UserTypeDocument = UserTypeProps & Document;
export const UserTypeModel: Model<UserTypeDocument> = mongoose.model<UserTypeDocument>("UserType", userTypeSchema);