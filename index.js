const express = require('express')
const app = express();
const port = 3000;
const path = require('path')
const helmet = require('helmet')
const mysql = require('mysql')
const databaseName = 'petislife';
const fileUpload = require('express-fileupload')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload())
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Minhhieu12345',
    database: 'pet'
})
connection.connect(err => { if (err) throw err; });
//handle cors to fetch api possible
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
    next();
});
//
app.post('/upload', (req, res) => {

    console.log("UPLOADING")
    const pet = req.body;
    const queryString = `INSERT INTO ${databaseName}(petType, petName, city,petImg)
    VALUE('${pet.petType}' ,'${pet.petName}' ,'${pet.city}' ,'${req.body.petImg}');`
    connection.query(queryString, (err, data) => {
        if (err) throw err;

    })
    res.redirect('back')
})
app.put('/update', (req, res) => {
    const updatedPet = req.body;
    const queryString = `UPDATE ${databaseName} 
    set petName ='${updatedPet.petName}', petType='${updatedPet.petType}', city='${updatedPet.city}' ,petImg ='${updatedPet.petImg}'
    where petID ='${updatedPet.petID}'`
    connection.query(queryString, (err, data) => {
        if (err) throw err;
        res.json(updatedPet);
    })
})
app.get('/animals', (req, res) => {
    console.log(req.query.search)
    if (req.query.search) {
        console.log("HEHE")
        queryString = `SELECT * from ${databaseName} where isDeleted =0 and petName LIKE '%${req.query.search}%'`
        console.log(queryString)
    } else {
        queryString = `SELECT * from ${databaseName} where isDeleted = 0 ;`
    }
    connection.query(queryString, (err, data) => {
        res.json(data)
    })

})
app.get('/animals/:id', (req, res) => {
    var pet;
    console.log("GET SPECIFIC")
    const id = req.params.id;
    const queryString = `Select * from  ${databaseName} where petID = ${id} and isDeleted = 0 `
    connection.query(queryString, (err, data) => {
        if (err) throw err
        if (data) {
            pet = data[0];
            console.log(pet)
            res.json(pet);
        } else {
            res.json("NOT FOUND")
        }
    })

})
app.get('/', (req, res) => {
    res.send("FIND YOUR DOG")
})
app.listen(port, () => {
    console.log("APP IS RUNNING ON PORT ", port)
});
