const express = require("express");
const app = express();
const http = require("http").Server(app);
var fs = require('fs');


const https = require("https").createServer({
key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
},app);

const news = JSON.parse(fs.readFileSync("./news.json"));

/**
 * axios 要加這個套件不然會有'Access-Control-Allow-Origin'
 */
const cors = require("cors");
const PORT = 3001;

https.listen(PORT, () => {
    console.log(`start server at ${PORT}....`);
});

app.use(express.json());
app.use(cors());

app.use("/", express.static(__dirname + "/view"));

// app.use("/answer", (request, response) => {
//     response.json({
//         answer: "你好"
//     });
// });

// app.use("/news", (request, response) => {
//     const news = fs.readFileSync("./news.json", "utf8");
//     response.json(JSON.parse(news));
// });


