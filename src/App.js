import Produk from './pages/Produk';
import Login from './pages/Login';
import {
  BrowserRouter,
  Routes, 
  Route,
} from "react-router-dom";

const App = () => {
  return(
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Produk />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
