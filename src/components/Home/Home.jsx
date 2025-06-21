import React from "react";
import "./Home.css";
import SingleItemPage from "../SingleItem/SingleItemCard";
import { matchPath, useNavigate } from "react-router-dom";



function Home() {

  const categories =[
        { name: "Sofas",catid:"C10", img: "sofa_img.jpg" ,color:"Soft White" , price:"₹30,000"},
        { name: "Beds",catid:"F12", img: "bed_img.webp" ,color:"Light Black", price:"₹45,000"},
       { name: "Dining Tables",catid:"C11", img: "dining_table.jpg" ,color:"Light Wooden", price:"₹20,000"},
  ]
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Maruti Furniture</h1>
        <p>Crafting Comfort, Delivering Style</p>
        <button className="hero-button" onClick={() => navigate("/products")}>
          Explore Products
        </button>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <h2>Our Popular Categories</h2>
        <div className="category-grid">
        {categories.map((cat,i)=>
        <div key={i} className="category-card" onClick={()=>navigate(`/products/${cat.name}`,{
          state:{
            name:cat.name,
            img:cat.img,
            color:cat.color,
            catid:cat.catid,
            price:cat.price
          },
        })}>
              <img src={cat.img} alt={cat.name} />
              <h3>{cat.name}</h3>
              
            </div>
      
          )}
        </div>
      </section>
  

      {/* Call to Action */}
      <section className="cta">
        <h2>Visit Our Showroom Today!</h2>
        <p>See our collection live at Maruti Furniture Store</p>
        <button onClick={()=>window.open("https://maps.app.goo.gl/kpcfXLsf3TcmB7cu5","_blank")} className="cta-button">Get Directions</button>
        
      </section>
      
    </div>
    
  );
}

export default Home;
