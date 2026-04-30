import { useState } from "react";
import { EmployeesTable, Employees, RegisterEmployee } from "./Employees";
import { ServiceTable, ViewService, RegisterService } from "./Services";
import '../css/home.css';
import { Profile } from "./Porfile";

function SideBar({ setActivePage }) {
  return (
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
  );
}

function TopBar({ onLogout }) {
  return (
    <div className="topbar">

      <div className="topbar-title">
        Admin Panel
      </div>

      <div className="topbar-actions">
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

    </div>
  );
}


function Home() {
  const [activePage, setActivePage] = useState("profile");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const[selectedService, setSelectedService] = useState(null);

  const handleSelectEmployee = (emp) => {
    setSelectedEmployee(emp);
    setActivePage("employeeProfile"); // switch page to employee profile
  };

const handleSelectedService = (service) => {
  setSelectedService(service); 
  setActivePage("service");
};
  const pages = {
    profile: <Profile />,
    dashboard: <h2>Dashboard Page</h2>,
    employees: (
      <EmployeesTable
        onSelect={handleSelectEmployee} 
        onRegister={() => setActivePage("employeeRegister")}
      />
    ),
    employeeProfile: selectedEmployee ? (
      <Employees emp={selectedEmployee} />
    ) : (
      <h2>No employee selected</h2>
    ),
    employeeRegister: <RegisterEmployee />,
    services: <ServiceTable onSelect={handleSelectedService} onRegister={()=> setActivePage("registerService")} />,
    service: <ViewService service={selectedService}/>,
    registerService: <RegisterService />
  };

return (
  <div>

    <TopBar onLogout={() => alert("Logged out")} />

    <div className="layout">

      <SideBar setActivePage={setActivePage} />

      <div className="center-content">
        {pages[activePage]}
      </div>

    </div>

  </div>
);

}

export default Home; 