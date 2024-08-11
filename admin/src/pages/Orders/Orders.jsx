import React, { useState, useEffect } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Orders = ({ API_URL }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/order/listOrders`);

      if (!response.data.success) {
        toast.error("No orders found");
        return;
      } else {
        setOrders(response.data.orders); // Corrected this line
        // console.log("Orders:", response.data.orders);
      }
    } catch (error) {
      toast.error("Error fetching orders");
      console.error("Error fetching orders:", error);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${API_URL}/api/order/updateStatus`, {
        orderId: orderId,
        status: event.target.value,
      });

      if (!response.data.success) {
        toast.error("Error updating status");
        return;
      } else {
        toast.success("Status updated successfully");
        fetchOrders();
      }
    } catch {
      toast.error("Error updating status");
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="Parcel Icon" />

            <div>
              <p className="order-item-food">
                {order.items.map((item, idx) => (
                  <span key={item.id}>
                    {item.food.name} x {item.quantity}
                    {idx < order.items.length - 1 && ", "}
                  </span>
                ))}
              </p>
              <p className="order-item-name">
                {order.address.firstName} {order.address.lastName}
              </p>

              <div className="order-item-address">
                <p>{order.address.street + ","}</p>
                <p>
                  {order.address.city}, {order.address.state},{" "}
                  {order.address.country} {"-" + order.address.pinCode}
                </p>
              </div>

              <p className="order-item-phone">{order.address.contactNumber}</p>
            </div>
            <p className="NoOfItems">Items: {order.items.length}</p>

            <p>Total Amount: ${order.totalAmount}.00</p>

            <select
              onChange={(event) => statusHandler(event, order.id)}
              value={order.status}
            >
              <option value="Food Processing">Food Processing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Order Delivered">Order Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
