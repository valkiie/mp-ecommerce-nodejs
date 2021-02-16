class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }

    async getMercadoPagoLink(req, res) {
        const { name, price, unit, img } = req.query;

        try {
            const checkout = await this.paymentService.createPaymentMercadoPago(
                name,
                price,
                unit,
                img
            );
            console.log("getMercadoPagoLink", checkout);
            return res.redirect(checkout.init_point);
        } catch (err) {
            res.redirect("/");
            return res.status(500).json({
                error: true,
                msg: "Hubo un error con Mercado Pago"
            });
        }
    }
}

module.exports = PaymentController;