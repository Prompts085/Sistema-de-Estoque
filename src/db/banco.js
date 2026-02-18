const sqlite3 = require("sqlite3").verbose()
const path = require('path')

const dbPath = path.resolve(__dirname, "database.db")
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
    console.error("Erro ao conectar no banco:", err)
  } else {
    console.log("Banco SQLite conectado")
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
);
`)
})

module.exports = db