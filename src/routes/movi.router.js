import express from 'express'
import moviController from "../controllers/movi.controller.js" // Lembre-se do .js
import authMiddleware from "../middlewares/authMiddleware.js"
import authorize from "../middlewares/authorizeRoles.js"

const router = express.Router()

// Rotas de Movimentação:
router.post("/movimentacoes/entrada", authMiddleware, authorize(["admin", "estoquista"]), moviController.registrarEntrada)

// SAÍDA:
router.post("/movimentacoes/saida", authMiddleware, authorize(["admin", "estoquista"]), moviController.registrarSaida)

// LISTAR TUDO:
router.get("/movimentacoes", authMiddleware, authorize(["admin", "estoquista", "consulta"]), moviController.listarTudo)

export default router