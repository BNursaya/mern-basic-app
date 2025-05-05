import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Products from './components/Products';
import Register from './components/Register';
import Shop from './components/Shop';
import Cart from './components/Cart';

//import './style.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="*" element={<Login />} />
{/* 
          <Route path="/user-login" element={<Login />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;