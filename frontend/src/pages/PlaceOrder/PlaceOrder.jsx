import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // Ensure useNavigate is correctly imported
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';

const PlaceOrder = () => {
  const { getTotalCartAmount, API_URL, token, food_list, cartItems } =
    useContext(StoreContext);

  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    contactNumber: "",
  });

  const onChangeHandler = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token, getTotalCartAmount()]); // Added getTotalCartAmount() to dependency array

  const placeOrder = async (e) => {
    e.preventDefault();

    let orderItems = food_list
      .filter(item => cartItems[item.id] > 0)
      .map(item => ({
        ...item,
        quantity: cartItems[item.id]
      }));

    let orderData = {
      items: orderItems,
      totalAmount: getTotalCartAmount() + 2.5,
      address: data,
    };

    try {
      console.log("Order data being sent:", orderData);
      console.log("Token:", token);
      const response = await axios.post(`${API_URL}/api/order/place`, orderData, {
        headers: { token },
      });

      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        console.error("Order failed:", response.data.message);  
        toast.error("Could not place order. Internal server error.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Order failed");
    }
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            type="text"
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            placeholder="First Name"
          />
          <input
            type="text"
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            placeholder="Last Name"
          />
        </div>
        <input
          type="email"
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          placeholder="Email Address"
        />
        <input
          type="text"
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            type="text"
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            placeholder="City"
          />
          <input
            type="text"
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            type="text"
            required
            name="pinCode"
            onChange={onChangeHandler}
            value={data.pinCode}
            placeholder="Pin Code"
          />
          <input
            type="text"
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            placeholder="Country"
          />
        </div>
        <input
          type="text"
          required
          name="contactNumber"
          onChange={onChangeHandler}
          value={data.contactNumber}
          placeholder="Contact Number"
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />

            <div className="cart-total-details">
              <p>Delivery fee</p>
              <p>${getTotalCartAmount() ? 2.5 : 0}</p>
            </div>
            <hr />

            <div className="cart-total-details">
              <p>Total Amount</p>
              <p>${getTotalCartAmount() ? getTotalCartAmount() + 2.5 : 0}</p>
            </div>
          </div>

          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>

      <ToastContainer /> {/* Toast container for notifications */}
    </form>
  );
};

export default PlaceOrder;
