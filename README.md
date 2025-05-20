# ProMan - Backend API

ProMan es una app pensada para la gestión de proyectos y tareas colaborativas, que incluye autenticación, roles y organización por equipos. Esta es la API backend desarrollada en **Node.js** y **TypeScript**, con base de datos **MongoDB**.

## ⚙️ Stack Tecnológico

- **Node.js** + **Express 5**
- **TypeScript**
- **MongoDB** + **Mongoose**
- **JWT** (JSON Web Tokens) para autenticación
- **bcrypt** para encriptación de contraseñas
- **Nodemailer** para envío de emails
- **node-cron** para tareas programadas
- **dotenv** para manejo de variables de entorno
- **express-validator** para validaciones
- **morgan** para logging de peticiones HTTP

---



## 🧠 Arquitectura y Patrones

### Arquitectura en Capas

- **Rutas → Controladores → Servicios/Utils → Modelos**
- Middlewares separados para autenticación, validaciones y control de acceso.

### Patrones Utilizados

- **MVC** (Model-View-Controller) — Modelo claro de rutas, controladores y modelos.
- **Repository Pattern** (implícito) — A través de Mongoose y funciones reutilizables en utils.
- **DRY** — Utilitarios para autenticación, tokens y JWT.
- **Middleware Pattern** — Validaciones con express-validator y control de permisos por entidad.

---

## ✉️ Envío de Emails

- Plantillas y lógica en `emails/AuthEmail.ts` (confirmaciones, recuperaciones).
- Configuración SMTP modular en `config/nodemailer.ts`.

---

## 🧪 Validaciones y Middleware

- Uso extensivo de **express-validator** para validación de entradas.
- Middlewares específicos por entidad (`project.ts`, `task.ts`, etc.) para verificar permisos y validaciones.
---
## URL FRONT
https://github.com/Tomas-Martin-dev/PROMAN_front
