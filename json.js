// var fs = require("fs"),
//     https = require("https"),
//     jsonServer = require("json-server"),
//     server = jsonServer.create(),
//     router = jsonServer.router("news.json"),
//     middlewares = jsonServer.defaults();

// var options = {
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert')
// };

// server.use(middlewares);
// server.use(router);

// https.createServer(options, server).listen(3002, function () {
//     console.log("json-server started on port " + 3002);
// });

var fs = require('fs');
const express = require("express");
const app = express();

const https = require("https").createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app);

const news = JSON.parse(fs.readFileSync("./news.json"));


const cors = require("cors");
const PORT = 3002;

https.listen(PORT, () => {
    console.log(`start server at ${PORT}....`);
});

app.use(express.json());
app.use(cors());

app.get("/paragraphs", (req, res) => {
    console.log("aassss");
    res.json(news);
});

app.get("/", (req, res) => {
    console.log("aassss");
    // res.json(news);
});