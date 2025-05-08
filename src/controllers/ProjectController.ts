import type { Request, Response } from "express"
import Project from "../models/Project";

export class ProjectController {
    
    static postCreateProjects = async (req: Request, res: Response) => {
        const project = new Project(req.body);
        project.manager = req.user.id;
        try {
            await project.save();
            res.send('Proyecto Creando') 
        } catch (error) {
            console.log(error)
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        const id = req.user.id;
        try {
            const projects = await Project.find({
                $or: [
                    {manager: {$in: id}},
                    {team: {$in: id}}
                ]
            });
            res.json(projects);
        } catch (error) {
            console.log(error);
        }
    };
    
    static getProjectById = async (req: Request, res: Response) => {
        const id = req.params.id;
        
        try {
            const project = await Project.findById(id).populate("tasks");
            if (!project) {
                res.status(404).json({ errors: "Proyecto no encontrado" });
                return
            }
            if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                res.status(401).json({ errors: "Accion no autorizada" });
                return
            }
            res.json(project)
        } catch (error) {
            console.log(error);
        }
    };
    
    static putProject = async (req: Request, res: Response) => {
        const id = req.params.id;
        const newProject = req.body;
        
        try {
            const project = await Project.findById(id);
            if (!project) {
                res.status(404).json({ errors: "Proyecto no encontrado" });
                return
            }
            if (project.manager.toString() !== req.user.id.toString()) {
                res.status(401).json({ errors: "Accion no autorizada" });
                return
            }
            project.clientName = newProject.clientName
            project.projectName = newProject.projectName
            project.descrption = newProject.descrption
            await project.save()

            res.send("Proyecto Actulizado");
        } catch (error) {
            console.log(error);
        }
    };

    static deleteProject = async (req: Request, res: Response) => {
        const id = req.params.id;
        
        try {
            const project = await Project.findById(id);;

            if (!project) {
                res.status(404).json({ errors: "Proyecto no encontrado" });
                return
            }
            if (project.manager.toString() !== req.user.id.toString()) {
                res.status(401).json({ errors: "Accion no autorizada" });
                return
            }
            await project.deleteOne();
            res.send("Proyecto Eliminado")
        } catch (error) {
            console.log(error);
        }
    };
}

