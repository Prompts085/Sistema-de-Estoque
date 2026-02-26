import db from "../db/banco.js"

const moviController = {
  // POST: Registrar Entrada
  registrarEntrada: (req, res) => {
    const { produto_id, quantidade } = req.body
    const usuario_id = req.user.id

    if (!produto_id || quantidade == null || quantidade <= 0) {
      return res.status(400).json({ error: "ID do produto e quantidade positiva são obrigatórios" })
    }

    // Buscamos o produto para saber o estoque atual
    db.get(`SELECT quantidade FROM PRODUTOS WHERE id = ?`, [produto_id], (err, produto) => {
      if (err) return res.status(500).json({ error: err.message })
      if (!produto) return res.status(404).json({ error: "Produto não encontrado" })

      const quantidadeNova = produto.quantidade + quantidade

      // Usamos serialize para garantir a ordem das operações no SQLite
      db.serialize(() => {
        // Atualiza o estoque
        db.run(`UPDATE PRODUTOS SET quantidade = ? WHERE id = ?`, [quantidadeNova, produto_id])

        // Registra a movimentação
        db.run(
          `INSERT INTO MOVIMENTACOES (produto_id, tipo, quantidade, usuario_id) VALUES (?, 'entrada', ?, ?)`,
          [produto_id, quantidade, usuario_id],
          function (err) {
            if (err) return res.status(500).json({ error: err.message })
            
            res.status(201).json({
              mensagem: "Entrada registrada",
              estoque_atual: quantidadeNova
            })
          }
        )
      })
    })
  },

  // POST: Registrar Saída
  registrarSaida: (req, res) => {
    const { produto_id, quantidade } = req.body
    const usuario_id = req.user.id

    if (!produto_id || quantidade == null || quantidade <= 0) {
      return res.status(400).json({ error: "ID do produto e quantidade válida são obrigatórios" })
    }

    db.get(`SELECT quantidade FROM PRODUTOS WHERE id = ?`, [produto_id], (err, produto) => {
      if (err) return res.status(500).json({ error: err.message })
      if (!produto) return res.status(404).json({ error: "Produto não encontrado" })

      if (quantidade > produto.quantidade) {
        return res.status(400).json({ error: "Estoque insuficiente" })
      }

      const quantidadeNova = produto.quantidade - quantidade

      db.serialize(() => {
        db.run(`UPDATE PRODUTOS SET quantidade = ? WHERE id = ?`, [quantidadeNova, produto_id])

        db.run(
          `INSERT INTO MOVIMENTACOES (produto_id, tipo, quantidade, usuario_id) VALUES (?, 'saida', ?, ?)`,
          [produto_id, quantidade, usuario_id],
          function (err) {
            if (err) return res.status(500).json({ error: err.message })
            res.status(201).json({
              mensagem: "Saída registrada",
              estoque_atual: quantidadeNova
            })
          }
        )
      })
    })
  },

  // GET: Listar todas as movimentações
  listarTudo: (req, res) => {
    const query = `
      SELECT 
        m.id, m.tipo, m.quantidade, m.data_hora,
        p.nome AS produto, u.email AS usuario
      FROM MOVIMENTACOES m
      JOIN PRODUTOS p ON m.produto_id = p.id
      JOIN USUARIOS u ON m.usuario_id = u.id
      ORDER BY m.data_hora DESC`

    db.all(query, [], (err, movimentacoes) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json(movimentacoes)
    })
  }
}

export default moviController