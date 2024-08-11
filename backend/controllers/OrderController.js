import prisma from "../prisma/index.js";
import Stripe from "stripe";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  try {
    const { token, items, totalAmount, address } = req.body;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized! Login Again" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("Token verification error:", error);
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized! Login Again" });
    }

    const userId = decoded.id;

    console.log("Order data received:");

    const newOrder = await prisma.Order.create({
      data: {
        user: { connect: { id: userId } },
        items: {
          create: items.map((item) => ({
            food: { connect: { id: item.id } },
            quantity: item.quantity,
          })),
        },
        totalAmount,
        address: {
          create: {
            firstName: address.firstName,
            lastName: address.lastName,
            email: address.email,
            street: address.street,
            city: address.city,
            state: address.state,
            pinCode: address.pinCode,
            country: address.country,
            contactNumber: address.contactNumber,
          },
        },
      },
    });

    //   console.log("New order created:", newOrder);

    //   await prisma.cart.deleteMany({
    //     where: { userId },
    //   });

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charge",
        },
        unit_amount: 250, // 2.5 USD
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/verify?success=true&orderId=${newOrder.id}`,
      cancel_url: `${process.env.CLIENT_URL}/verify?success=false&orderId=${newOrder.id}`,
    });

    //   console.log("Stripe session created:", session);
    // console.log(session.url);

    res.status(201).json({
      message: "Order placed successfully",
      success: true,
      session_url: session.url,
      order: newOrder,
    });
  } catch (error) {
    console.error("Error in placeOrder:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyOrder = async (req, res) => {
  try {
    const { orderId, success } = req.query;

    // console.log("Order verification data:", orderId, success);

    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID is required" });
    }

    // Ensure success is a string and compare correctly
    if (success == "true") {
      await prisma.Order.update({
        where: { id: orderId },
        data: { paymentStatus: true }, // Ensure status is a string if defined as such
      });
      res.json({ success: true, message: "Order verified successfully" });
    } else {
      const orderToDelete = await prisma.Order.findUnique({
        where: { id: orderId },
      });

      if (orderToDelete) {
        await prisma.Order.delete({
          where: { id: orderId },
        });
        res.json({ success: false, message: "Order Payment failed and order deleted" });
      } else {
        res.json({ success: false, message: "Order not found, nothing to delete" });
      }
    }
  } catch (error) {
    console.error("Error in verifyOrder:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// User's Orders for frontEnd

const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await prisma.Order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            food: true,
          },
        },
        address: true,
      },
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found for this user" });
    }

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error in userOrders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Listing order for admin

const listOrders = async (req, res) => {

  try{
    const orders = await prisma.Order.findMany({
      include: {
        items: {
          include: {
            food: true,
          },
        },
        address: true,
        user: true,
      },
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error in listOrders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Update order status

const UpdateStatus = async (req, res) => {

  try{
    
    const { orderId, status } = req.body;

    await prisma.Order.update({
      where: { id: orderId },
      data: { status: status },
    });

    res.json({ success: true, message: "Order status updated successfully"});


  } catch (error){
    console.error("Error in UpdateStatus:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }


}



export { placeOrder, verifyOrder, userOrders, listOrders, UpdateStatus };
