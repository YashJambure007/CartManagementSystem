import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Initialize Stripe securely using env variable

// Route for make payment
app.post("/api/makepayment", async (req, res) => {
    try {
        const product = req?.body;

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const lineItems = product?.map((product) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: product?.model,
                },
                unit_amount: product?.price * 100,
            },
            quantity: product?.count,
        }));

        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",
        });

        res.status(200).json({ id: session?.id });
    } catch (err) {
        console.error("Stripe Payment Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(8000, () => {
    console.log("Server started at http://localhost:8000");
});
