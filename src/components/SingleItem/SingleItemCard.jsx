import React from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import "./SingleItemCard.css";
import { VscArrowRight } from "react-icons/vsc";
import { collection,addDoc } from "firebase/firestore";
import { db } from "../../libs/firebase";

const SingleItemPage = () => {
  const { name } = useParams();
  const { state } = useLocation();
  const navigate=useNavigate();
window.scroll(0,0)

const handleAddToCart = async () => {
  try {
    await addDoc(collection(db, "cart"), state); 
    alert(`${state.name} added to  cart!`);
    navigate("/cart");
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};
 const handleBuyNow = () => {
    alert(`Buying ${state.name}...`);
    // Optional: navigate("/checkout", { state: state });
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
        <h2>{state.price}</h2>

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
