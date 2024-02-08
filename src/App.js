import './App.css';
import Home from "./views/Home"
import Sand from './views/Sand'
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sand" element={<Sand />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
