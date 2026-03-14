require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const config = require("./config.json");

const app = express();
const PORT = config.PORT || 5050;

app.use(cors())
app.use(express.static(path.join(__dirname, "client")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('trust proxy', true);

const router = require('./routes/router');

app.use('/', router);

app.listen(PORT, async () => {
    await mongoose.connect(config.MONGO_DB_SRV).then(() => {
        console.log("[+] Connected to DB");
    });

    console.log("[+] Server started on port: " + PORT);
});
