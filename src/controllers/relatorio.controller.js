import db from "../db/banco.js"

const relatorioControll = {
relatorio: (req, res) => {

    db.all(
      `SELECT id, nome, quantidade, minimo
       FROM PRODUTOS
       WHERE quantidade <= minimo`,
      [],
      (err, produtos) => {
        if (err) {
          return res.status(500).json({ error: err.message })
        }

        res.status(200).json(produtos)
      }
    )
  }
}

export default relatorioControll