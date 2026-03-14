require('dotenv')
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const config = require("./config.json");

const app = express();
const PORT = config.PORT || 5050;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = require('./routes/router');

app.use('/', router);

app.listen(PORT, async () => {
    await mongoose.connect(config.MONGO_DB_SRV).then(() => {
        console.log("[+] Connected to DB");
    });

    console.log("[+] Server started on port: " + PORT);
});
