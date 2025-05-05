import type { NextFunction, Request, Response } from "express";
import Project, { IProject } from "../models/Project";

declare global {
    namespace Express {
        interface Request {
            project: IProject
        }
    }
}

export async function validateProject(req: Request, res: Response, next: NextFunction) {
    const { projectId } = req.params;   
    
    try {
        const project = await Project.findById(projectId);
        if (!project) {
            res.status(404).json({ errors: "Proyecto no encontrado" });
            return
        }
        req.project = project;
        next()
    } catch (error) {
        console.log(error);
    }
}