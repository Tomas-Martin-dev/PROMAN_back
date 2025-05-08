import mongoose, {Schema, Document, Types} from "mongoose";

export interface INotes extends Document {
    content: string,
    createdBy: Types.ObjectId,
    task: Types.ObjectId
}

const notesSchema: Schema = new Schema({
    content: {
        type: String,
        require: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        require: true
    },
    task: {
        type: Types.ObjectId,
        ref: "Task",
        require: true
    }
}, {timestamps: true})

const Notes = mongoose.model<INotes>("Notes", notesSchema);
export default Notes