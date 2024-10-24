import fs from 'fs';

export default class ProductManager {
    static #filePath = '';

    static setFilePath(filePath = '') {
        this.#filePath = filePath;
    }

    static async fetchProducts() {
        let products = []
        if (fs.existsSync(this.#filePath)) {
            const data = await fs.promises.readFile(this.#filePath, { encoding: 'utf-8' });
            return products=JSON.parse(data);
        }
        return [];
    }

    static async #saveToFile(content = '') {
        if (typeof content !== 'string') {
            throw new Error('Error in saveToFile method - invalid argument format');
        }
        await fs.promises.writeFile(this.#filePath, content);
    }

    static async addProduct(product = {}) {
        let productos= []
        try {
            const data = await this.fetchProducts()
            productos=data
        } catch (error) {
            console.error("Error añadiendo el producto:", error);
            throw error;
        }
        let id = productos.lenght>0 ?productos[productos.lenght-1].id +1:1
        const productoExistente= productos.find(p=>p.code===product.code)
        if (productoExistente){
            throw new Error('El producto ya existe');
        }
        let newProduct= {
            id, 
            ...product
        }
        productos.push(newProduct)
        await this.updateProducts(JSON.stringify(productos, null, 4))
        return newProduct
    }

    static async fetchProductsById(id){
        let productos = []
        try {
            const data = await this.fetchProducts()
            const producto = data.find(producto=>producto.id===id)
            if(!producto){
                throw new Error(`Producto con ${id} no encontrado`)
            }
            productos.push(producto)
            return producto
        } catch (error) {
            console.error("Error obteniendo el producto por ID:", error);
            throw error;
        }
    }

    static async updateProducts(productsArray = []) {
        if (!Array.isArray(productsArray)) {
            throw new Error('Error in updateProducts method - expected an array');
        }

        await this.#saveToFile(JSON.stringify(productsArray, null, 4));
        console.log('Products updated successfully');
    }
}

