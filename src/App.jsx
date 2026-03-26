import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext"; 
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"; 

import { ToastContainer, toast } from "react-toastify";
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
import AdminPanel from "./components/Admin/AdminPanel";
import AdminLogin from "./components/Admin/AdminLogin";
import UserList from "./components/Admin/UserList";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AddProduct from "./components/Admin/AddProduct";
import AdminProductList from "./components/Admin/AdminProductList";
import EditProduct from "./components/Admin/EditProduct";

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
          <Route path="/profile/admin" element={<AdminLogin />} />
          <Route path="/profile/admin/admindashboard" element={<AdminDashboard />} />
          <Route path="/profile/admin/add-product" element={<AddProduct />} />
          <Route path="profile/admin/userlist" element={<UserList />} />
          <Route path="/profile/admin/products" element={<AdminProductList />} />
          <Route path="/profile/admin/edit-product/:id" element={<EditProduct />} />
          
          
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