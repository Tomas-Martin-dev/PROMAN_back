import type { Request, Response } from "express"
import User from "../models/Auth";
import Project from "../models/Project";
import { AuthEmail } from "../emails/AuthEmail";

export class teamController {
    static postTeamByEmail = async (req: Request, res: Response) => {
        const {email} = req.body;
        try {
            const user = await User.findOne({email}).select("_id name email");
            if (!user) {
                res.status(404).json({ errors: "Usuario no encontrado" });
                return
            }
            res.json(user)
        } catch (error) {
            console.log(error);
        }
    };
    static addMemberById = async (req: Request, res: Response) => {
        const {id} = req.body;
        console.log(req.user);
        
        try {
            const user = await User.findById(id);
            if (!user) {
                res.status(404).json({ errors: "Usuario no encontrado" });
                return
            }
            if (req.project.team.some(team => team.toString() === user.id.toString())) {
                res.status(404).json({ errors: "Usuario ya se ecuentra asignado al proyecto" });
                return
            }
            if (user.id === req.user.id) {
                res.status(404).json({ errors: "Error - Eres el Manager" });
                return
            }
            req.project.team.push(user.id);
            await req.project.save();
            //Envio correo de aviso al nuevo miembro
            AuthEmail.sendAddMember({
                name: user.name,
                email: user.email,
                projectName: req.project.projectName,
                project_id: req.project.id,
                managerName: req.user.name
            })
            res.send("Usuario asignado al proyecto")
        } catch (error) {
            console.log(error);
        }
    };
    static deleteMemberById = async (req: Request, res: Response) => {
        const {memberId} = req.params;
        try {
            if (!req.project.team.some(team => team.toString() === memberId)) {
                res.status(404).json({ errors: "Usuario no se ecuentra asignado al proyecto" });
                return
            }
            req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== memberId);
            await req.project.save();
            res.send("Usuario eliminado del proyecto")
        } catch (error) {
            console.log(error);
        }
    };
    static getTeam = async (req: Request, res: Response) => {
        try {          
            const project = await Project.findById(req.project.id).populate({
                path: "team",
                select: "id name email"
            });
            res.json(project.team);
            // console.log(req.project.team) no lo paso asi ya que esto solo me puede traer el id, llamando la db puedo pedir que traiga toda la info con el id
        } catch (error) {
            console.log(error);
        }
    }
}