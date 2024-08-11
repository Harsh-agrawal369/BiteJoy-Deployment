import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    food_list,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    API_URL,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Add Item</p>
        </div>
        <br />
        <hr />

        {food_list.map((item) => {
          if (cartItems[item.id] > 0) {
            return (
              <React.Fragment key={item.id}>
                <div className="cart-items-title cart-items-item">
                  <img
                    src={API_URL + "/images/" + item.image}
                    alt={item.name}
                  />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item.id]}</p>
                  <p>${item.price * cartItems[item.id]}</p>
                  <div className="food-item-counter">
                    <img
                      onClick={() => removeFromCart(item.id)}
                      src={assets.remove_icon_red}
                      alt="Remove"
                    />
                    <p>{cartItems[item.id]}</p>
                    <img
                      onClick={() => addToCart(item.id)}
                      src={assets.add_icon_green}
                      alt="Add"
                    />
                  </div>
                  <p onClick={() => removeFromCart(item.id)} className="cross">
                    x
                  </p>
                </div>
                <hr />
              </React.Fragment>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
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

          {getTotalCartAmount() ? (
            <button onClick={() => navigate("/placeorder")}>
              PROCEED TO CHECKOUT
            </button>
          ) : (
            <button>PROCEED TO CHECKOUT</button>
          )}
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a Promocode, Enter it here</p>

            <div className="cart-promocode-input">
              <input type="text" placeholder="Promocode" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
