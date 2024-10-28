import fs from 'fs';

export default class ProductManager {
    static #filePath = '';

    static setFilePath(filePath = '') {
        this.#filePath = filePath;
    }

    static async fetchProducts() {
        try {
            if (fs.existsSync(this.#filePath)) {
                const data = await fs.promises.readFile(this.#filePath, { encoding: 'utf-8' });
                return data ? JSON.parse(data) : []; 
            }
            return []; 
        } catch (error) {
            console.error('Error leyendo productos:', error);
            return [];
        }
    }

    static async #saveToFile(content = '') {
        await fs.promises.writeFile(this.#filePath, content);
        console.log('Archivo actualizado');
    }

    static async addProduct(product = {}) {
        const products = await this.fetchProducts();

        if ('id' in product) {
            delete product.id;
        }

        const newId = products.length > 0 ? Math.max(...products.map(p => p.id || 0)) + 1 : 1;

        const newProduct = {
            id: newId,  
            ...product,  
        };

        products.push(newProduct);
        await this.#saveToFile(JSON.stringify(products, null, 4));
        console.log('Producto agregado exitosamente:', newProduct);

        return newProduct;
    }

    static async deleteProduct(id) {
        const products = await this.fetchProducts();
        const index = products.findIndex(product => product.id === id);

        if (index === -1) {
            throw new Error(`Producto con ID ${id} no encontrado`);
        }

        products.splice(index, 1);
        await this.#saveToFile(JSON.stringify(products, null, 4));
        console.log(`Producto con ID ${id} eliminado`);
        return { message: `Producto con ID ${id} eliminado exitosamente` };
    }
}
