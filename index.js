const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const config = require("./config.js");

const routes = require("./routes/route");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 11000 || config.PORT;
app.use(routes);

app.listen(port, () => {
  console.log("WAREHOUSE Running at port: " + port);
});
