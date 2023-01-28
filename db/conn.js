const mongoose = require("mongoose");
const DB = process.env.DATABASE;
mongoose.connect(DB).then(() => {
    console.log("Mubarak ho mongoose bhi connect ho server se   ")
}).catch((err) => (console.log("bhaiya ji error aagaya")))