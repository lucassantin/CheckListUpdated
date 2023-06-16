import Fastify from "fastify";
import cors from "@fastify/cors"
import { appRoutes } from "./lib/routes";

const app = Fastify({
  logger: true,
}) //criando uma aplicacao executando o fastify

app.register(cors)
app.register(appRoutes)
// metodos http: 
// GET(buscar uma informa de uma banco de dados)(uma rota que retorna alguma coisa no navegador),
// POST(uma rota que cria alguma coisa), 
// PUT(atualizacao de recursos por completo), 
// DELETE(remocao de recursos)



//fazendo com que nossa aplicacao ouca a porta 3333
app.listen({
  host: "192.168.1.27",
  port: 3333,
}).then(() => { //quando a aplicacao estiver rodando, vai aparecer essa mensagem no console
  console.log("HHTP Server running! ")
})