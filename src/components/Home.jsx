import { useState } from "react";
import { EmployeesTable, Employees, RegisterEmployee } from "./Employees";
import { ServiceTable, ViewService, RegisterService } from "./Services";
import { Dashboard } from "./Dashboard";
import '../css/home.css';
import { Profile } from "./Porfile";
import { useNavigate } from "react-router-dom";

function SideBar({ setActivePage, activePage }) {
  return (
    <div className="sidebar">

      <button
        className={activePage === "profile" ? "active" : ""}
        onClick={() => setActivePage("profile")}
      >
        Profili
      </button>

      <button
        className={activePage === "dashboard" ? "active" : ""}
        onClick={() => setActivePage("dashboard")}
      >
        Dashboard
      </button>

      <button
        className={activePage === "employees" ? "active" : ""}
        onClick={() => setActivePage("employees")}
      >
        Stafi
      </button>

      <button
        className={activePage === "services" ? "active" : ""}
        onClick={() => setActivePage("services")}
      >
        Sherbimet
      </button>

    </div>
  );
}

function TopBar() {

    const navigate = useNavigate();

    const handleLogOut = async () => {

        const confirmLogout = window.confirm("Are you sure you want to log out?");
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

            <div className="topbar-title">
                Admin Panel
            </div>

            <div className="topbar-actions">
                <button className="logout-btn" onClick={handleLogOut}>
                    Logout
                </button>
            </div>

        </div>
    );
}

function Home() {
  const [activePage, setActivePage] = useState("profile");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const handleSelectEmployee = (emp) => {
    setSelectedEmployee(emp);
    setActivePage("employeeProfile");
  };

  const handleSelectedService = (service) => {
    setSelectedService(service);
    setActivePage("service");
  };

  function renderPage() {
    switch (activePage) {

      case "profile":
        return <Profile />;

      case "dashboard":
        return <Dashboard/>;

      case "employees":
        return (
          <EmployeesTable
            onSelect={handleSelectEmployee}
            onRegister={() => setActivePage("employeeRegister")}
          />
        );

      case "employeeProfile":
        return selectedEmployee ? (
          <Employees emp={selectedEmployee} />
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
        return <ViewService service={selectedService} />;

      case "registerService":
        return <RegisterService />;

      default:
        return <h2>Page not found</h2>;
    }
  }

  return (
    <div>

      <TopBar />

      <div className="layout">

        <SideBar setActivePage={setActivePage} />

        <div className="center-content">
          {renderPage()}
        </div>

      </div>

    </div>
  );
}

export default Home; 