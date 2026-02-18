const express = require("express")
const app = express()

app.use(express.json())

const routerAuth = require("./routes/auth.router")
const routerUser = require("./routes/usuarios.router")
const routerProd = require("./routes/produtos.router")
const routerMov = require("./routes/movi.router")

app.use("/api", routerAuth)
app.use("/api", routerUser)
app.use("/api", routerProd)
app.use("/api", routerMov)

module.exports = app
