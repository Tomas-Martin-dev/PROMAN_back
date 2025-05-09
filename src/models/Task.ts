import mongoose, {Schema, Document, Types} from "mongoose";
import Notes from "./Notes";

const taskStatus = {
    PENDING: "pending",
    ON_HOLD: "onHold",
    IN_PROGESS: "inProgress",
    UNDER_REVIEW: "underReview",
    COMPLETEd: "completed",
} as const

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]

export interface ITask extends Document {
    name: string,
    description: string
    project: Types.ObjectId,
    status: TaskStatus,
    completedBy: {
        user: Types.ObjectId,
        status: TaskStatus
    }[],
    notes: Types.ObjectId[]
};

export const TaskSchema: Schema =  new Schema({
    name: {
        type: String,
        trim: true,
        require: true
    },
    description: {
        type: String,
        trim: true,
        require: true
    },
    project: {
        type: Types.ObjectId,
        ref: "Project"
    },
    status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
    },
    completedBy: [
        {
            user: {
                type: Types.ObjectId,
                ref: "User",
                default: null
            },
            status: {
                type: String,
                enum: Object.values(taskStatus),
                default: taskStatus.PENDING
            }
        }
    ],
    notes: [
        {
            type: Types.ObjectId,
            ref: "Notes"
        }
    ]
}, { timestamps: true })

// Middlreware para eliminar las notas que pertenezcan a una tarea que se elimine
TaskSchema.pre("deleteOne", {document: true}, async function() {
    const id = this._id;
    if (!id) return
    await Notes.deleteMany({task: id})
})

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task