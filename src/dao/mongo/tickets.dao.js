const ticketModel = require('../mongo/models/ticket.model')

const getAllTickets = async () => {
    return await ticketModel.find()
}

const add_Ticket = async (newTicket) => {    
    const ticket = ticketModel.create(newTicket)
    console.log(ticket)
    return ticket
}

module.exports = { getAllTickets, add_Ticket }