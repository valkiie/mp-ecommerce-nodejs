var express = require('express');
var exphbs = require('express-handlebars');
const mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: 'APP_USR-8208253118659647-112521-dd670f3fd6aa9147df51117701a2082e-677408439'
});

let mpPreference = {};


var port = process.env.PORT || 3000

var app = express();

let hbs = exphbs.create({
    helpers: {
        foo: function () {
            return 'FOO!'
        },
        bar: function () {
            return 'BAR!'
        }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});
app.get('/success', function (req, res) {
    res.render('success', req.query);
});
app.get('/failure', function (req, res) {
    res.render('failure', req.query);
});
app.get('/pending', function (req, res) {
    res.render('pending', req.query);
});

app.post('/payment', function (req, res){
    console.log(req.query);
    console.log(req.body.item);
    console.log(req.body.img);
    let payer = {
        name:'Lalo',
        surname:'Landa',
        email:'test_user_46542185@testuser.com',
        identification: {
            type:'DNI',
            number: "22334445"
        },
        phone: {
            area_code: "52",
            number: "5549737300"
        },
        address: {
            street_name: "Insurgentes Sur",
            street_number: "1602",
            zip_code: "03940"
        }
    };
    let items = [{
        id: '1234',
        title: 'xxx',//******
        description: 'Dispositivo móvil de Tienda e-commerce',
        category_id: 'phones',
        quantity: 1,//*****
        currency_id: 'PEN',
        unit_price: 55.41,//******
        picture_url: ''///******
    }];
    let payment_methods = {
        installments: 6,
        default_installments: 1,
        excluded_payment_types: 'atm',
        excluded_payment_methods: 'diners'
    };
    let back_urls = {
        success: "https://valkiie-mp-commerce-nodejs.herokuapp.com/success",
        failure: "https://valkiie-mp-commerce-nodejs.herokuapp.com/failure",
        pending: "https://valkiie-mp-commerce-nodejs.herokuapp.com/pending"
    }
});
app.listen(port);


