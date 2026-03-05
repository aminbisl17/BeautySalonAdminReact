import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginView from "./components/Login";
import Home from "./components/Home";

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