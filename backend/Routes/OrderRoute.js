import express from 'express';
import {authMiddleware} from '../middleware/AuthMiddleware.js';
import { placeOrder, verifyOrder, userOrders, listOrders, UpdateStatus } from '../controllers/OrderController.js';

const OrderRouter = express.Router();


OrderRouter.post('/place', authMiddleware, placeOrder);
OrderRouter.post('/verify', verifyOrder);
OrderRouter.post('/userOrders', authMiddleware, userOrders);
OrderRouter.get('/listOrders', listOrders);
OrderRouter.post('/updateStatus', UpdateStatus);


export default OrderRouter;