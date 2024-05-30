module.exports = {
    userIsLoggedIn: (req, res, next) => {
        // el usuario debe tener una sesion iniciada
        const isLoggedIn = ![null, undefined].includes(req.session.user)
        if (!isLoggedIn) {
            return res.status(401).json({ error: 'User should be logged in!' })
        }

        next()
    },
    userIsNotLoggedIn: (req, res, next) => {
        // el usuario no debe tener una sesion iniciada
        const isLoggedIn = ![null, undefined].includes(req.session.user)
        if (isLoggedIn) {
            return res.status(401).json({ error: 'User should not be logged in!' })
        }

        next()
    },
    userIsAdmin: (req, res, next) => {
        // el usuario debe ser admin           
        if (req.session.user.rol != "admin") {
            return res.status(403).json({ error: 'User should be admin!' })
        }

        next()
    },
    checkUser: async (req, res, next) => {
        try {
            console.log(req.session.rol);
            if (req.session && req.session.user.rol === "user") {
                return next();
            } else {
                return res.status(401).json({
                    message: 'No autorizado'
                })
            }
        } catch (err) {
            return res.status(500).json({
                message: err.message
            })
        }
    },
    checkAdmin: async (req, res, next) => {
        try {
            console.log(req.session.rol);
            if (req.session && req.session.user.rol === "admin") {
                return next();
            } else {
                return res.status(401).json({
                    message: 'No autorizado'
                });
            }
        } catch (err) {
            return res.status(500).json({
                message: err.message
            })
        }
    }
}