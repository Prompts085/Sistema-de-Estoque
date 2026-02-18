const express = require('express')
const router = express.Router()
const db = require("../db/banco")

const authMiddleware = require("../middlewares/authMiddleware")
const authorize = require("../middlewares/authorizeRoles")

router.get("/relatorios/baixo-estoque", authMiddleware, authorize(["admin"]), (req, res) => {

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
)
