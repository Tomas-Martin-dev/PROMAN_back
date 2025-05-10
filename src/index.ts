import server from "./server"

const port = process.env.PORT || 3000;

server.listen(port, ()=> {
    console.log(`Servidor funcionando en el puerto ${port}`);
})