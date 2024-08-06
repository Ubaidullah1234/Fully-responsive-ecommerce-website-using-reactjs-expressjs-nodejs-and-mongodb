import React, { useContext } from "react";
import axios from "axios";
import './CartItems.css';
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from '../Assets/cart_cross_icon.png';

const CartItems = () => {
    const { all_product, cartItems, removeFromCart, getTotalCartAmount } = useContext(ShopContext);

    const handleConfirmOrder = async () => {
        try {
            const token = localStorage.getItem('auth-token'); // or however you're storing the token
            const response = await axios.post(
                'http://localhost:4000/confirmorder', 
                { cartItems, totalAmount: getTotalCartAmount() },
                { headers: { 'auth-token': token } }
            );

            if (response.data.success) {
                alert("Order confirmed!");
                // Optionally clear cart or redirect user
            } else {
                alert("Error confirming order: " + response.data.message);
            }
        } catch (error) {
            console.error("Error confirming order:", error);
            alert("Error confirming order.");
        }
    };

    return (
        <div className="cartitems">
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {all_product.map((e) => {
                const quantity = cartItems[e.id] || 0; // Default to 0 if cartItems[e.id] is undefined
                if (quantity > 0) {
                    return (
                        <div key={e.id}>
                            <div className="cartitems-format cartitems-format-main">
                                <img src={e.image} alt="" className="carticon-product-icon" />
                                <p>{e.name}</p>
                                <p>${e.new_price}</p>
                                <button className="cartitems-quantity">{quantity}</button>
                                <p>${e.new_price * quantity}</p>
                                <img className="cartitems-remove-icon" src={remove_icon} onClick={() => removeFromCart(e.id)} alt="" />
                            </div>
                            <hr />
                        </div>
                    );
                }
                return null;
            })}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Totals</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>${getTotalCartAmount()}</h3>
                        </div>
                        <button onClick={handleConfirmOrder}>CONFIRM ORDER</button>
                    </div>
                </div>
                <div className="cartitems-promocode">
                    <p>If You Have Promocode, Enter It Here</p>
                    <div className="cartitems-promobox">
                        <input type="text" placeholder="promo code" />
                        <button>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItems;
