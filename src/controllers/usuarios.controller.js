import db from "../db/banco.js"

const usuarioController = {
  
  // Criar Usuário
  criarUser: (req, res) => {
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
      },

  // Listar Usuários
  ListarUser: (req, res) => {
     db.all(
      `SELECT id, email, perfil FROM USUARIOS`,
      [],
      (err, usuarios) => { 
        if (err) return res.status(500).json({ error: err.message })
        res.json(usuarios)
      })
  },

  // Alterar Perfil
  AlterarUser: (req, res) => {
    const {id} = req.params
    const {perfil} = req.body

    if(!perfil) return res.status(400).json({error: "Perfil é obrigatorio"})

    if(!["admin", "estoquista", "consulta"].includes(perfil)){
        return res.status(400).json({ error: "Perfil invalido"})
    }

    db.run(
      `UPDATE USUARIOS SET perfil = ? WHERE id = ?`,
      [perfil, id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message })
        if (this.changes === 0) return res.status(404).json({ error: "Usuário não encontrado" })

        res.json({
          mensagem: "Perfil atualizado com sucesso",
          id,
          novoPerfil: perfil
        })
      }
    )
  }
}

export default usuarioController