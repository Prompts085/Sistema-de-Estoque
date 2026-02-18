const express = require('express')
const router = express.Router()
const db = require("../db/banco")

const authMiddleware = require("../middlewares/authMiddleware")
const authorize = require("../middlewares/authorizeRoles")

//5.3: POST de Entrada:
router.post("/movimentacoes/entrada", authMiddleware, authorize(["admin", "estoquista"]), (req, res) =>{
    const {produto_id, quantidade} = req.body
    const usuario_id = req.user.id


    if(!produto_id || quantidade == null){
        return res.status(400).json({
            error: "o id do produto e quantidade são obrigatórios"
        })
    }

    db.get(
        `SELECT quantidade FROM PRODUTOS WHERE id = ?`,
        [produto_id],
        (err, produto) =>{
            if(err){
                return res.status(500).json({error: err.message})
            }
            if(!produto){
                return res.status(404).json({error: "Produto não encontrado"
                })
            }
            
            const quantidadeNova = produto.quantidade + quantidade

            db.run(
                `UPDATE PRODUTOS SET quantidade = ? WHERE id = ?`,
                [quantidadeNova, produto_id],
                function(err){
                    if(err){
                        return res.status(500).json({error: err.message})
                    }

            db.run(
                `INSERT INTO MOVIMENTACOES
                (produto_id, tipo, quantidade, usuario_id)
                VALUES (?, 'entrada', ?, ?)`,
                [produto_id, quantidade, usuario_id],
                function (err){
                    if(err){
                        return res.status(500).json({error: err.message})
                    }
                    res.status(201).json({
                  mensagem: "Entrada registrada",
                  estoque_atual: quantidadeNova
                })
                        }    
                    )
                }
            )
        }
    )
})
//5.3: POST de Saída:
router.post("/movimentacoes/saida", authMiddleware, authorize(["admin", "estoquista"]), (req, res) =>{
    const {produto_id, quantidade} = req.body
    const usuario_id = req.user.id

    if(!produto_id || !quantidade === undefined|| quantidade <= 0){
        return res.status(400).json(
            {error: "id do produto e quantidade são obrigatórios"})
    }

    db.get(
        `SELECT quantidade FROM PRODUTOS WHERE id = ?`,
        [produto_id],
        (err, produto) =>{
            if(err){
                return res.status(500).json({error: err.message})
            }
            if (!produto) {
                return res.status(404).json({error: "Produto não encontrado"})
            }

            if (quantidade > produto.quantidade) { // aqui não é permitido uma saída maior do que o estoque
                return res.status(400).json({error: "Estoque insuficiente"})
            }

            const quantidadeNova = produto.quantidade - quantidade

            db.run(
                `UPDATE PRODUTOS SET quantidade = ? WHERE id = ?`,
                [quantidadeNova, produto_id],
                function (err) {
                    if(err){
                        return res.status(500).json({error: err.message})
                    }
            db.run(
                `INSERT INTO MOVIMENTACOES
                (produto_id, tipo, quantidade, usuario_id)
                VALUES (?, 'saida', ?, ?)`,
                [produto_id, quantidade, usuario_id],
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: err.message })
                    }
                    
                    res.status(201).json({
                    mensagem: "Saída registrada",
                    estoque_atual: quantidadeNova})
                    }
                )
            }
        )
    }
)
})

router.get("/movimentacoes", authMiddleware, (req, res) => {

  db.all(
    `SELECT 
      m.id,
      m.tipo,
      m.quantidade,
      m.data_hora,
      p.nome AS produto,
      u.email AS usuario
    FROM MOVIMENTACOES m
    JOIN PRODUTOS p ON m.produto_id = p.id
    JOIN USUARIOS u ON m.usuario_id = u.id
    ORDER BY m.data_hora DESC`,
    [],
    (err, movimentacoes) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }

      res.json(movimentacoes)
    }
  )
})

module.exports = router
