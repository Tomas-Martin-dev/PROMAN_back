import type { Request, Response } from "express";
import Task from "../models/Task";
import Project from "../models/Project";
import { param } from "express-validator";

export class TaskController {
    static createTask = async (req: Request, res: Response) => {
        try {
            const tasks = new Task(req.body);
            tasks.project = req.project.id;
            
            req.project.tasks.push(tasks.id);

            Promise.allSettled([ tasks.save(), req.project.save() ])
            
            res.send("Tarea guardada")
        } catch (error) {
            console.log(error);
        }  
    };      

    static getALLTAaskByProject = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({ project: req.project.id }).populate("project");
            res.json(tasks)
        } catch (error) {
            console.log(error);
        }
    }
    
    static getTaskById = async (req: Request, res: Response) => {
        try {
            const task = await Task.findById(req.task.id)
            .populate({path:"completedBy.user", select: "name id email"})
            .populate({path: "notes", populate:{path: "createdBy", select: "id name email"}});
            res.json(task)
        } catch (error) {
            res.send(error);
        }
    }

    static putUpdateTask = async (req: Request, res: Response) => {
        const newTask = req.body;
        try {
            req.task.name = req.body.name;
            req.task.description = req.body.description;
            await req.task.save()
            res.send("Tarea Actualizada")   
        } catch (error) {
            res.send(error);
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter( task => task.toString() !== req.task.id )
            await Promise.allSettled([ req.task.deleteOne(), req.project.save() ])
            res.send("Tarea Eliminada")
        } catch (error) {
            res.send(error);
        }
    }

    static postStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body;
            req.task.status = status;
            const data = {
                user: req.user.id,
                status
            }
            req.task.completedBy.push(data)
            await req.task.save();
            res.send(`Status actualizado`)            
        } catch (error) {   
            res.send(error);
        }
    }
}