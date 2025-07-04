import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Product from "./components/Products/Product";
import About from "./components/About/About";
import Footer from "./components/Footer/Footer";
import Contact from "./components/Contact/Contact";
import Navbar from "./components/Navbar/Navbar";
import SingleItemCard from "./components/SingleItem/SingleItemCard";
import Cart from "./components/Cart/Cart";

import './App.css'
function App() {
  return (
    <>
      <Router>
    <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Product />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products/:itemName" element={<SingleItemCard />} />
          <Route path="/cart" element={<Cart />} />l
         
          
      
        </Routes>
          <Footer />
      </Router>
    </>
  );
}

export default App;
