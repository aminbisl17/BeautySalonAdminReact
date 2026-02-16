import { useState } from "react";
import { EmployeesTable, Employees, RegisterEmployee } from "./Employees";
import '../css/home.css';
import { Profile } from "./Porfile";


function SideBar({ setActivePage }) {
  return (
    <div>
      <div className="mobile-menu-btn">☰</div>

      <div className="sidebar">

        <button onClick={() => setActivePage("profile")}>
          <span className="icon">👤</span>
          <span className="text">Profili</span>
        </button>

        <button onClick={() => setActivePage("dashboard")}>
          <span className="icon">📊</span>
          <span className="text">Dashboard</span>
        </button>

        <button onClick={() => setActivePage("employees")}>
          <span className="icon">🏠</span>
          <span className="text">Stafi</span>
        </button>

        <button onClick={() => setActivePage("services")}>
          <span className="icon">🔧</span>
          <span className="text">Sherbimet</span>
        </button>

      </div>
    </div>
  );
}

function Home() {
  const [activePage, setActivePage] = useState("profile");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleSelectEmployee = (emp) => {
    setSelectedEmployee(emp);
    setActivePage("employeeProfile"); // switch page to profile
  };

  const renderContent = () => {
    switch (activePage) {

      case "profile":
       return <Profile/>
      case "dashboard":
        return <h2>Dashboard Page</h2>;

      case "employees":
        return (
          <EmployeesTable
            onSelect={handleSelectEmployee} // when row clicked
            onRegister={() => setActivePage("employeeRegister")}
          />
        );

      case "employeeProfile":
        return <Employees emp={selectedEmployee} />; 

        case "employeeRegister":
          return <RegisterEmployee/>

      case "services":
        return <h2>Sherbimet Page</h2>;

      default:
        return <h2>Dashboard Page</h2>;
    }
  };

  return (
    <div className="layout">
      <SideBar setActivePage={setActivePage} />
      <div className="center-content">{renderContent()}</div>
    </div>
  );
}

export default Home; 