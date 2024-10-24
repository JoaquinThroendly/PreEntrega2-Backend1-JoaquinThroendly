import express from 'express';
import { router as productsRouter} from './routes/products.js';
import { router as cartsRouter } from './routes/cart.js';
import { create } from 'express-handlebars';
import { createServer } from 'http';
import { Server } from 'socket.io';



const PORT=8080;

const app=express();
const server = createServer(app);
const io = new Server(server);

let productos = [];

const hbs = create({
    extname: '.hbs',
    defaultLayout: false,
})

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './src/views');

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'));

app.use("/api/products/", productsRouter)
app.use("/api/carts/", cartsRouter)


app.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/plain');
    res.status(200).send('OK');
    res.render('home', { productos });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { productos });
})

app.post('/agregar-producto', (req, res) => {
    const { nombre, precio } = req.body;
    if (nombre && precio) {
        const nuevoProducto = { nombre, precio };
        productos.push(nuevoProducto);

        io.emit('nuevo-producto', nuevoProducto);
        console.log('Nuevo producto agregado:', nuevoProducto);
    }
    res.redirect('/');
});

io.on('connection', (socket) => {
    console.log('Cliente Online');

    socket.on('nuevo-producto', (producto) => {
        productos.push(producto);
        io.emit('producto-actualizado', productos);
    });

    socket.on('eliminar-producto', (id) => {
        productos.splice(id, 1);
        io.emit('producto-actualizado', productos);
    });

    socket.on('disconnect', () => {
        console.log('Cliente Offline');
    });
});

/*const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});*/

server.listen(PORT, () =>{
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
