import mongoose, {Schema, Document, PopulatedDoc, Types} from "mongoose";
import Task, { ITask } from "./Task";
import { IUser } from "./Auth";
import Notes from "./Notes";

export interface IProject extends Document {
    projectName: string
    clientName: string
    descrption: string
    tasks: PopulatedDoc<ITask & Document>[]
    manager: PopulatedDoc<IUser & Document>
    team: PopulatedDoc<IUser & Document>[]
}

const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    descrption: {
        type: String,
        required: true,
        trim: true
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ],
    manager: {
        type: Types.ObjectId,
        ref: 'User'
    },
    team: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
}, {timestamps: true})

// Middlreware para eliminar las tareas que pertenezcan a un proyecto que se elimine
ProjectSchema.pre("deleteOne",{document: true}, async function() {
    const idP = this.id;
    if (!idP) return

    const tasks = await Task.find({project: idP})
    for (const task of tasks) {
        await Notes.deleteMany({task: task.id})
    }
    await Task.deleteMany({project: idP})
})

const Project = mongoose.model<IProject>("Project", ProjectSchema);
export default Project