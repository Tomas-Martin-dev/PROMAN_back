import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator"
import { handleInputsErros } from "../middleware/validation";
import { TaskController } from "../controllers/TasksController";
import { validateProject } from "../middleware/project";
import { validateTask, validateTasktoProject } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { teamController } from "../controllers/TeamsController";

const router = Router();

router.use(authenticate)
router.post("/",
    body("projectName").trim().notEmpty().withMessage("El nombre del 'proyecto' es obligatorio"),
    body("clientName").trim().notEmpty().withMessage("El nombre del 'cliente' es obligatorio"),
    body("descrption").trim().notEmpty().withMessage("La 'description' es obligatoria"),
    handleInputsErros,
    ProjectController.postCreateProjects
);

router.get("/",
    ProjectController.getAllProjects
);

router.get("/:id", 
    param("id").isMongoId().withMessage("ID no valido"),
    handleInputsErros,
    ProjectController.getProjectById
);

router.put("/:id", 
    param("id").isMongoId().withMessage("ID no valido"),
    body("projectName").trim().notEmpty().withMessage("El nombre del 'proyecto' es obligatorio"),
    body("clientName").trim().notEmpty().withMessage("El nombre del 'cliente' es obligatorio"),
    body("descrption").trim().notEmpty().withMessage("La 'description' es obligatoria"),
    handleInputsErros,
    ProjectController.putProject
);

router.delete("/:id", 
    param("id").isMongoId().withMessage("ID no valido"),
    handleInputsErros,
    ProjectController.deleteProject
);


// Routes for Tasks
router.param("projectId", validateProject)

router.post("/:projectId/tasks",
    param("projectId").isMongoId().withMessage("ID no valido"),
    body("name").trim().notEmpty().withMessage("El Nombre de la 'Tarea' es obligatorio"),
    body("description").trim().notEmpty().withMessage("La Descripcion de la 'Tarea' es obligatoria"),
    handleInputsErros,
    TaskController.createTask
)

router.get("/:projectId/tasks", 
    param("projectId").isMongoId().withMessage("ID no valido"),
    handleInputsErros,
    TaskController.getALLTAaskByProject
);

router.param("idT", validateTask)
router.param("idT", validateTasktoProject)

router.get("/:projectId/tasks/:idT", 
    param("projectId").isMongoId().withMessage("ID no valido"),
    param("idT").isMongoId().withMessage("ID no valido"),
    handleInputsErros,
    TaskController.getTaskById
);

router.put("/:projectId/tasks/:idT", 
    param("projectId").isMongoId().withMessage("ID no valido"),
    param("idT").isMongoId().withMessage("ID no valido"),
    body("name").trim().notEmpty().withMessage("El Nombre de la 'Tarea' es obligatorio"),
    body("description").trim().notEmpty().withMessage("La Descripcion de la 'Tarea' es obligatoria"),
    handleInputsErros,
    TaskController.putUpdateTask
);

router.delete("/:projectId/tasks/:idT", 
    param("projectId").isMongoId().withMessage("ID no valido"),
    param("idT").isMongoId().withMessage("ID no valido"),
    handleInputsErros,
    TaskController.deleteTask
);

router.post("/:projectId/tasks/:idT/status", 
    param("projectId").isMongoId().withMessage("ID no valido"),
    param("idT").isMongoId().withMessage("ID no valido"),
    body("status").notEmpty().withMessage("El estado es obligatorio"),
    handleInputsErros,
    TaskController.postStatus
);

// Routes for teams
router.post("/:projectId/team/find",
    body("email").isEmail().toLowerCase().withMessage("Email no valido"),
    handleInputsErros,
    teamController.postTeamByEmail
)

router.post("/:projectId/team",
    body("id").isMongoId().withMessage("ID no valido"),
    handleInputsErros,
    teamController.addMemberById
)

router.delete("/:projectId/team/:memberId",
    param("memberId").isMongoId().withMessage("ID no valido"),
    handleInputsErros,
    teamController.deleteMemberById
)

router.get("/:projectId/team",
    teamController.getTeam
)

export default router
