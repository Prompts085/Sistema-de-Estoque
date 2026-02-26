import express from "express"
const app = express()

app.use(express.json())

import routerAuth from "./routes/auth.router.js"
import routerUser from "./routes/usuarios.router.js"
import routerProd from "./routes/produtos.router.js"
import routerMov from "./routes/movi.router.js"
import routerRela from "./routes/relatorio.router.js"

app.get("/", (req, res) =>{
    res.json({mensage: "Deu bom!"})
})

app.use("/api", routerAuth)
app.use("/api", routerUser)
app.use("/api", routerProd)
app.use("/api", routerMov)
app.use("/api", routerRela)

export default app