import {Router} from "express"
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputsErros } from "../middleware/validation";
import { authenticate } from "../middleware/auth";


const router = Router();
// ruta para autenticar o crear cuenta
router.post("/create-account",
    body("name").notEmpty().withMessage("El nombre no puede ir vacio"),
    body("email").isEmail().withMessage("Email no valido"),
    body("password").isLength({min: 8}).withMessage("Minimo 8 caracteres"),
    body("password_confirmation").custom((value, {req})=> {
        if (value !== req.body.password) {
            throw new Error("Los Passwords no son iguales");
        }
        return true
    }),
    handleInputsErros,
    AuthController.createAccount
)

router.post("/confirm-account",
    body("token").notEmpty().withMessage("El token no puede ir vacio"),
    handleInputsErros,
    AuthController.confirmToken
) 

//ruteo validando cuenta confirmada
router.post("/login",
    body("email").isEmail().withMessage("Email no valido"),
    body("password").notEmpty().withMessage("El Password no puede ir vacio"),
    handleInputsErros,
    AuthController.login
)

router.post("/request-code",
    body("email").isEmail().withMessage("Email no valido"),
    handleInputsErros,
    AuthController.requestConfirmateCode
)

router.post("/forgot-password",
    body("email").isEmail().withMessage("Email no valido"),
    handleInputsErros,
    AuthController.resetPassword
)

router.post("/validat-token",
    body("token").notEmpty().withMessage("El token no puede ir vacio"),
    handleInputsErros,
    AuthController.confirmTokenPass
)

router.post("/update-password/:token",
    param("token").isNumeric().withMessage("Token no valido"),
    body("password").isLength({min: 8}).withMessage("Minimo 8 caracteres"),
    body("password_confirmation").custom((value, {req})=> {
        if (value !== req.body.password) {
            throw new Error("Los Passwords no son iguales");
        }
        return true
    }),
    handleInputsErros,
    AuthController.newPassword
)

router.get("/user", authenticate, AuthController.user)

export default router