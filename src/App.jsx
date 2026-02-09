import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginView from "./static/components/Login";
import SideBar from "./static/components/SideBar";

function App() {
  const handleLoginSuccess = () => {
    console.log("User logged in successfully");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginView onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/home" element={<SideBar />} />
      </Routes>
    </Router>
  );
}

export default App;