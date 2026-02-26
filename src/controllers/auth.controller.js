import db from "../db/banco.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

const SECRET = process.env.JWT_SECRET

const login = (req, res) => {
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
}
export default login
