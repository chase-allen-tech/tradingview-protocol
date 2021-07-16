const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

const port = 5001;

app.use(cors());
// create our router
const router = express.Router();
app.use(express.static(path.resolve(__dirname, "build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});


app.listen(port, () => console.log(`Server is running on port ${port}!`));

module.exports = app;
