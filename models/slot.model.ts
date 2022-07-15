import mongoose, {Schema, Document, Model} from "mongoose";
import {UserDocument} from "./user.model";
import {CoursDocument} from "./cours.model";

const slotSchema = new Schema({
    date: {
        type: Schema.Types.Date,
    },
    start_time: {
        type: Schema.Types.String
    },
    end_time: {
        type: Schema.Types.String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        autopopulate: true
    },
    paid: {
        type: Schema.Types.Boolean,
        default: false
    },
    price: {
        type: Schema.Types.Number
    },
    online: {
        type: Schema.Types.Boolean
    },
    cours: {
        type: Schema.Types.ObjectId,
        ref: "Cours",
        autopopulate: true
    },
}, {
    collection: "slots",
    timestamps: true,
    versionKey: false
});

slotSchema.plugin(require('mongoose-autopopulate'));

export interface SlotProps {
    _id: string
    user: UserDocument;
    date: Date;
    start_time: string;
    end_time: string;
    paid: boolean;
    online: boolean;
    price: number;
    cours: CoursDocument;
}

export type SlotDocument = SlotProps & Document;
export const SlotModel: Model<SlotDocument> = mongoose.model<SlotDocument>("Slot", slotSchema);