import express from "express"
import relatorioControll from "../controllers/auth.controller.js"
import authMiddleware from "../middlewares/authMiddleware.js" 

const router = express.Router()

//Rota de fazer Login:
router.post("/login", relatorioControll.login)
//Rota do EndPoint /me:
router.get("/me", authMiddleware, relatorioControll.me)

export default router