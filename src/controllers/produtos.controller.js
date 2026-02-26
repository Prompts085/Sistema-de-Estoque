import db from "../db/banco.js"

const produtoControll = {

criarProduto: (req, res) => {
  const { nome, quantidade, minimo } = req.body

  // 1. Primeiro, checa se o produto com esse nome já existe
  db.get(`SELECT id, quantidade FROM PRODUTOS WHERE nome = ?`, [nome], (err, produtoExiste) => {
    if (err) return res.status(500).json({ error: err.message });

    if (produtoExiste) {
      // 2. Se existe, apenas soma a quantidade (Update)
      const novaQuantidade = produtoExiste.quantidade + quantidade
      
      db.run(
        `UPDATE PRODUTOS SET quantidade = ? WHERE id = ?`,
        [novaQuantidade, produtoExiste.id],
        (err) => {
          
          if (err) return res.status(500).json({ error: err.message })
            
          return res.status(200).json({ 
            mensagem: "Produto já existia, estoque atualizado", 
            id: produtoExiste.id,
            estoque_atual: novaQuantidade 
          })
        }
      )
    } else {
      // 3. Se não existe, aí sim faz o INSERT original
      db.run(
        `INSERT INTO PRODUTOS (nome, quantidade, minimo) VALUES(?, ?, ?)`,
        [nome, quantidade, minimo],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });
          return res.status(201).json({ id: this.lastID, nome, quantidade, minimo });
        }
      );
    }
  });
},

listarProd : (req, res) => {
    
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
},

solicitarProd: (req, res) =>{
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
},

atualizarProd: (req, res) =>{
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
  },
//COALESCE: Se o valor vier null, ele mantém o que já está no banco e ermite atualizar só um campo sem quebrar o outro

deletarProd: (req, res) =>{
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
  }
}
 export default produtoControll