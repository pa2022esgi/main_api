import mongoose, {Schema, Document, Model} from "mongoose";

const fileSchema = new Schema({
    url: {
        type: Schema.Types.String,
        required: true
    },
    name: {
        type: Schema.Types.String,
        required: true
    }
}, {
    collection: "files",
    timestamps: true,
    versionKey: false
});

export interface FileProps {
    _id: string
    url: string;
    name: string;
}

export type FileDocument = FileProps & Document;
export const FileModel: Model<FileDocument> = mongoose.model<FileDocument>("File", fileSchema);