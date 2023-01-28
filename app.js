const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const paymentRoutes = require("./payments/payment")
app.use(cookieParser());
dotenv.config({ path: "./congif.env" })
PORT = process.env.PORT;
require("./db/conn")
app.use(express.json());
app.use(cors());
app.use(require("./router/rout"))
app.use("/api/payment", paymentRoutes);

if ( process.env.NODE_ENV == "production"){
    app.use(express.static("thetechtown_try_three/build"));
    const path = require("path");
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'thetechtown_try_three', 'build', 'index.html'));
    })
}


app.listen(PORT, () => {
    console.log(`${PORT} port par chalu ho gaya hai`)
})