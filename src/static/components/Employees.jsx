import React, { useState, useEffect } from "react";
import { fetchEmployees } from "../javascript/API/Employees/EmployeesAPI";
import { ExceptionHandler } from "../javascript/Exceptions/ExceptionHandler";

export function Employees({ emp }) {

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


export function EmployeesTable({ onSelect, onRegister }) {


    const [employees, setEmployees] = useState([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (err) {
      ExceptionHandler.handle(err);
    }
  }

  return (

    <div className="employees-container">
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
            <tr key={emp.ID} onClick={() => onSelect && onSelect(emp)}>
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
