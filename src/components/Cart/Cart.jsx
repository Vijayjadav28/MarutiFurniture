import React, { useEffect, useState } from "react";
import { collection,getDocs, deleteDoc, doc  } from "firebase/firestore";
import { db } from "../../libs/firebase";
import "./Cart.css"


function Cart(){

const [cartItems, setCartItems] = useState([]);
const fetchCart = async () => {
    const snapshot = await getDocs(collection(db, "cart"));
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCartItems(items);
  };
    const handleBuyNow = () => {
    alert(`Buying ${state.name}...`);
    // Optional: navigate("/checkout", { state: state });
  };

  const handleRemove = async (id) => {
    await deleteDoc(doc(db, "cart", id));
    fetchCart();
  };

 

  useEffect(() => {
    fetchCart();
  }, []);

return(
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-card" key={item.id}>
              <img className="cart-image" src={`/${item.img}`} alt={item.name} />
              <div className="cart-info">
                <h3>{item.name}</h3>
                <p>Price: {item.price}</p>

                <button className="btn1" onClick={()=>handleBuyNow}>
                Buy
                </button>

                <button className="btn2"
                  onClick={() => handleRemove(item.id)}
                  
                >
                  Remove
                </button>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
)



}
export default Cart;
