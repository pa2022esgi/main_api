import mongoose, {Schema, Document, Model} from "mongoose";
import {UserDocument} from "./user.model";

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
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        autopopulate: true
    },
    text: {
        type: Schema.Types.String,
        required: true,
    },
    online: {
        type: Schema.Types.Boolean,
        required: true,
    },
    available: {
        type: Schema.Types.Boolean,
        required: true,
    },
    cover: {
        type: Schema.Types.ObjectId,
        ref: "File",
        autopopulate: true,
        required: true,
    }
}, {
    collection: "cours",
    timestamps: true,
    versionKey: false
});

coursSchema.plugin(require('mongoose-autopopulate'));

export interface CoursProps {
    _id: string
    name: string;
    price: number;
    user: UserDocument;
    online: boolean;
    available: boolean;
    cover: boolean;
    text: string;
}

export type CoursDocument = CoursProps & Document;
export const CoursModel: Model<CoursDocument> = mongoose.model<CoursDocument>("Cours", coursSchema);