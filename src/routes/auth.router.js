const express = require("express")
const jwt = require("jsonwebtoken")
const db = require("../db/banco")

const router = express.Router()
const SECRET = "meuSegredoSuperSeguro"

router.post("/login", (req, res) => {
  const { usuario, senha } = req.body

  if (!usuario || !senha) {
    return res.status(400).json({ error: "Usuário e senha obrigatórios" })
  }

  db.get(
    `SELECT * FROM USUARIOS WHERE email = ?`,
    [usuario],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }

      if (!user) {
        return res.status(401).json({ error: "Usuário não encontrado" })
      }

      if (user.senha !== senha) {
        return res.status(401).json({ error: "Senha inválida" })
      }

      const token = jwt.sign(
        {
          id: user.id,
          usuario: user.email,
          perfil: user.perfil
        },
        SECRET,
        { expiresIn: "1h" }
      )

      res.json({ token })
    }
  )
})

module.exports = router
