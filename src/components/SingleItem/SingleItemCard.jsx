import React from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import "./SingleItemCard.css";
import { VscArrowRight } from "react-icons/vsc";
import { collection,addDoc , getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { db } from "../../libs/firebase";
import Cart from "../Cart/Cart";

const SingleItemPage = () => {
  const { name } = useParams();
  const { state } = useLocation();
  const navigate=useNavigate();
window.scroll(0,0)


const handleAddToCart = async () => {
  try {
    const cartRef = collection(db, "cart");

 
    const q = query(cartRef, where("catid", "==", state.catid)); // you can replace "name" with a unique "id" field
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // Item exists, update quantity
      const existingDoc = snapshot.docs[0];
      const existingData = existingDoc.data();
      const newQty = (existingData.quantity || 1) + 1;

      await updateDoc(doc(db, "cart", existingDoc.id), {
        quantity: newQty,
      });

      alert(`${state.name} quantity updated in cart.`);
    } else {
      // Item not found, add new with quantity 1
      await addDoc(cartRef, {
        ...state,
        quantity: 1,
      });

      alert(`${state.name} added to cart.`);
    }

    navigate("/cart");
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("Failed to add item. Please try again.");
  }
};

 const handleBuyNow = () => {
    alert(`Buying ${state.name}...`);
    
  };

  if (!state) {
    return <h2>No item data available</h2>;
  }

  return (
    <div className="single-item">
      <div className="singleItem-image">
        <img className="single-image" src={`/${state.img}`} alt={state.name} />
        <br />

        <div className="btns"> 
          <button  className="item-btn1" onClick={handleBuyNow }>Buy Now</button>
          <button onClick={handleAddToCart} className="item-btn2">Add to Cart</button>
        </div>
      </div>

      <div className="context">
        <h3>{state.name} ({state.catid} {state.color})</h3>
        <h2>₹{(state.price).toLocaleString("en-IN")}</h2>

        <h4>Available Offers</h4>
        <p>
          <VscArrowRight /> Flat 8% Off of on Order of ₹1,00,000 or Above
        </p>
        <p>
          <VscArrowRight /> Free dilivery of order above ₹50,000
        </p>
        <p>
          <VscArrowRight /> On Order Above 80,000 get 2 chair Free
        </p>
      </div>
    </div>
  );
};

export default SingleItemPage;
