import React from 'react';
import ReactDOM from 'react-dom/client';
import Produk from './pages/Produk';
import Login from './pages/Login';
import {
  BrowserRouter,
  Routes, 
  Route,
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Produk />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
