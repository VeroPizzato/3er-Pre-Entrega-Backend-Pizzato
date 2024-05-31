const { CartsService } = require('../services/carts.service')
const { ProductsService } = require('../services/products.service')
const { Cart: CartDAO } = require('../dao')
const { CartDTO } = require('../dao/DTOs/cart.dto')
const { addTicket } = require('./ticket.controller')

class CartsController {

    constructor() {
        this.service = new CartsService(new CartDAO())
    }

    async getCarts (req, res) {
        try {
            const carts = await this.service.getCarts()
            const cartsDTO = carts.map(cart => new CartDTO(cart))
            return res.sendSuccess(cartsDTO)
        }
        catch (err) {
            return res.sendServerError(err)
            // return res.status(500).json({
            //     message: err.message
            // })
        }
    }

    async getCartByCId (req, res) {
        try {
            let cidCart = req.cid
            let cartByCID = await this.service.getCartByCId(cidCart)
            if (!cartByCID) {
                return cartByCID === false
                ? res.sendNotFoundError({ message: 'Not found!' }, 404)
                : res.sendServerError({ message: 'Something went wrong!' })
            }
            res.sendSuccess(new CartDTO(cartByCID))
            //res.status(200).json(cartByCID)    // HTTP 200 OK
        }
        catch {
            return res.sendServerError(err)
            // return res.status(500).json({
            //     message: err.message
            // })
        }
    }

    async addCart (req, res) {
        try {
            let { products } = req.body
            await this.service.addCart(products)
            res.sendCreatedSuccess('Carrito agregado correctamente')
            //res.status(201).json({ message: "Carrito agregado correctamente" })  // HTTP 201 OK

        } catch (err) {
            res.sendUserError(err)
            // return res.status(400).json({
            //     message: err.message
            // })
        }
    }

    async createProductToCart (req, res) {
        try {
            let idCart = req.cid
            let idProd = req.pid
            let quantity = 1
            await this.service.addProductToCart(products)
            res.sendSuccess(`Se agregaron ${quantity} producto/s con ID ${idProd} al carrito con ID ${idCart}`)
            //res.status(200).json(`Se agregaron ${quantity} producto/s con ID ${idProd} al carrito con ID ${idCart}`)    // HTTP 200 OK
        } catch (err) {
            return res.sendServerError(err)
            // return res.status(500).json({
            //     message: err.message
            // })
        }
    }

    async updateCartProducts (req, res) {
        try {
            let cartId = req.cid
            const { products } = req.body
            await this.service.updateCartProducts(products)
            // HTTP 200 OK
            res.status(200).json(`Los productos del carrito con ID ${cartId} se actualizaron exitosamente.`)
        }
        catch (err) {
            return res.sendServerError(err)
            // return res.status(500).json({ message: err.message })
        }
    }

    async updateProductToCart (req, res) {
        try {
            let cartId = req.cid
            let prodId = req.pid
            const quantity = +req.body.quantity
            const result = await this.service.addProductToCart(cartId, prodId, quantity)
            if (result)
                // HTTP 200 OK
                res.status(200).json(`Se agregaron ${quantity} producto/s con ID ${prodId} al carrito con ID ${cartId}.`)
            else {
                //HTTP 400
                res.sendUserError(err)
                //res.status(400).json({ error: "Sintaxis incorrecta!" })
            }
        }
        catch (err) {
            return res.sendServerError(err)
            // return res.status(500).json({ message: err.message })
        }
    }

    async deleteCart (req, res) {
        try {
            let cartId = req.cid
            await this.service.deleteCart(cartId)
            res.status(200).json({ message: "Carrito eliminado correctamente" })  // HTTP 200 OK
        } catch (err) {
            return res.sendServerError(err)
            // return res.status(500).json({
            //     message: err.message
            // })
        }
    }

    async deleteProductToCart (req, res) {
        try {
            let cartId = req.cid
            let prodId = req.pid
            const result = await this.service.deleteProductToCart(cartId, prodId)
            if (result)
                // HTTP 200 OK
                res.status(200).json(`Se eliminó el producto con ID ${prodId} del carrito con ID ${cartId}.`)
            else {
                res.sendUserError(err)
                // HTTP 400
                //res.status(400).json({ error: "Sintaxis incorrecta!" })
            }
        }
        catch (err) {
            return res.sendServerError(err)
            // return res.status(500).json({ message: err.message })
        }
    }

    // async deleteAllProductCart (req, res) {
    //     try {
    //         let cartId = req.cid
    //         await this.service.deleteAllProductCart(cartId)
    //         res.status(200).json({ message: "Carrito vaciado correctamente" })  // HTTP 200 OK
    //     } catch (err) {
    //         return res.sendServerError(err)
    //         // return res.status(500).json({
    //         //     message: err.message
    //         // })
    //     }
    // }

    async HayStock(id, quantity) {
        const producto = await ProductsService.getProductById(id)
        const stock =  producto.stock
        if (stock < quantity) {
            console.log('false')
            return false
        } else {
            console.log('true')
            return true
        }
    }

    async finalizarCompra (req, res) {
        try {
            let cartId = req.cid
            let carrito = await this.service.getCartByCId(cartId)
            let usuarioCarrito = req.session.user.email
            let totalCarrito = 0
            let cantidadItems = 0
            let cartItemsSinStock = []
            let arrayCartPendientes = []
            if (carrito) {
                await Promise.all(carrito.products.map(async (item) => {
                    let hayStock = await HayStock(item.product, item.quantity)
                    if (hayStock) {
                        const id = item._id
                        const stockAReducir = item.quantity

                        console.log(id._id, stockAReducir)
                        const result = await ProductsService.updateProduct(id, { $inc: { stock: -stockAReducir } })

                        const subtotal = stockAReducir * item.product.price
                        totalCarrito += subtotal
                        cantidadItems += item.quantity
                    } else {
                        arrayCartPendientes.push(item)
                        cartItemsSinStock.push(item.product._id)
                    }
                }))

                const newTicket = {
                    amount: totalCarrito,
                    purchaser: usuarioCarrito
                }

                const ticketCompra = await addTicket(newTicket)  // GENERAR TICKET
                console.log(ticketCompra)

                const prodSinComprar = await this.service.updateCartProducts(cid, arrayCartPendientes)

                const cartItemsSinStockDTO = cartItemsSinStock.map(prod => new ProductDTO(prod))
                return res.sendSuccess(cartItemsSinStockDTO)
            }
        }
        catch (err) {
            return res.sendServerError(err)
        }
    }
}

module.exports = { CartsController }