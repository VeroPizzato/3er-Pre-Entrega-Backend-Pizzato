const UserModel = require("./models/user.model")

class UserDAO {
    
    login = async (email) => {  
        const user = await UserModel.findOne( email )
        return user
    }

    async getUsers() {
        try {
            const users = await UserModel.find()
            return users.map(u => u.toObject())
        }
        catch (err) {
            console.error(err)
            return null
        }
    }

    async getUserById(id) {
        try {
            const user = await UserModel.findById(id)
            return user?.toObject() ?? false
        }
        catch (err) {
            console.error(err)
            return null
        }
    }

    async saveUser(user) {
        try {
            const savedUser = await UserModel.create(user)
            return savedUser.toObject()
        }
        catch (err) {
            console.error(err)
            return null
        }
    }

    async updateUser(email, pass) {
        try {
            const result = await UserModel.updateOne({ email: email }, { $set: { password: pass }})
            return result
        }
        catch (err) {
            console.error(err)
            return null
        }
    }
}

module.exports = { UserDAO }