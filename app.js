const express = require("express");
const app = express();
const http = require("http").Server(app);
/**
 * axios 要加這個套件不然會有'Access-Control-Allow-Origin'
 */
const cors = require('cors');
const PORT = 8100;

http.listen(PORT, () => {
    console.log(`start server at ${PORT}....`);
});


app.use(express.json());
app.use(cors());

app.use('/', express.static(__dirname + '/view'));

app.post('/answer', (req, res) => {
    console.log(req.body);

    let {
        paragraph,
        question
    } = req.body;

    console.log(paragraph + question);


    res.json({
        answer: `你好阿今天天氣真好`
    });
});