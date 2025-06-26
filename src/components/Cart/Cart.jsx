import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../libs/firebase";
import { IoCloseOutline } from "react-icons/io5";
import "./Cart.css";
import { useNavigate } from "react-router-dom";



function Cart() {
  const [cartItems, setCartItems] = useState([]);
const navigate=useNavigate();

useEffect(()=>{
  window.scroll(0,0)  
})
  
  const fetchCart = async () => {
    const snapshot = await getDocs(collection(db, "cart"));
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCartItems(items);
  };

  const handleRemove = async (id) => {
    await deleteDoc(doc(db, "cart", id));
    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button className="cart-shop" onClick={()=>navigate("/products")}>Shop Now</button>

        </div>
      ) : (
        <div className="card-table">
          <table>
            <thead>
              <tr>
                <th>Delete</th>
                <th>Product image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td className="card-delete" >
                    <h2 className="cart-dlt" onClick={() => handleRemove(item.id)}  ><IoCloseOutline /></h2>
                  </td>
                  <td onClick={()=>navigate(`/products/${item.name}`,{state:item})}>
                    <img src={`/${item.img}`} alt={item.name} width="100" height="80px" />
                  </td>
                  <td>{item.name}({item.catid})</td>
                  <td>₹{(item.price).toLocaleString("En-IN")}</td>
                  <td className="qty">{Number(item.quantity)}</td>
                  <td>₹{Number((item.price) * Number(item.quantity)).toLocaleString("En-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Cart;
