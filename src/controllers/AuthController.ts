import type { Request, Response } from "express"
import User from "../models/Auth"
import Token from "../models/Token"
import { hashPass, validPassHash } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { validateTask } from "../middleware/task";
import { generateJWT } from "../utils/jsonwebtoken";


export class AuthController {
    static createAccount = async (req:Request, res:Response) => {
        
        const { password, email } = req.body;
        try {
            // prevenir duplicado
            const userExist = await User.findOne({email});
            if (userExist) {
                const error = new Error("El usuario ya esta registrado");
                res.status(409).json({error: error.message});
                return
            }
            const user = new User(req.body);
            
            // Hash Password
            user.password = await hashPass(password)
            
            //Genrenar Token             
            const token = new Token();
            token.token = generateToken();
            token.user = user.id

            //Envio de Emial
            AuthEmail.sendConfirmedEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })
            
            //guardo user            
            await Promise.allSettled([user.save(), token.save()])
            res.send("Cuenta Creada - Revisa tu Email");
        } catch (error) {
            res.status(500).json({error: "Hubo un error"})
        }
    };

    static confirmToken = async (req:Request, res:Response) => {
        try {
            const { token } = req.body;
            const tokenExist = await Token.findOne({token});
            if (!tokenExist) {
                const error = new Error("Token no valido");
                res.status(401).json({error: error.message});
                return
            };
            const user = await User.findById(tokenExist.user);
            user.confirmed = true;

            await Promise.allSettled([
                user.save(),
                tokenExist.deleteOne()
            ])
            res.send("Cuenta Confirmada Correctamente")
        } catch (error) {
            res.status(500).json({error: "Hubo un error"})
        }
    };

    static login = async (req:Request, res:Response) => {
        try {
            const {email, password} = req.body;
            const user = await User.findOne({email});
            //Valido usuario existente
            if (!user) {
                const error = new Error("El Email no registrado");
                res.status(401).json({error: error.message});
                return
            }
            //Valido que este confirmado sino mando corre
            if (!user.confirmed) {
                const token = new Token();
                token.user = user.id;
                token.token = generateToken();
                await token.save()

                AuthEmail.sendNewToken({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error("Usuario no confirmado - Revisa tu Email");
                res.status(401).json({error: error.message});
                return
            }
            //Valido pass
            const isPasswordCorrect = await validPassHash(password, user.password)
            if (!isPasswordCorrect) {
                const error = new Error("Password Invalido");
                res.status(401).json({error: error.message});
                return
            }
            const token =  generateJWT({id: user._id.toString()});
            res.send(token);
        } catch (error) {
            res.status(500).json({error: "Hubo un error"})
        }
    };

    static requestConfirmateCode = async (req:Request, res:Response) => {
        const { email } = req.body;
        try {
            // prevenir duplicado
            const userExist = await User.findOne({email});
            if (!userExist) {
                const error = new Error("El usuario no esta registrado");
                res.status(404).json({error: error.message});
                return
            }
            if (userExist.confirmed) {
                const error = new Error("El usuario ya esta confirmado");
                res.status(403).json({error: error.message});
                return
            }
            //Genrenar Token             
            const token = new Token();
            token.token = generateToken();
            token.user = userExist.id

            //Envio de Emial
            AuthEmail.sendConfirmedEmail({
                email: userExist.email,
                name: userExist.name,
                token: token.token
            })
            
            //guardo user            
            await Promise.allSettled([userExist.save(), token.save()])
            res.send("Se envio un nuevo Token a tu Email");
        } catch (error) {
            res.status(500).json({error: "Hubo un error"})
        }
    };

    static resetPassword = async (req:Request, res:Response) => {
        const { email } = req.body;
        try {
            // validamos que exista
            const userExist = await User.findOne({email});
            if (!userExist) {
                const error = new Error("Email no esta registrado");
                res.status(404).json({error: error.message});
                return
            };
            
            //Genrenar Token             
            const token = new Token();
            token.token = generateToken();
            token.user = userExist.id
            token.save();

            //Envio de Emial
            AuthEmail.sendNewPassword({
                email: userExist.email,
                name: userExist.name,
                token: token.token
            })
            
            //guardo user            
            res.send("Te enviamos las instrucciones - Revisa tu Email");
        } catch (error) {
            res.status(500).json({error: "Hubo un error"})
        }
    };

    static confirmTokenPass = async (req:Request, res:Response) => {
        try {
            const { token } = req.body;

            const tokenExist = await Token.findOne({token});
            if (!tokenExist) {
                const error = new Error("Token no valido");
                res.status(401).json({error: error.message});
                return
            };
            res.send("Token Valido - Define tu password")
        } catch (error) {
            res.status(500).json({error: "Hubo un error"})
        }
    };

    static newPassword = async (req:Request, res:Response) => {
        try {
            const { token } = req.params;
            const { password } = req.body
            
            // validamos que exista
            const tokenExist = await Token.findOne({token});
            if (!tokenExist) {
                const error = new Error("Token no es valido - Vuelva a intentarlo");
                res.status(404).json({error: error.message});
                return
            };
            // obtenemos user y pasamos nuevo pass
            const user = await User.findById(tokenExist.user);
            user.password = await hashPass(password);

            Promise.allSettled([
                tokenExist.deleteOne(),
                user.save()
            ])
                    
            res.send("¡Password Modificado!");
        } catch (error) {
            res.status(500).json({error: "Hubo un error"})
        }
    };

    static user = async (req:Request, res:Response) => {
        res.json(req.user)
    };
}
