const axios = require("axios");

class PaymentService {
    constructor() {
        this.tokensMercadoPago = {
            prod: {},
            test: {
                access_token:
                    "APP_USR-8208253118659647-112521-dd670f3fd6aa9147df51117701a2082e-677408439"
            }
        };
        this.mercadoPagoUrl = "https://api.mercadopago.com/checkout";
    }

    async createPaymentMercadoPago(name, price, unit, img) {
        const url = `${this.mercadoPagoUrl}/preferences?access_token=${this.tokensMercadoPago.test.access_token}`;
        img= 'https://valkiie-mp-commerce-nodejs.herokuapp.com'+img.substring(1);
        const items = [
            {
                id: 1234,
                title: name,
                description: "Dispositivo móvil de Tienda e-commerce",
                picture_url: img,
                quantity: parseInt(unit),
                unit_price: parseFloat(price),
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
                    number: "5549737300"
                },
                address: {
                    street_name: "Insurgentes Sur",
                    street_number: "1602",
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

        try {
            const request = await axios.post(url, preferences, {
                headers: {
                    "Content-Type": "application/json",
                    "x-integrator-id": "dev_2e4ad5dd362f11eb809d0242ac130004"
                }
            });
            return request.data;
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = PaymentService;