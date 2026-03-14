const express = require('express');

const config = require("./config.json")

const app = express();
const PORT = config.PORT || 5050;

const router = require('./routes/router');

app.use('/', router);

app.listen(PORT, async () => {
    console.log("[+] Server started on port: " + PORT);
});
