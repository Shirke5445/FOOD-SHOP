import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Toaster } from "react-hot-toast";
//import Product from "../../backend/models/product";
import Productdetails from "./components/product/ProductDetails";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./components/User/Profile";
import UpdateProfile from "./components/User/UpdateProfile";
import Cart from "./components/cart/Cart.jsx";
import Shipping from "./components/cart/Shipping.jsx";
import ConfirmOrder from "./components/cart/ConfirmOrder.jsx";
import PaymentMethod from "./components/cart/paymentMethod.jsx";
import ForgotPassword from "./components/auth/ForgotPassword.jsx";
import ResetPassword from "./components/auth/ResetPassword.jsx";
import UpdatePassword from "./components/User/UpdatePassword.jsx";
import MyOrders from "./components/order/MyOrders.jsx";
import OrderDetails from "./components/order/OrderDetails.jsx";
import Invoice from "./components/invoice/Invoice.jsx";
import UploadAvatar from "./components/User/UploadAvatar.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="top-center" />
        <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<Productdetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/password/reset/:token" element={<ResetPassword />} />



            <Route path="/me/profile" element={<protectedRoute><Profile /></protectedRoute>} />
           <Route path="/me/update_profile" element={<protectedRoute><UpdateProfile /></protectedRoute>} />
           <Route path="/me/upload_avatar" element={<protectedRoute><UploadAvatar /></protectedRoute>} />

           <Route path="/me/update_password" element={<protectedRoute><UpdatePassword /></protectedRoute>} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/shipping" element={<protectedRoute><Shipping /></protectedRoute>} />
            <Route path="/confirm_order" element={<protectedRoute><ConfirmOrder /></protectedRoute>} />
            <Route path="/payment_method" element={<protectedRoute><PaymentMethod /></protectedRoute>} />
            <Route path="/me/orders" element={<protectedRoute><MyOrders /></protectedRoute>} />
            <Route path="/me/orders/:id" element={<protectedRoute><OrderDetails /></protectedRoute>} />
            <Route path="/invoice/orders/:id" element={<protectedRoute><Invoice/></protectedRoute>} />


          </Routes>

        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
