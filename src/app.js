import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import ProductManager from './dao/ProductManager.js';
import { router as productsRouter } from './routes/products.js';
import { create } from 'express-handlebars';

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = 8083;

const hbs = create({
    extname: '.hbs',
    defaultLayout: false,
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './src/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

ProductManager.setFilePath('./src/data/productos.json');

app.use("/api/products/", productsRouter);

app.get('/realtimeproducts', async (req, res) => {
    try {
        const productos = await ProductManager.fetchProducts();
        res.render('realTimeProducts', { productos });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener productos');
    }
});

io.on('connection', (socket) => {
    console.log('Cliente conectado');

socket.on('nuevo-producto', async (producto) => {
    try {
        const nuevoProducto = await ProductManager.addProduct(producto); 
        const productosActualizados = await ProductManager.fetchProducts();
        io.emit('producto-actualizado', productosActualizados);
        console.log('Producto agregado con éxito:', nuevoProducto);
    } catch (error) {
        console.error('Error al agregar el producto:', error);
    }
});

    

    socket.on('eliminar-producto', async (id) => {
        try {
            await ProductManager.deleteProduct(id);
            const productosActualizados = await ProductManager.fetchProducts();
            io.emit('producto-actualizado', productosActualizados);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
