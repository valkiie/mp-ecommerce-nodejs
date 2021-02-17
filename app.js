var express = require('express');
var exphbs = require('express-handlebars');
const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: 'APP_USR-8208253118659647-112521-dd670f3fd6aa9147df51117701a2082e-677408439',
    integrator_id: 'dev_2e4ad5dd362f11eb809d0242ac130004'
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
const bodyparser = require('body-parser'); //Post request

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false })) // Post request imports
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res){
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
app.post('/checkout', function (req, res) {
    const items = [
        {
            id: 1234,
            title: req.body.title,
            description: "Dispositivo móvil de Tienda e-commerce",
            picture_url: req.body.img,
            quantity: parseInt(req.body.unit),
            unit_price: parseFloat(req.body.price),
            category_id: 'phones',
            currency_id: 'PEN'
        }
    ];

    const preferences = {
        items,
        external_reference: "ch.richard22@gmail.com",
        payer: {
            name: "Lalo",
            surname: "Landa",
            email: "test_user_46542185@testuser.com",
            identification: {
                type:'DNI',
                number: "22334445"
            },
            phone: {
                area_code: "52",
                number: parseInt(5549737300)
            },
            address: {
                street_name: "Insurgentes Sur",
                street_number: 1602,
                zip_code: "03940"
            }
        },
        payment_methods: {
            excluded_payment_methods: [
                {
                    id: "diners"
                }
            ],
            excluded_payment_types: [{ id: "atm" }],
            installments: 6,
        },
        back_urls: {
            success: "https://valkiie-mp-commerce-nodejs.herokuapp.com/success",
            failure: "https://valkiie-mp-commerce-nodejs.herokuapp.com/failure",
            pending: "https://valkiie-mp-commerce-nodejs.herokuapp.com/pending"
        },
        notification_url: "https://valkiie-mp-commerce-nodejs.herokuapp.com/webhook",
        auto_return: "approved"
    };

    mercadopago.preferences.create(preferences)
        .then(function (response) {
            // Este valor reemplazará el string "<%= global.id %>" en tu HTML
            global.id = response.body.id;

            //console.log(response);
            console.log("Preferences id -> "+response.body.id);

            res.redirect(response.body.init_point);

        }).catch(function (error) {
        console.log(error);
    });
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


