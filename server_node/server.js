const exp = require("express");
const app = exp();
const path = require("path");
const cors = require("cors");
const Razorpay = require("razorpay")
const crypto = require("crypto")
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
require("dotenv").config()


const userApp = require("./APIs/userApi");
const questionApp = require("./APIs/questionaApi");
const eventApp = require("./APIs/eventsApi");
const scoreApp = require("./APIs/scoreApi");
const teamApp = require("./APIs/teamApi");
const registrationApp = require('./APIs/registrationApi');

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerSpec");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(exp.json());

app.use("/users", userApp);
app.use("/Questions", questionApp);
app.use("/Events", eventApp);
app.use("/score", scoreApp);
app.use("/team", teamApp);
app.use("/registration",registrationApp);

app.use("/", (req, res) => {
  res.send("<center> GDSC VNRVJIET </center>");
});

app.use((request, response, next) => {
  response.send({ message: `path ${request.url} is invalid` });
});

app.use((error, request, response, next) => {
  response.send({ message: "Error occurred", reason: `${error.message}` });
});

app.listen(4000, () => console.log("server on port 4000.."));
