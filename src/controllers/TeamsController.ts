import type { Request, Response } from "express"
import User from "../models/Auth";
import Project from "../models/Project";

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
        console.log(req.body);
        
        const {id} = req.body;
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
            req.project.team.push(user.id);
            await req.project.save();
            res.send("Usuario asignado al projecto")
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