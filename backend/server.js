const http = require('http');
const url = require('url');
const path = require('path');
const express = require('./express');
const dataSource = require('../data');

const app = express();

let soldData = [];
let unsoldData = [];

dataSource.forEach((item) => {
    if (item.sold === 0) {
        unsoldData.push(item);
    } else {
        soldData.push(item);
    }
});

function getRandomItem(array, num) {
    let pickItems = [];
    [...new Array(parseInt(num))].forEach(() => {
        const idx = Math.floor(Math.random()*array.length);
        const item = array.splice(idx, 1);
        pickItems = pickItems.concat(item);
    });
    return pickItems;
}

app.use(null, app.staticFile(path.join(__dirname, '../front/assets')));


app.use('/api/ticket/buy', (req, res, next) => {
    const query =  url.parse(req.url).query;
    const num = query.split('=')[1];
    const soldItems = getRandomItem(unsoldData, num);
    soldData = soldData.concat(soldItems);
    res.send({
        code: 0,
        data: soldItems
    });
    next();
});

app.use(function (req, res, next) {
    res.render('index.html');
});

http.createServer(app).listen(9090, function () {
    console.log('start at 9090 port');
});
