const express = require('express')
const router = express.Router()
const db = require("../db/banco")

const authMiddleware = require("../middlewares/authMiddleware")
const authorize = require("../middlewares/authorizeRoles")

// 5.2: ROTA POST: CRIAR PRODUTO e ADICIONAR
router.post("/produtos", authMiddleware, authorize(["admin", "estoquista"]), (req, res) =>{
    const {nome, quantidade, minimo} = req.body

    if(!nome || quantidade === null || minimo === null){
        return res.status(400).json({error: "os campos são obrigatorios (nome, qntd, minimo)"})
    }
    db.run(
        `INSERT INTO PRODUTOS (nome, quantidade, minimo)
        VALUES(?, ?, ?)`,
        [nome, quantidade, minimo],
        function(err){
            if(err){
                return res.status(500).json({error: err.message})
            }
            return res.status(201).json({
                id: this.lastID,
                nome,
                quantidade,
                minimo
            })
        }
    )
})
//5.2: primeira ROTA GET: Listar produtos (todos autenticados)
router.get("/produtos", authMiddleware, (req, res) =>{
    
    db.all(
        `SELECT id, nome, quantidade, minimo FROM PRODUTOS`,
        [],
        (err, produtos) =>{
            if(err){
                return res.status(500).json({error: err.message})
            }
            res.json(produtos)
        }
    )
})

//5.2: Segunda ROTA GET: Solicitar produto (todos autenticados)
router.get("/produtos/:id", authMiddleware, (req, res) =>{
    const {id} = req.params

    db.get(
        `SELECT * FROM PRODUTOS WHERE id = ?`,
        [id],
        (err, produto) =>{
            if(err){
                return res.status(500).json({error: err.message})
            }
            if (!produto) {
                return res.status(404).json({ error: "Produto não encontrado" })
            }
            res.json(produto)
        }
    )
})

router.patch("/produtos/:id", authMiddleware, authorize(["admin", "estoquista"]), (req, res) =>{
    const {id} = req.params
    const {nome, minimo} = req.body
    
    if (!nome && minimo === undefined) {
      return res.status(400).json({
        error: "Pelo menos um campo para atualizar (nome ou minimo)"
      })
    }
    
    db.run(
      `
      UPDATE PRODUTOS
      SET
        nome = COALESCE(?, nome),
        minimo = COALESCE(?, minimo)
      WHERE id = ?
      `,
      [nome ?? null, minimo ?? null, id],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message })
        }

        if (this.changes === 0) { //id não existe
          return res.status(404).json({ error: "Produto não encontrado" })
        }

        res.json({
          mensagem: "Produto atualizado",
          id
        })
      }
    )
  })
//COALESCE: Se o valor vier null, ele mantém o que já está no banco e ermite atualizar só um campo sem quebrar o outro

router.delete("/produtos/:id", authMiddleware, authorize(["admin"]), (req, res) =>{
    const { id } = req.params

    db.run(
      `DELETE FROM PRODUTOS WHERE id = ?`,
      [id],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message })
        }

        if (this.changes === 0) { //id não existe
          return res.status(404).json({ error: "Produto não encontrado" })
        }

        res.json({
          mensagem: "Produto removido",
          id
        })
      }
    )
  })

  module.exports = router