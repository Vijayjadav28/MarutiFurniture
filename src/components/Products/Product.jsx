
import React from "react";
import SingleItemPage from "../SingleItem/SingleItemCard";
import "./Product.css";
import {Navigate, useNavigate } from "react-router-dom";



const productList = [ 
  {
    id: 1,
    prodid:"S54",
    name: "Wooden Sofa",
    image: "sofa2.jpg",
    price: "₹12,999",
    color:"soft blue"
  },
  {
    id: 2,
      prodid:"T34",
    name: "Dining Table Set",
    image: "table2.jpg",
    price: "₹18,499",
    color:"dark black"
  },
  {
    id: 3,
      prodid:"B3",
    name: " Bed",
    image: "bed2.jpg",
    price: "₹25,999",
    color:"soft white"
  },
  {
    id: 4,
      prodid:"C22",
    name: "Office Chair",
    image: "chair3.jpg",
    price: "₹4,999",
    color:"dark black"
  },
  {
    id: 5,
      prodid:"S33",
    name: "Wooden Sofas",
    image: "sofa3.avif",
    price: "₹15,999",
    color:"dark orange"
  },
  {
    id: 6,
      prodid:"C44",
    name: "Wooden Chair",
    image: "chair2.avif",
    price: "₹4,999",
    color:"pure white"
  },
  {
    id: 7,
      prodid:"C44",
    name: "Bed",
    image: "bed1.avif",
    price: "₹39,999",
    color:"light black"
  },
  {
    id: 8,
      prodid:"B12",
    name: " Book Stand",
    image: "bookstand1.jpg",
    price: "₹12,999",
    color:"black-can be modify"
  },
];

function Product() {
  const navigate = useNavigate();
  return (
    <div className="products-container">
      <h2>Our Products</h2>
      <div className="product-grid">
        {productList.map((product) => (
          <div className="product-card" key={product.id} onClick={()=>navigate(`/products/${product.name}}`,{
            state:{
             name:product.name,
            img:product.image,
            color:product.color,
            catid:product.prodid,
            price:product.price
            }
          })} >
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">{product.price}</p>
          </div>
        ))}
      </div>
    
    </div>
  );
}

export default Product;
