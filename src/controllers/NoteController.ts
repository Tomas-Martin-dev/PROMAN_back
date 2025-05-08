import type { Request, Response } from "express"
import Notes, {INotes} from "../models/Notes"
import { Types } from "mongoose";

type NoteParams = {
    noteId: Types.ObjectId
}

export class NoteController {
    static createNote = async (req: Request<{},{},INotes>, res: Response) => {
        const {content} = req.body;
        
        const note = new Notes();
        note.content = content;
        note.createdBy = req.user.id;
        note.task = req.task.id;
        
        req.task.notes.push(note.id);
        
        try {
            Promise.allSettled([req.task.save(), note.save()])
            res.send("Nota creada correctamente")
        } catch (error) {
            res.status(500).json({errors: "Hubo un Error"})
        }
    };

    static getNotes = async (req: Request<{},{},INotes>, res: Response) => {
        try {
            const notes = await Notes.find({task: req.task.id});
            res.json(notes)
        } catch (error) {
            res.status(500).json({errors: "Hubo un Error"})
        }
    };
    
    static deleteNote = async (req: Request<NoteParams>, res: Response) => {
        const { noteId } = req.params;
        try {
            const note = await Notes.findById(noteId);
            if (!note) {
                const error = new Error("Nota no encontrada");
                res.status(404).json({errors: error.message});
                return
            }
            if (note.createdBy.toString() !== req.user.id.toString()) {
                const error = new Error("Erro - No tienes permisos");
                res.status(404).json({errors: error.message});
                return
            }
            req.task.notes = req.task.notes.filter(not => not.toString() !== noteId.toString());
            try {
                Promise.allSettled([note.deleteOne(), req.task.save()])
                res.send("Nota eliminada")
            } catch (error) {
                res.status(500).json({errors: "Hubo un Error"})
            }
        } catch (error) {
            res.status(500).json({errors: "Hubo un Error"})
        }
    }
}