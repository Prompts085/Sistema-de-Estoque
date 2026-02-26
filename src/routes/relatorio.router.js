import express from 'express';
import relatorioControll from "../controllers/relatorio.controller.js"; 
import authMiddleware from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorizeRoles.js";

const router = express.Router();

// 5.4 Relatório de alerta (admin)
router.get("/relatorios/baixo-estoque", authMiddleware, authorize(["admin", "estoquista"]), relatorioControll.relatorio);

export default router;