var express = require('express');
var exphbs = require('express-handlebars');
const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: 'APP_USR-8208253118659647-112521-dd670f3fd6aa9147df51117701a2082e-677408439'
});


var port = process.env.PORT || 3000

var app = express();

const PaymentController = require("./controllers/PaymentController");
const PaymentService = require("./services/PaymentService");
const PaymentInstance = new PaymentController(new PaymentService());

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

app.post('/webhook', function (req, res) {
    if(req.method==='POST'){
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });
        req.on("end", () => {
            console.log("webhook response", body);
            res.end("ok");
        });
    }
    return res.status(200);
});

app.post('/payment', function (req, res){
    PaymentInstance.getMercadoPagoLink(req,res);
});
app.listen(port);


