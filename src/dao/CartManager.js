import fs from 'fs';

export default class CartManager {
    
    static #filePath = '';

    
    static setFilePath(filePath = '') {
        this.#filePath = filePath;
    }

    static async fetchCarts() {
        let carritos=[]

        if (fs.existsSync(this.#filePath)) {
            const data = await fs.promises.readFile(this.#filePath, { encoding: 'utf-8' });
           
            return carritos= JSON.parse(data);
        }
    
        return [];
    }

    static async fetchCartsById(id){
        try {
            const carritos= await this.fetchCarts()
            const carrito= await carritos.find(carrito=>carrito.id===Number(id))
            return carrito
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new Error('Cart not found');
            } else {
                throw error;
            }
            
        }
    }
    static async #saveFile(content = '') {
        if (typeof content !== 'string') {
            throw new Error('Error in saveFile method - invalid argument format');
        }
        await fs.promises.writeFile(this.#filePath, content);
    }

    static async createCart(newCart = {}) {
        let nuevoCarritos = []

        try {
        const carts = await this.fetchCarts();
        nuevoCarritos = carts 
            
        } catch (error) {
            if (error.code === 'ENOENT') {
                nuevoCarritos = [];
            } else {
                throw error;
            }

        }

        let id= nuevoCarritos.length > 0 ? nuevoCarritos[nuevoCarritos.length - 1].id + 1 : 1
        newCart= {
            id:id, 
            products:[]
        }
        nuevoCarritos.push(newCart)
        await this.updateCarts(nuevoCarritos)
        return newCart


    }

    static async addProductCart(cid, pid, quantity){
       
        try {
            const data= await this.fetchCarts()
            const carrito= data.find(c=>c.id===Number(cid))
            const producto = carrito.products.find(p=>p.products===Number(pid))
            if(producto===undefined){
                carrito.products.push({products:Number(pid), quantity:Number(quantity)})
            }else{
                producto.quantity+=Number(quantity)
            }
            await this.updateCarts(data)
            return carrito

        } catch (error) {
            throw new Error(error);
        }
        return false
    }

    static async updateCarts(cartArray = []) {
        if (!Array.isArray(cartArray)) {
            throw new Error('Error in updateCarts method - expected an array');
        }

        await this.#saveFile(JSON.stringify(cartArray, null, 4));
        console.log('Carts updated successfully');
    }

}
