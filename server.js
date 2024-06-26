require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorMiddleware");
const wasteRoute = require("./routes/wasteRoute");
const contactRoute = require("./routes/contactRoute");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "*",
      "https://cloud.google.com/java/docs/reference/google-auth-library/latest/com.google.auth.oauth2",
      "https://api.korapay.com/merchant/api/v1/transactions/disburse",
      "https://earthfi.vercel.app/"
    ],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  })
);

// Routes

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use("/api/plastik", wasteRoute);
app.use("/api/contacts", contactRoute);

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
