const { Cart } = require('../dao')

class CartsService {

    constructor() {
        this.storage = new Cart()
    }

    async getCarts () {
        return await this.storage.getCarts()
    }

    async getCartByCId (cid) {
        return await this.storage.getCartByCId(cid)
    }

    async addCart (products) {
        await this.storage.addCart(products)
    }

    async addProductToCart (cartId, prodId, quantity) {        
        await this.storage.addProductToCart(cartId, prodId, quantity);       
    }

    async updateCartProducts (cartId, products) {  
        await this.storage.updateCartProducts(cartId, products)
    }   

    async deleteCart (cid) {
        await this.storage.deleteCart(cid)
    }

    async deleteProductToCart (cartId, prodId) {
        return await this.storage.deleteProductToCart(cartId, prodId)
    }

    // async deleteAllProductCart (cartId) {
    //     return await this.storage.deleteAllProductCart(cartId)
    // }
}

module.exports = { CartsService }