class CartDTO {

    constructor(cart) {
        this.id = cart._id.toString()
    }

}

module.exports = { CartDTO }