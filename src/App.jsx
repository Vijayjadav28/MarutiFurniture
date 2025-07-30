import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext"; 
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"; 


import Home from "./components/Home/Home";
import Product from "./components/Products/Product";
import About from "./components/About/About";
import Footer from "./components/Footer/Footer";
import Contact from "./components/Contact/Contact";
import Navbar from "./components/Navbar/Navbar";
import SingleItemCard from "./components/SingleItem/SingleItemCard";
import Cart from "./components/Cart/Cart";
import Signin from "./components/Authentication/Signin/Signin";
import Signup from "./components/Authentication/Signup/Signup";
import ResetPassword from "./components/Authentication/ForgetPassword/ResetPassword";
import Profile from "./components/Profile/Profile";
import './App.css'

function App() {
  return (
   
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
        
          <Route path="/" element={<Home />} /> 
          <Route path="/products" element={<Product />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products/:itemName" element={<SingleItemCard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          
          {/*Protected Route Profile */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;