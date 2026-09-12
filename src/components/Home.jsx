import { useState } from "react";
import { EmployeesTable, Employees, RegisterEmployee } from "./Employees";
import { ServiceTable, ViewService, RegisterService } from "./Services";
import { Dashboard } from "./Dashboard";
import "../css/home.css";
import { Profile } from "./Porfile";
import { useNavigate } from "react-router-dom";

function SideBar({ setActivePage, activePage, isOpen, closeMenu }) {
  const handlePageSelect = (page) => {
    setActivePage(page);
    closeMenu(); // Close sidebar on mobile after selecting an option
  };

  return (
    <>
      {/* Overlay to close mobile sidebar when clicking outside */}
      {isOpen && <div className="sidebar-overlay" onClick={closeMenu}></div>}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button
          className={activePage === "profile" ? "active" : ""}
          onClick={() => handlePageSelect("profile")}
        >
          Profili
        </button>

        <button
          className={activePage === "dashboard" ? "active" : ""}
          onClick={() => handlePageSelect("dashboard")}
        >
          Raportet financiare
        </button>

        <button
          className={activePage === "employees" ? "active" : ""}
          onClick={() => handlePageSelect("employees")}
        >
          Stafi
        </button>

        <button
          className={activePage === "services" ? "active" : ""}
          onClick={() => handlePageSelect("services")}
        >
          Shërbimet
        </button>
      </div>
    </>
  );
}

function TopBar({ onToggleMenu, isMenuOpen }) {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    const confirmLogout = window.confirm("Dëshironi të dilni?");
    if (!confirmLogout) return;

    try {
      const API = process.env.REACT_APP_DELETE_REFRESH_TOKEN;

      const rest = await fetch(API, {
        method: "POST",
        credentials: "include",
      });

      if (rest.ok) {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("userDetails");
        navigate("/");
      }
    } catch (err) {
      alert("Couldn't reach server!");
    }
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        {/* Hamburger Menu Toggle Button */}
        <button className="menu-toggle-btn" onClick={onToggleMenu} aria-label="Toggle Navigation">
          {isMenuOpen ? "✕" : "☰"}
        </button>
        <div className="topbar-title">Paneli i administratorit</div>
      </div>

      <button className="logout-btn" onClick={handleLogOut}>
        Dilni
      </button>
    </div>
  );
}

function Home() {
  const [activePage, setActivePage] = useState("profile");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleSelectEmployee = (emp) => {
    setSelectedEmployee(emp);
    setActivePage("employeeProfile");
  };

  const handleDeletedEmployee = () => {
    setActivePage("employees");
  };

  const handleSelectedService = (service) => {
    setSelectedService(service);
    setActivePage("service");
  };

  const handleRegisteredOrDeletedService = () => {
    setActivePage("services");
  };

  function renderPage() {
    switch (activePage) {
      case "profile":
        return <Profile />;

      case "dashboard":
        return <Dashboard />;

      case "employees":
        return (
          <EmployeesTable
            onSelect={handleSelectEmployee}
            onRegister={() => setActivePage("employeeRegister")}
          />
        );

      case "employeeProfile":
        return selectedEmployee ? (
          <Employees emp={selectedEmployee} onDelete={handleDeletedEmployee} />
        ) : (
          <h2>No employee selected</h2>
        );

      case "employeeRegister":
        return <RegisterEmployee />;

      case "services":
        return (
          <ServiceTable
            onSelect={handleSelectedService}
            onRegister={() => setActivePage("registerService")}
          />
        );

      case "service":
        return (
          <ViewService
            service={selectedService}
            onDelete={handleRegisteredOrDeletedService}
          />
        );

      case "registerService":
        return (
          <RegisterService onRegister={handleRegisteredOrDeletedService} />
        );

      default:
        return <h2>Page not found</h2>;
    }
  }

  return (
    <div>
      <TopBar onToggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />

      <div className="layout">
        <SideBar
          setActivePage={setActivePage}
          activePage={activePage}
          isOpen={isMenuOpen}
          closeMenu={closeMenu}
        />

        <div className="center-content">{renderPage()}</div>
      </div>
    </div>
  );
}

export default Home;