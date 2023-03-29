const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const config = require("./config.js");

const routes = require("./routes/route");

const app = express();
app.use(cors());
app.use(bodyParser.json());

//<<<<<<< HEAD
const port = 5000 || config.PORT;
//=======
//const port = 12000 || config.PORT;
//>>>>>>> 42dceaa8b3c36e2b06fabf96207a2a5573c13f50
app.use(routes);

app.listen(port, () => {
  console.log("WAREHOUSE Running at port: " + port);
});
