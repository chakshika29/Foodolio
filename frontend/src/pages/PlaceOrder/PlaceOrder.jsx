import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import PaymentModal from '../../components/PaymentModal/PaymentModal';

const PlaceOrder = () => {

    const [payment, setPayment] = useState("online")
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    })

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems,currency,deliveryCharge } = useContext(StoreContext);

    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const placeOrder = async (e) => {
        e.preventDefault()
        let orderItems = [];
        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item, quantity: cartItems[item._id] };
                orderItems.push(itemInfo)
            }
        })

        if (orderItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + deliveryCharge,
        }

        if (payment === "online") {
            setShowPaymentModal(true);
            return;
        }

        try {
            if (payment === "stripe") {
                let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
                if (response.data && response.data.success) {
                    const { session_url } = response.data;
                    window.location.replace(session_url);
                }
                else {
                    toast.error(response.data?.message || "Stripe payment initiation failed")
                }
            }
            else {
                let response = await axios.post(url + "/api/order/placecod", orderData, { headers: { token } });
                if (response.data && response.data.success) {
                    navigate("/myorders")
                    toast.success(response.data.message || "Order Placed Successfully")
                    setCartItems({});
                }
                else {
                    toast.error(response.data?.message || "Order placement failed")
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Network error placing order");
        }
    }

    const handleOnlinePaymentSuccess = async (paymentMethodName, txnId) => {
        let orderItems = [];
        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item, quantity: cartItems[item._id] };
                orderItems.push(itemInfo);
            }
        });

        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + deliveryCharge,
            paymentMethod: paymentMethodName,
            transactionId: txnId
        };

        try {
            let response = await axios.post(url + "/api/order/placeonline", orderData, { headers: { token } });
            setShowPaymentModal(false);
            if (response.data && response.data.success) {
                setCartItems({});
                toast.success(response.data.message || "Payment Successful & Order Placed!");
                navigate("/myorders");
            } else {
                toast.error(response.data?.message || "Payment recorded but order creation failed");
            }
        } catch (error) {
            setShowPaymentModal(false);
            toast.error(error.response?.data?.message || error.message || "Error finalizing online order");
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error("to place an order sign in first")
            navigate('/cart')
        }
        else if (getTotalCartAmount() === 0) {
            navigate('/cart')
        }
    }, [token])

    return (
        <>
            <form onSubmit={placeOrder} className='place-order'>
                <div className="place-order-left">
                    <p className='title'>Delivery Information</p>
                    <div className="multi-field">
                        <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required />
                        <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' required />
                    </div>
                    <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' required />
                    <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' required />
                    <div className="multi-field">
                        <input type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='City' required />
                        <input type="text" name='state' onChange={onChangeHandler} value={data.state} placeholder='State' required />
                    </div>
                    <div className="multi-field">
                        <input type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' required />
                        <input type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' required />
                    </div>
                    <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required />
                </div>
                <div className="place-order-right">
                    <div className="cart-total">
                        <h2>Cart Totals</h2>
                        <div>
                            <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div>
                            <hr />
                            <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</p></div>
                            <hr />
                            <div className="cart-total-details"><b>Total</b><b>{currency}{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryCharge}</b></div>
                        </div>
                    </div>
                    <div className="payment">
                        <h2>Payment Method</h2>
                        <div onClick={() => setPayment("online")} className={`payment-option ${payment === "online" ? "active" : ""}`}>
                            <img src={payment === "online" ? assets.checked : assets.un_checked} alt="" />
                            <div>
                                <p className="option-title">Online Payment (Cards, UPI, NetBanking)</p>
                                <small className="option-desc">Instant online payment with card, GPay, PhonePe, Paytm</small>
                            </div>
                        </div>
                        <div onClick={() => setPayment("cod")} className={`payment-option ${payment === "cod" ? "active" : ""}`}>
                            <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
                            <div>
                                <p className="option-title">COD (Cash on delivery)</p>
                                <small className="option-desc">Pay cash when food arrives</small>
                            </div>
                        </div>
                        <div onClick={() => setPayment("stripe")} className={`payment-option ${payment === "stripe" ? "active" : ""}`}>
                            <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
                            <div>
                                <p className="option-title">Stripe Gateway</p>
                                <small className="option-desc">International Card Checkout</small>
                            </div>
                        </div>
                    </div>
                    <button className='place-order-submit' type='submit'>
                        {payment === "cod" ? "Place Order" : "Proceed To Payment"}
                    </button>
                </div>
            </form>

            {showPaymentModal && (
                <PaymentModal 
                    amount={getTotalCartAmount() + deliveryCharge}
                    currency={currency}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={handleOnlinePaymentSuccess}
                />
            )}
        </>
    )
}

export default PlaceOrder
