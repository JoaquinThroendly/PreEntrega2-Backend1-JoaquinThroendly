import { Router } from 'express';
import ProductManager from '../dao/ProductManager'; 

export const router = Router();

ProductManager.setFilePath('./src/data/productos.json');

router.get('/', async (req, res) => {
    try {
        const allProducts = await ProductManager.fetchProducts();
        res.status(200).json(allProducts);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.post('/', async (req, res) => {
    const { title, price, description, code, status, stock, category } = req.body;

    if (!title || !price || !code) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
        const newProduct = await ProductManager.addProduct({ title, price, description, code, status, stock, category });
        console.log('Producto agregado:', newProduct);
        io.emit('producto-actualizado', await ProductManager.fetchProducts());
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const message = await ProductManager.deleteProduct(Number(pid));
        console.log(message);
        io.emit('producto-actualizado', await ProductManager.fetchProducts());
        res.status(200).json({ message });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});
