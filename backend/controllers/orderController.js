import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Stripe from "stripe";
import mongoose from "mongoose";

// lazy stripe initialization to avoid crashing if secret key is missing
const getStripe = () => {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || key.trim() === "") return null;
    return new Stripe(key);
}

//config variables
const currency = "inr";
const deliveryCharge = 50;
const frontend_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Placing User Order for Frontend using stripe
const placeOrder = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json({ success: false, message: "Database not connected. Please check MONGODB_URI in backend/.env" });
        }
        const stripe = getStripe();
        if (!stripe) {
            return res.json({ success: false, message: "Stripe payment is not configured. Please select COD (Cash on Delivery) or set STRIPE_SECRET_KEY in backend/.env" });
        }

        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charge"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message || "Error" })
    }
}

// Placing User Order for Frontend using stripe
const placeOrderCod = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json({ success: false, message: "Database not connected. Please check MONGODB_URI in backend/.env" });
        }
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: true,
            paymentMethod: "COD"
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message || "Error" })
    }
}

// Placing User Order for Frontend using Online Payment (Card / UPI / NetBanking)
const placeOrderOnline = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json({ success: false, message: "Database not connected. Please check MONGODB_URI in backend/.env" });
        }
        const { userId, items, amount, address, paymentMethod, transactionId } = req.body;

        if (!items || items.length === 0) {
            return res.json({ success: false, message: "No items in cart to place order" });
        }

        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            payment: true,
            paymentMethod: paymentMethod || "Online Payment",
            transactionId: transactionId || `TXN_${Date.now()}`
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({
            success: true,
            message: "Payment Successful & Order Placed!",
            orderId: newOrder._id,
            transactionId: newOrder.transactionId
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message || "Payment processing failed" });
    }
}

// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json({ success: false, message: "Database not connected. Please check MONGODB_URI in backend/.env", data: [] });
        }
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message || "Error", data: [] })
    }
}

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json({ success: false, message: "Database not connected. Please check MONGODB_URI in backend/.env", data: [] });
        }
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message || "Error", data: [] })
    }
}

const updateStatus = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json({ success: false, message: "Database not connected. Please check MONGODB_URI in backend/.env" });
        }
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        res.json({ success: false, message: error.message || "Error" })
    }
}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json({ success: false, message: "Database not connected. Please check MONGODB_URI in backend/.env" });
        }
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        res.json({ success: false, message: error.message || "Not Verified" })
    }
}

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod, placeOrderOnline }