const express = require("express");
const app = express();
const mysql = require('mysql');

const config = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'diplom',
};

app.use(express.static(__dirname + "/public"));

const pool = mysql.createPool(config);

module.exports = pool;

app.get('/api/cameras', (request, response) => {

    pool.query('SELECT * FROM camera', (error, result) => {
        if (error) throw error;
 
        response.send(result);
    });
});

app.get('/api/cameras/:id', (request, response) => {
    const id = request.params.id;
 
    pool.query('SELECT * FROM camera WHERE id = ?', id, (error, result) => {
        if (error) throw error;
 
        response.send(result);
    });
});

app.get('/api/lines', (request, response) => {

    pool.query('SELECT * FROM linesfordraw', (error, result) => {
        if (error) throw error;
 
        response.send(result);
    });
});

app.get('/api/points', (request, response) => {

    pool.query('SELECT * FROM point', (error, result) => {
        if (error) throw error;
        
        response.send(result);
    });
});


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});
