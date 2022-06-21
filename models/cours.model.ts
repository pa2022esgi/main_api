import mongoose, {Schema, Document, Model} from "mongoose";
import {UserProps} from "./user.model";

const coursSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    price: {
        type: Schema.Types.Number,
        required: true
    },
    user: {
        type: Schema.Types.String,
        //ref: "User",
        //required: true
    },
}, {
    collection: "cours",
    timestamps: true,
    versionKey: false
});

export interface CoursProps {
    _id: string
    name: string;
    price: number;
    user?: string;
}

export type CoursDocument = CoursProps & Document;
export const CoursModel: Model<CoursDocument> = mongoose.model<CoursDocument>("Cours", coursSchema);