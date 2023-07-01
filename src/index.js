const express = require("express");
const cors = require("cors");
require("./db/mongoose");
const adminRouter = require("./routers/admin");
const userRouter = require("./routers/user");

const app = express();
// Apply CORS middleware
app.use(cors());
const port = process.env.PORT;

app.use(express.json()); // parse the incoming requests with JSON payloads and is based upon the bodyparser
app.use(adminRouter);
app.use(userRouter);

// listen to port
app.listen(port, () => {
  console.log("Server is up on port " + port);
});
