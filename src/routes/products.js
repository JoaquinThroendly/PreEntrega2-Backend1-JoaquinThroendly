import { Router } from 'express';
import  ProductManager  from '../dao/ProductManager.js';

export const router = Router();

ProductManager.setFilePath("./src/data/productos.json");

router.get('/', async (req, res) => {
    try {
        const allProducts = await ProductManager.fetchProducts();
        const { limit } = req.query;
        let response = allProducts;

        if (!limit) {
            response = allProducts; 
        } else {
            const parsedLimit = Number(limit);
            if (isNaN(parsedLimit)) {
                return res.status(400).json({ error: 'El parámetro limit debe ser numérico' });
            }
            response = allProducts.slice(0, parsedLimit); 
        }

        res.status(200).json({ products: response });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
            detalle: error.message
        });
    }
});


router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const numericId = Number(pid);

    if (isNaN(numericId)) {
        return res.status(400).json({ error: 'El pid debe ser numérico' });
    }

    try {
        const productos = await ProductManager.fetchProductsById(numericId);
        productos ? res.status(200).json(productos):res.status(404).json({error: error.message})
        

    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({
            error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
            detalle: error.message
        });
    }
});

router.post('/', async (req, res) => {
    const{producto}= req.body
    try {
        const productos= await ProductManager.addProduct(producto)
        productos? res.status(201).json(productos):res.status(404).json({error:error.message})
    } catch (error) {
        throw new Error('El producto ya existe');
    }
});


router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const updates = req.body;
    const numericId = Number(pid);

    if (isNaN(numericId)) {
        return res.status(400).json({ error: 'El pid debe ser numérico' });
    }

    try {
        const productos = await ProductsManager.getProducts();
        const productIndex = productos.findIndex(p => p.id === numericId);

        if (productIndex === -1) {
            return res.status(404).json({ error: `Producto con id ${pid} no encontrado` });
        }

        productos[productIndex] = {
            ...productos[productIndex],
            ...updates
        };

        await ProductsManager.actualizadorDeProductos(productos);
        return res.status(200).json({ message: `Producto con id ${pid} actualizado`, producto: productos[productIndex] });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({
            error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
            detalle: error.message
        });
    }
});


router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const productos = await ProductsManager.getProducts();
        const productIndex = productos.findIndex(p => p.id === Number(pid));

        if (productIndex === -1) {
            return res.status(404).json({ error: `No se encontró un producto con el pid ${pid}` });
        }

        productos.splice(productIndex, 1);
        await ProductsManager.actualizadorDeProductos(productos);
        return res.status(200).json({ message: `Producto con pid ${pid} eliminado exitosamente` });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({
            error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
            detalle: error.message
        });
    }
});
