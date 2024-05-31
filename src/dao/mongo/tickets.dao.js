const { Ticket } = require('../mongo/models/ticket.model')

const getAllTickets = async () => {
    return await Ticket.find()
}

const add_Ticket = async (newTicket) => {
    const ticket = Ticket.create(newTicket)
    return ticket
}

module.exports = { getAllTickets, add_Ticket }