import db from "../db/banco.js"
import fs from "fs"
import path from "path"

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

        //Desafio: Arquivo CSV
        let conteudoCSV= "ID;Produto;Quantidade;Minimo\n"
        produtos.forEach(p => {
          conteudoCSV += `${p.id};${p.nome};${p.quantidade};${p.minimo}\n`
        })

        const filePath = path.join(process.cwd(), "relatorio.csv")

        try {
          fs.writeFileSync(filePath, conteudoCSV)
          //Retornar os dados 
          res.status(200).json(produtos)
        } catch (fileErr) {
          res.status(500).json({ error: "Erro ao gravar o arquivo no servidor" })
        }
      }
    )
  }
}

export default relatorioControll