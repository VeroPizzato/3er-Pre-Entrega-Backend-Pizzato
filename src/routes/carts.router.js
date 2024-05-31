const { validarNuevoCarrito, validarCarritoExistente } = require('../middlewares/cart.middleware')
const { validarProductoExistente } = require('../middlewares/product.middleware')
const { userIsUser } = require('../middlewares/auth.middleware')
const { CartsController } = require('../controllers/carts.controller')
const Router = require('./router')

const withController = callback => {
    return (req, res) => {       
        const controller = new CartsController()
        return callback(controller, req, res)
    }
}

class CartsRouter extends Router {
    init() {      
        this.get('/', withController((controller, req, res) => controller.getCarts(req, res)))

        this.get('/:cid', validarCarritoExistente, withController((controller, req, res) => controller.getCartByCId(req, res)))     

        this.post('/', userIsUser, validarNuevoCarrito, withController((controller, req, res) => controller.addCart(req, res))) 

        this.post('/:cid/products/:pid', userIsUser, validarCarritoExistente, withController((controller, req, res) => controller.createProductToCart(req, res)))
  
        this.put('/:cid', userIsUser, validarCarritoExistente, withController((controller, req, res) => controller.updateCartProducts(req, res)))

        this.put('/:cid/products/:pid', userIsUser, validarCarritoExistente, validarProductoExistente, withController((controller, req, res) => controller.updateProductToCart(req, res))) 
     
        this.delete('/:cid', userIsUser, validarCarritoExistente, withController((controller, req, res) => controller.deleteCart(req, res)))
     
        this.delete('/:cid/products/:pid', userIsUser, validarCarritoExistente, validarProductoExistente, withController((controller, req, res) => controller.deleteProductToCart(req, res)))      

        //this.delete('/:cid', validarCarritoExistente, withController((controller, req, res) => controller.deleteAllProductCart(req, res)))

        this.post('/:cid/purchase', userIsUser, withController((controller, req, res)  => controller.finalizarCompra(req, res)))      
    }
}

module.exports = CartsRouter 

