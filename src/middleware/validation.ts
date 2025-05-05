import type {Request, Response, NextFunction} from "express"
import { validationResult } from "express-validator"

export const handleInputsErros = (req: Request, res: Response, next: NextFunction) => {
    let erros = validationResult(req);
    if (!erros.isEmpty()) {
        res.status(404).json({ erros: erros.array() });
        return
    }
    next();
}