import sqlite3 from "sqlite3"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = process.env.DB_FILE || path.resolve(__dirname, "../../database.db")

//Executamos o verbose() primeiro e depois instanciamos o Database
const sqlite = sqlite3.verbose()
const db = new sqlite.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao abrir o banco de dados:", err.message)
    } else {
        console.log("Banco de dados conectado")
    }
})

db.parallelize(() => { // roda tudo em paralelo (rápido, perigoso pra FK)

db.run("PRAGMA foreign_keys = ON")

db.run(`
CREATE TABLE IF NOT EXISTS USUARIOS (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  perfil TEXT NOT NULL CHECK (
    perfil IN ('admin', 'estoquista', 'consulta')
  )
)
`)

db.run(`
CREATE TABLE IF NOT EXISTS PRODUTOS (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  quantidade INTEGER NOT NULL CHECK (quantidade >= 0),
  minimo INTEGER NOT NULL CHECK (minimo >= 0)
)
`)

db.run(`
CREATE TABLE IF NOT EXISTS MOVIMENTACOES (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  produto_id INTEGER NOT NULL,
  tipo TEXT NOT NULL,
  quantidade INTEGER NOT NULL,
  usuario_id INTEGER NOT NULL,
  data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (produto_id) REFERENCES PRODUTOS(id),
  FOREIGN KEY (usuario_id) REFERENCES USUARIOS(id)
)
`)
})

export default db