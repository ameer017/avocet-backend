const express = require("express");
const app = express();
const morgan = require('morgan')
const userRoute = require('./routes/userRoutes')
const wasteRoute = require('./routes/wasteRoute')

app.use(morgan("combined"))

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use('/api/users', userRoute)
app.use('/api/wastes', wasteRoute)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}...`);
});
