import type { Request, Response } from "express"
import Project from "../models/Project";

export class ProjectController {
    
    static postCreateProjects = async (req: Request, res: Response) => {
        console.log(req.user);
        console.log(req.body);
        const project = new Project(req.body);
        project.manager = req.user.id;
        console.log(project);
        
        try {
            await project.save();
            res.send('Proyecto Creando') 
        } catch (error) {
            console.log(error)
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({});
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
            res.json(project)
        } catch (error) {
            console.log(error);
        }
    };
    
    static putProject = async (req: Request, res: Response) => {
        const id = req.params.id;
        const newProject = req.body;
        
        try {
            const project = await Project.findByIdAndUpdate(id, newProject, { new: true });
            
            if (!project) {
                res.status(404).json({ errors: "Proyecto no encontrado" });
                return
            }
            
            res.send("Proyecto Actulizado");
        } catch (error) {
            console.log(error);
        }
    };

    static deleteProject = async (req: Request, res: Response) => {
        const id = req.params.id;
        
        try {
            const project = await Project.findByIdAndDelete(id);;

            if (!project) {
                res.status(404).json({ errors: "Proyecto no encontrado" });
                return
            }

            res.send("Proyecto Eliminado")
        } catch (error) {
            console.log(error);
        }
    };
}

