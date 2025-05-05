import type { NextFunction, Request, Response } from "express";
import Task, { ITask } from "../models/Task";

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export async function validateTask(req: Request, res: Response, next: NextFunction) {
    const { idT } = req.params;   
    
    try {
        const task = await Task.findById(idT);
        if (!task) {
            res.status(404).json({ errors: "Proyecto no encontrado" });
            return
        }
        req.task = task;
        next()
    } catch (error) {
        res.send(error);
    }
}

export async function validateTasktoProject(req: Request, res: Response, next: NextFunction) {
    if (req.task.project.toString() !== req.project.id) {
        res.status(400).json({ errors: "Accion no valida! Projecto no validado para su tarea" });
        return
    }
    next()
}