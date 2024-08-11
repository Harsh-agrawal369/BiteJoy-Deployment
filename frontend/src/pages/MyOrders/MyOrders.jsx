import './MyOrders.css';
import React, { useEffect, useState, useContext } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const [data, setData] = useState([]);
    const { API_URL, token } = useContext(StoreContext);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(
                `${API_URL}/api/order/userOrders`,
                {},
                { headers: { token } }
            );
            console.log("Orders:", response.data);
            setData(response.data.orders);
        } catch (error) {
            console.error("Error in fetching orders:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    useEffect(() => {
        console.log("Updated data:", data);
    }, [data]);

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="container">
                {data.map((order, index) => (
                    <div key={index} className="my-orders-order">
                        <img src={assets.parcel_icon} alt="Parcel Icon" />
                        <p>
                            {order.items.map((item, idx) => (
                                <span key={item.id}>
                                    {item.food.name} x {item.quantity}
                                    {idx < order.items.length - 1 && ", "}
                                </span>
                            ))}
                        </p>
                        <p>
                            Total Amount: ${order.totalAmount}.00
                        </p>
                        <p>
                            Items: {order.items.length}
                        </p>
                        <p>
                            <span className='bullet'>&#x25cf;</span> <b>{order.status}</b>
                        </p>
                        <button onClick={fetchOrders}>Track Order</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;
