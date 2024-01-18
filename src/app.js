import express from "express"
import connect from "./config/dbConnect.js"
import routes from "./routes/index.js"
import manipuladorDeErros from "./middlewares/manipuladorDeErros.js"
import manipulador404 from "./middlewares/manipulador404.js"

const conexao = await connect()

conexao.on("error", (error) => console.error("Erro de conexão", error))
conexao.once("open", () => console.log("Conectamos no MongoDB!"))

const app = express()
routes(app)

app.use(manipulador404)

app.use(manipuladorDeErros)

export default app