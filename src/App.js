import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Components/Login";
import Register from "./Components/Register";
import BuyerMain from "./Components/BuyerMain";
import FarmerMain from "./Components/FarmerMain";
import AdminMain from "./Components/AdminMain";
import Account from "./Components/Account";
import ProdList from "./Components/prodlist"; 
import AddProduct from "./Components/AddProduct";
import Report from "./Components/Report";
import Inventory from "./Components/Inv"; 
import Order from "./Components/Order";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/buyer-main" element={<BuyerMain />} />
        <Route path="/farmer-main" element={<FarmerMain />} />
        <Route path="/admin-main" element={<AdminMain />} />
        <Route path="/account" element={<Account />} /> 
        <Route path="/prodlist" element={<ProdList />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/report" element={<Report />} />  
        <Route path="/inventory" element={<Inventory />} /> 
        <Route path="/order" element={<Order />} /> 
      </Routes>
    </Router>
  );
}

export default App;
