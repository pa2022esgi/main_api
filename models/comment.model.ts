import mongoose, {Schema, Document, Model} from "mongoose";
import {UserDocument} from "./user.model";

const commentSchema = new Schema({
    text: {
        type: Schema.Types.String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        autopopulate: true
    },
    mark: {
        type: Schema.Types.Number
    }
}, {
    collection: "comments",
    timestamps: true,
    versionKey: false
});

commentSchema.plugin(require('mongoose-autopopulate'));

export interface CommentProps {
    _id: string
    text: string;
    user: UserDocument;
    mark: number;
}

export type CommentDocument = CommentProps & Document;
export const CommentModel: Model<CommentDocument> = mongoose.model<CommentDocument>("Comment", commentSchema);