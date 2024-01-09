const fs = require('fs')
const nfts = fs.readFileSync(`${__dirname}/`)

const getProperties = async (req, res) => {
    res.status(200).json({
        status: "success",
        data: {

        }
    })
}
