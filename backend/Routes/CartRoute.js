import express from "express";
import { addToCart, removeFromCart, getCart } from "../controllers/CartController.js";

//what's the import error here
// error is in Auth middleware
import {authMiddleware} from "../middleware/AuthMiddleware.js";

const cartRouter = express.Router();




// Post API Endpoints

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/remove", authMiddleware, removeFromCart); 
cartRouter.post("/get", authMiddleware, getCart);


export default cartRouter;