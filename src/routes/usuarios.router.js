import express from 'express'
import usuarioController from "../controllers/usuarios.controller.js" 
import authMiddleware from "../middlewares/authMiddleware.js"
import authorize from "../middlewares/authorizeRoles.js"

const router = express.Router()

// Rota POST: Registrar usuário:
router.post("/registrar", usuarioController.criarUser)

// Rota POST: criar usuário (somente admin):
router.post("/usuarios", authMiddleware, authorize(["admin"]), usuarioController.criarUser)

// Rota GET: listar usuários (admin) [cite: 68]
router.get("/usuarios", authMiddleware, authorize(["admin"]), usuarioController.ListarUser)

// Rota PATCH: alterar perfil (admin) 
router.patch("/usuarios/:id/perfil", authMiddleware, authorize(["admin"]), usuarioController.AlterarUser)

export default router