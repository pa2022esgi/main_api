import mongoose, {Schema, Document, Model} from "mongoose";
import {UserDocument} from "./user.model";
import {MessageDocument} from "./message.model";

const chatSchema = new Schema({
    users: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        autopopulate: true
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Message",
        autopopulate: true
    }]
}, {
    collection: "chats",
    timestamps: true,
    versionKey: false
});

chatSchema.plugin(require('mongoose-autopopulate'));

export interface ChatProps {
    _id: string
    users: UserDocument[];
    messages: MessageDocument[];
}

export type ChatDocument = ChatProps & Document;
export const ChatModel: Model<ChatDocument> = mongoose.model<ChatDocument>("Chat", chatSchema);