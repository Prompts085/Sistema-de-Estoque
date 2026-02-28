import db from "../db/banco.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import fs from "fs"
import path from "path"

const acessoLog = (mensagem) => {
  const data = `[${new Date().toLocaleString('pt-BR')}]`
  const LogLinha = `[${data}] ${mensagem}\n`
  fs.appendFileSync(path.join(process.cwd(), "acessos.log"), LogLinha)
}

dotenv.config();

const SECRET = process.env.JWT_SECRET

const relatorioControll ={

login: (req, res) => {
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
      acessoLog(`Usuario: ${user.email} acaba de fazer login`)
      res.json({ token })
    }
  )
},

me: (req, res) => {
db.get(
    `SELECT id, email, perfil FROM USUARIOS WHERE id = ?`,
    [req.user.id],
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({error: "Usuário não encontrado ou não existe"})
      }
      acessoLog(`Usuário ${req.user.usuario} do ID: ${req.user.id} solicitou dados do perfil.`)
      
      res.json(user)
    }
  )
}
}
export default relatorioControll
