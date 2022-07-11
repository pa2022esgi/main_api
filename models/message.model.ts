import mongoose, {Schema, Document, Model} from "mongoose";
import {UserDocument} from "./user.model";

const messageSchema = new Schema({
    text: {
        type: Schema.Types.String,
    },
    user: {
        type: Schema.Types.String,
        ref: "User",
        autopopulate: true
    }
}, {
    collection: "messages",
    timestamps: true,
    versionKey: false
});

messageSchema.plugin(require('mongoose-autopopulate'));

export interface MessageProps {
    _id: string
    text: string;
    user: UserDocument;
}

export type MessageDocument = MessageProps & Document;
export const MessageModel: Model<MessageDocument> = mongoose.model<MessageDocument>("Message", messageSchema);