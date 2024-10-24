import { Router } from 'express';
import  CartManager  from '../dao/CartManager.js';
import { error } from 'console';


export const router = Router();


CartManager.setFilePath("./src/data/carrito.json");

router.get("/", async (req, res) => {
    try {
        const carritoList = await CartManager.fetchCarts();
        res.status(200).json({ carrito: carritoList });
    } catch (error) {
        console.error('Error al obtener carritos:', error);
        res.status(500).json({
            error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
            detalle: error.message
        });
    }
});

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;


    try {
        const carritos = await CartManager.fetchCartsById(cid);
        
        !carritos ? res.status(404).json({error: 'Cart not found'}) : res.status(200).json(carritos)

    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({
            error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
            detalle: error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const carritos = await CartManager.createCart();
        carritos ? res.status(201).json(carritos) : res.status(400).send({error: 'Cart not created'})
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({
            error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
            detalle: error.message
        });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body

    try {
        const carritos = await CartManager.addProductCart(cid, pid, quantity);
        carritos? res.status(200).json(carritos):res.status(404).json({error:error.message})

        

        
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({
            error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
            detalle: error.message
        });
    }
});
