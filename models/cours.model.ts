import mongoose, {Schema, Document, Model} from "mongoose";

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
        required: true
    },
    score: {
        type: Schema.Types.Number,
        required: true
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
    user: string;
    score: number;
}

export type CoursDocument = CoursProps & Document;
export const CoursModel: Model<CoursDocument> = mongoose.model<CoursDocument>("Cours", coursSchema);