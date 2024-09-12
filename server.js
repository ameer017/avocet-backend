require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

const app = express()
const PORT = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://www.earthfi.xyz"
    ],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
}))


app.get("/", (req, res) => {
    res.send("Hello Guys! Status to my welcome..")
})

app.listen(PORT, () => {
    console.log(`Kingfisher hailing on line ${PORT} `)
})