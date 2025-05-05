import { transport } from "../config/nodemailer";

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmedEmail = async ( user: IEmail ) => {
        await transport.sendMail({
            from: "UpTask <admin@uptask.com>",
            to: user.email,
            subject: "UpTask - Confirmar tu cuenta",
            text: "UpTask - Confirmar tu cuenta",
            html: `<p>Hola: ${user.name}</p>
            <p>Haz creado tu cuenta en Pro-Manager, solo tienes que validarla y ya podras ingresar</p>
            <p>El codigo que tienes que usar es: <b>${user.token}</b></p>
            <a href="http://localhost:5173/auth/comfirm-account">¡Confirma tu Cuenta!</a>,
            <p>Tienes 10 minutos para validar tu cuenta</p>
            <p>Si no solicitaste ninguna cuenta en Pro-Manager. Ignora este mansaje</p>`
        })
    };
    static sendNewToken = async (user: IEmail) => {
        await transport.sendMail({
            from: "UpTask <admin@uptask.com>",
            to: user.email,
            subject: "UpTask - Valida tu Cuenta",
            text: "UpTask - Valida tu Cuenta",
            html: `<p>Hola: ${user.name}</p>
            <p>No haz validado tu cuenta en Pro-Manager, te hemos generado un nuevo token para que puedas ingresar</p>
            <p>El codigo que tienes que usar es: <b>${user.token}</b></p>
            <a href="http://localhost:5173/auth/comfirm-account">Valida tu Cuenta!</a>,
            <p>RAPIDO!! - solo tienes 10 minutos</p>`
        })
    };
    static sendNewPassword = async (user: IEmail) => {
        await transport.sendMail({
            from: "UpTask <admin@uptask.com>",
            to: user.email,
            subject: "UpTask - Recupera tu Cuenta",
            text: "UpTask - Recupera tu Cuenta",
            html: `<p>Hola: ${user.name}</p>
            <p>Haz olvidado tu Password en Pro-Manager, te hemos generado un nuevo token para que puedas generar un nuevo</p>
            <p>El codigo que tienes que usar es: <b>${user.token}</b></p>
            <a href="http://localhost:5173/auth/new-password">!Restablece tu Password!</a>,
            <p>RAPIDO!! - solo tienes 10 minutos</p>`
        })
    };
}