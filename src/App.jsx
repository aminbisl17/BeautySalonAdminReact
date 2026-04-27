import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginView from "./components/Login";
import Home from "./components/Home";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;