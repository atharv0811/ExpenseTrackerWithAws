const bodyParser = require("body-parser");
const express = require("express");
const router = require("./Routers/routes");
const userRouter = require("./Routers/userRoute");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/user", userRouter);
app.use(router);

app.listen(port);
