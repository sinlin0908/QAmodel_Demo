const express = require("express");
const app = express();
/**
 * axios 要加這個套件不然會有'Access-Control-Allow-Origin'
 */
const cors = require('cors');
const PORT = 8100;

app.listen(PORT, () => {
    console.log(`start server at ${PORT}....`);
});

app.use(express.json());
app.use(cors());

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