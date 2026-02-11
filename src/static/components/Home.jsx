import { useState } from "react";
import '../css/home.css';

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
  const [activePage, setActivePage] = useState("dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "profile":
        return <h2>Profili Page</h2>;
      case "dashboard":
        return <h2>Dashboard Page</h2>;
      case "employees":
        return <EmployeesTable />;
      case "services":
        return <h2>Sherbimet Page</h2>;
      default:
        return <h2>Dashboard Page</h2>;
    }
  };

  return (
    <div className="layout">
      <SideBar setActivePage={setActivePage} />
      <div className="center-content">
        {renderContent()}
      </div>
    </div>
  );
}

function Employees({ emp }) {

  if (!emp) return <div>No employee selected</div>;

  return (
    <div>
      <div className="profile-card">

        <div className="profile-header">
          <div className="profile-avatar">👤</div>

          <input
            type="text"
            value={`${emp.emri} ${emp.mbiemri}`}
            readOnly
          />

          <input
            type="text"
            value={emp.username}
            readOnly
          />
        </div>

        <div className="profile-info">

          <label>
            ID:
            <input type="text" value={emp.ID} readOnly />
          </label>

          <label>
            Email:
            <input type="email" value={emp.email} />
          </label>

          <label>
            Phone:
            <input type="text" value={emp.numri_telefonit} />
          </label>

          <label>
            Gender:
            <select value={emp.gjinia}>
              <option value="Mashkull">Male</option>
              <option value="Femër">Female</option>
            </select>
          </label>

          <label>
            Status:
            <select value={emp.is_active ? "true" : "false"}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </label>

          <label>
            Registered:
            <input
              type="text"
              value={new Date(emp.data_regjistrimit).toLocaleString()}
              readOnly
            />
          </label>

        </div>

        <button>Save</button>
        <button className="delete-btn">Delete</button>

      </div>
    </div>
  );
}

const store = {
  employees: [
    {
      ID: 1,
      emri: "Amin",
      mbiemri: "Bislimaj",
      username: "aminb",
      email: "amin@email.com",
      numri_telefonit: "044123456",
      gjinia: "Mashkull",
      is_active: true,
      data_regjistrimit: new Date()
    },
    {
      ID: 2,
      emri: "Ana",
      mbiemri: "Hoxha",
      username: "anah",
      email: "ana@email.com",
      numri_telefonit: "044987654",
      gjinia: "Femër",
      is_active: false,
      data_regjistrimit: new Date()
    }
  ]
};

 function EmployeesTable({ Employees, onRegister }) {
  const [employees, setEmployees] = useState(store.employees);

  return (
    <div>
      <button onClick={onRegister}>Register</button>
      <table className="employees-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Status</th>
            <th>Date Registered</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.ID} onClick={() => <Employees emp={Employees}/>}>
              <td>{emp.ID}</td>
              <td>{emp.emri} {emp.mbiemri}</td>
              <td>{emp.username}</td>
              <td>{emp.email}</td>
              <td>{emp.numri_telefonit}</td>
              <td>{emp.gjinia}</td>
              <td>{emp.is_active ? "Active" : "Inactive"}</td>
              <td>{emp.data_regjistrimit ? new Date(emp.data_regjistrimit).toLocaleString() : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Home; 