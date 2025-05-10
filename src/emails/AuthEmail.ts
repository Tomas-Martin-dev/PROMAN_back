import nodemailer from "nodemailer";

interface IEmail {
    email: string
    name: string
    token?: string
    projectName?: string
    project_id?: string
    managerName?: string
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.USER_GMAIL,
        pass: process.env.PASS_GMAIL
    },
});

export class AuthEmail {
    static sendConfirmedEmail = async (user: IEmail) => {
        await transporter.sendMail({
            from: "UpTask <admin@uptask.com>",
            to: user.email,
            subject: "UpTask - Confirmar tu cuenta",
            text: "UpTask - Confirmar tu cuenta",
            html: `<p>Hola: ${user.name}</p>
            <p>Haz creado tu cuenta en Pro-Manager, solo tienes que validarla y ya podras ingresar</p>
            <p>El codigo que tienes que usar es: <b>${user.token}</b></p>
            <a href="https://proman-front.vercel.app/auth/comfirm-account">¡Confirma tu Cuenta!</a>,
            <p>Tienes 10 minutos para validar tu cuenta</p>
            <p>Si no solicitaste ninguna cuenta en Pro-Manager. Ignora este mansaje</p>`
        })
    };
    static sendNewToken = async (user: IEmail) => {
        await transporter.sendMail({
            from: "UpTask <admin@uptask.com>",
            to: user.email,
            subject: "UpTask - Valida tu Cuenta",
            text: "UpTask - Valida tu Cuenta",
            html: `<p>Hola: ${user.name}</p>
            <p>No haz validado tu cuenta en Pro-Manager, te hemos generado un nuevo token para que puedas ingresar</p>
            <p>El codigo que tienes que usar es: <b>${user.token}</b></p>
            <a href="https://proman-front.vercel.app/auth/comfirm-account">Valida tu Cuenta!</a>,
            <p>RAPIDO!! - solo tienes 10 minutos</p>`
        })
    };
    static sendNewPassword = async (user: IEmail) => {
        await transporter.sendMail({
            from: "UpTask <admin@uptask.com>",
            to: user.email,
            subject: "UpTask - Recupera tu Cuenta",
            text: "UpTask - Recupera tu Cuenta",
            html: `<p>Hola: ${user.name}</p>
            <p>Haz olvidado tu Password en Pro-Manager, te hemos generado un nuevo token para que puedas restablecer tu Password</p>
            <p>El codigo que tienes que usar es: <b>${user.token}</b></p>
            <a href="https://proman-front.vercel.app/auth/new-password">!Restablece tu Password!</a>,
            <p>RAPIDO!! - solo tienes 10 minutos</p>`
        })
    };
    static sendAddMember = async (user: IEmail) => {
        await transporter.sendMail({
            from: "UpTask <admin@uptask.com>",
            to: user.email,
            subject: `UpTask - ${user.managerName} te asignado a un proyecto`,
            text: "UpTask - Fuiste Asignado a un Proyecto",
            html: `<p>Hola: ${user.name}</p>
            <p>El Manager de ${user.projectName}: <b>${user.managerName}</b> te acaban de asignar al proyecto</p>
            <p>¡Ya puedes comenzar a trabajar en el!</p>
            <a href="https://proman-front.vercel.app/projects/${user.project_id}">${user.projectName}</a>`
        })
    };
}