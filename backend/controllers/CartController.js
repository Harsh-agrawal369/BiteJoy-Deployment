import prisma from "../prisma/index.js";

const addToCart = async (req, res) => {
    try {
        const { userId, ItemId } = req.body;  // ItemId is the foodId

        if (!ItemId) {
            return res.status(400).json({ success: false, message: "ItemId (foodId) is required" });
        }

        // Find the user
        const user = await prisma.userModel.findUnique({
            where: { id: userId },
            include: { cart: { include: { items: true } } }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Find or create cart for the user
        let cart = user.cart[0]; // Assuming a user has only one cart
        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId: userId
                },
                include: { items: true } // Include items in the created cart
            });

            // Re-fetch the cart with items to include the new empty cart
            cart = await prisma.cart.findUnique({
                where: { id: cart.id },
                include: { items: true }
            });
        }

        // Check if the item is already in the cart
        const existingCartItem = cart.items.find(item => item.foodId === ItemId);

        if (existingCartItem) {
            // If the item exists, update its quantity
            await prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + 1 }
            });
        } else {
            // If the item does not exist, create a new cart item
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    foodId: ItemId,
                    quantity: 1
                }
            });
        }

        return res.status(200).json({ success: true, message: "Item added to cart" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const removeFromCart = async (req, res) => {
    try {
        const { userId, ItemId } = req.body;  // ItemId is the foodId

        // Find the user
        const user = await prisma.userModel.findUnique({
            where: { id: userId },
            include: { cart: { include: { items: true } } }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cart = user.cart[0]; // Assuming a user has only one cart

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        // Find the cart item
        let cartItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, foodId: ItemId }
        });

        if (!cartItem) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        if (cartItem.quantity > 1) {
            // Decrease the quantity
            await prisma.cartItem.update({
                where: { id: cartItem.id },
                data: { quantity: cartItem.quantity - 1 }
            });
        } else {
            // Remove the item from the cart
            await prisma.cartItem.delete({
                where: { id: cartItem.id }
            });
        }

        return res.status(200).json({ success: true, message: "Item removed from cart" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// Example implementation of the cart retrieval endpoint
const getCart = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await prisma.userModel.findUnique({
            where: { id: userId },
            include: { cart: { include: { items: { include: { food: true } } } } }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cart = user.cart[0]; // Assuming a user has only one cart

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        return res.status(200).json({ success: true, cart: cart.items });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}


export { addToCart, removeFromCart, getCart }
