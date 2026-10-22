import React, { useEffect, useState } from 'react'
import './Orders.css'
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';

const Order = () => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`)
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setOrders([...response.data.data].reverse());
      }
      else {
        toast.error(response.data?.message || "Failed to load orders")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Network error loading orders");
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value
      })
      if (response.data && response.data.success) {
        toast.success(response.data.message || "Status updated");
        await fetchAllOrders();
      } else {
        toast.error(response.data?.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Network error updating status");
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [])

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.length === 0 ? <p>No orders yet.</p> : orders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {(order.items || []).map((item, index) => {
                  if (index === (order.items || []).length - 1) {
                    return item.name + " x " + item.quantity
                  }
                  else {
                    return item.name + " x " + item.quantity + ", "
                  }
                })}
              </p>
              <p className='order-item-name'>{(order.address?.firstName || "") + " " + (order.address?.lastName || "")}</p>
              <div className='order-item-address'>
                <p>{(order.address?.street || "") + ","}</p>
                <p>{(order.address?.city || "") + ", " + (order.address?.state || "") + ", " + (order.address?.country || "") + ", " + (order.address?.zipcode || "")}</p>
              </div>
              <p className='order-item-phone'>{order.address?.phone || ""}</p>
            </div>
            <p>Items : {(order.items || []).length}</p>
            <p>{currency}{order.amount}</p>
            <select onChange={(e) => statusHandler(e, order._id)} value={order.status} name="" id="">
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Order
