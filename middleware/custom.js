const asyncHandler = require("express-async-handler");

const testing = asyncHandler(
    async (req, res, next) => 
    {

        next()
});

module.exports = { testing };
