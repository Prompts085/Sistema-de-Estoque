const express = require('express')
const router = express.Router()
const db = require("../db/banco")

const authMiddleware = require("../middlewares/authMiddleware")
const authorize = require("../middlewares/authorizeRoles")


//5.1. ROTA POST: criar usuário (admin)
router.post("/usuarios", authMiddleware, authorize(["admin"]), (req, res) =>{
    const {email, senha, perfil} = req.body
    
    if(!email || !senha || !perfil){
       return res.status(400).json({error: "Tem que inserir todos"})
    }
    
    if(!["admin", "estoquista", "consulta"].includes(perfil)){
        return res.status(400).json({ error: "Perfil invalido"})
    }
    db.run(`
            INSERT INTO USUARIOS (email, senha, perfil)
            VALUES(?, ?, ?)`,
            [email, senha, perfil],
            function (err){
                if(err){
                    return res.status(500).json({error: err.message})
                }
                return res.status(201).json({
                    id: this.lastID,
                    email,
                    perfil
                })
            }
        )
})
//5.1. ROTA GET: listar usuários (admin)
router.get("/usuarios", authMiddleware, authorize(["admin"]), (req, res) =>{
    
    db.all(
      `SELECT id, email, perfil
       FROM USUARIOS`,
      [],
      (err, usuarios) => { 
        if (err) {
          return res.status(500).json({ error: err.message })
        }

        res.json(usuarios) //usuarios: é o conjunto de registros retornados pelo banco, em forma de array de objetos.
        }
    )
})
//5.1. ROTA PATCH: alterar perfil (admin)
router.patch("/usuarios/:id/perfil", authMiddleware, authorize(["admin"]), (req, res) =>{
    const {id} = req.params
    const {perfil} = req.body

    if(!perfil){
        return res.status(400).json({error: "Perfil é obrigatorio"})
    }

    if(!["admin", "estoquista", "consulta"].includes(perfil)){
        return res.status(400).json({ error: "Perfil invalido"})
    }

      db.run(
      `UPDATE USUARIOS
       SET perfil = ?
       WHERE id = ?`,
      [perfil, id],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message })
        }

        if (this.changes === 0) { //This.changes: verifica se alguém foi alterado
          return res.status(404).json({ error: "Usuário não encontrado" })
        }

        res.json({
          mensagem: "Perfil atualizado com sucesso",
          id,
          novoPerfil: perfil
        })
      }
    )
  }
)

module.exports = router