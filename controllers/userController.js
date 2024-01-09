const createUser = async(req, res) => {
    
    res.status(500).json({
        status: "error",
        message: "internal server error",
    })
}

const getUser = async(req, res) => {
    res.status(500).json({
        status: "error",
        message: "internal server error",
    })
}

const getAllUsers = async(req, res) => {
    res.status(500).json({
        status: "error",
        message: "internal server error",
    })
}

const updateUser = async(req, res) => {
    res.status(500).json({
        status: "error",
        message: "internal server error",
    })
}

const upgradeUser = async(req, res) => {
    res.status(500).json({
        status: "error",
        message: "internal server error",
    })
}

const deleteUser = async(req, res) => {
    res.status(500).json({
        status: "error",
        message: "internal server error",
    })
}

module.exports = {
    createUser,
    getUser,
    getAllUsers,
    updateUser,
    upgradeUser,
    deleteUser
}