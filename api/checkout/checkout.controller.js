const Stripe = require("stripe");
const { PrismaClient } = require("@prisma/client");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

async function handlerCheckout(req, res) {
  console.log("Request Body:", req.body); // Agrega esto para depuración
  const { amount, paymentMethod, userEmail } = req.body;

  try {
    // Crear el PaymentIntent
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      description: "Compra de prueba en el top-v29",
      payment_method: paymentMethod.id, // Asegúrate de que este campo esté aquí
      confirm: true, // Esto puede hacer que la confirmación ocurra inmediatamente
    });

    // Verificar el estado del pago
    if (payment.status !== "succeeded") {
      return res.status(400).json({ message: "No se pudo realizar el pago" });
    }

    // Almacenar la transacción en la base de datos
    const user = await prisma.user.upsert({
      where: { email: userEmail },
      update: {},
      create: { email: userEmail },
    });

    await prisma.transaction.create({
      data: {
        amount,
        userId: user.id,
      },
    });

    return res.status(200).json({ message: "Pago realizado con éxito" });
  } catch (error) {
    console.error("🚀 error:", error); // Manejo de errores
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  handlerCheckout,
};
