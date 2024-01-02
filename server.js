const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Home Page");
});

const PORT = process.env.PORT || 5000;

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
// })
// .catch((err) => console.log(err));
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
