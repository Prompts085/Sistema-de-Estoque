import express from 'express'
import produtoControll from "../controllers/produtos.controller.js" 
import authMiddleware from "../middlewares/authMiddleware.js"
import authorize from "../middlewares/authorizeRoles.js"

const router = express.Router()

// 5.2: ROTA POST: CRIAR PRODUTO (admin, estoquista)
router.post("/produtos", authMiddleware, authorize(["admin", "estoquista"]), produtoControll.criarProduto)

// 5.2: Listar produtos (todos autenticados)
router.get("/produtos", authMiddleware, produtoControll.listarProd)

// 5.2: Solicitar pelo id de produto (todos autenticados) 
router.get("/produtos/:id", authMiddleware, produtoControll.solicitarProd)

// 5.2: ROTA PATCH: Atualizar nome/minimo (admin, estoquista)
router.patch("/produtos/:id", authMiddleware, authorize(["admin", "estoquista"]), produtoControll.atualizarProd)

// 5.2: ROTA DELETE: Deletar produto (apenas admin) 
router.delete("/produtos/:id", authMiddleware, authorize(["admin"]), produtoControll.deletarProd)

export default router