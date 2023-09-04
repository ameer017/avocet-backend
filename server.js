require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const plasticRoutes = require("./routes/plasticRoutes")
const paymentRoute = require("./routes/paymentRoute")
const kycRoute = require("./routes/kycRoute")
const errorHandler = require("./middleware/errorMiddleware");
const path = require("path");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(cors({
  origin: ["http://localhost:5173", "https://avocet-solutions.netlify.app"],
  credentials: true, 
}));

// Routes
app.use("/api/users", userRoute);
app.use("/api/order", plasticRoutes);
app.use("/api/payment", paymentRoute);
app.use("/api/verify", kycRoute);

app.get("/", (req, res) => {
  res.send("Home Page");
});


// error page routes/ catch all routes
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ err: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
