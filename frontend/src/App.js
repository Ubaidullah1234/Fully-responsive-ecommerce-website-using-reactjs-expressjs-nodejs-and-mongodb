import React from "react";
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cart from './Pages/Cart';
import Loginsignup from './Pages/Loginsignup';
import Product from './Pages/Product';
import ShopCategory from './Pages/ShopCategory';
import Shopping from './Pages/Shopping';
import Footer from "./Components/Footer/Footer";
import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kid_banner from './Components/Assets/banner_kids.png';
import ShopContextProvider from './Context/ShopContext';

function App() {
  return (
    <div>
      <BrowserRouter>
        <ShopContextProvider>
          <Navbar />
          <Routes>
            <Route path='/' element={<Shopping />} />
            <Route path='/mens' element={<ShopCategory banner={men_banner} category="men" />} />
            <Route path='/womens' element={<ShopCategory banner={women_banner} category="women" />} />
            <Route path='/kids' element={<ShopCategory banner={kid_banner} category="kid" />} />
            <Route path='/product/:productId' element={<Product />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/login' element={<Loginsignup />} />
          </Routes>
          <Footer />
        </ShopContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
