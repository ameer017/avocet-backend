require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const userRoute = require("./routes/userRoutes");
const wasteRoute = require("./routes/wasteRoute");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.use(morgan("combined"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use("/api/users", userRoute);
app.use("/api/wastes", wasteRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}...`);
});
