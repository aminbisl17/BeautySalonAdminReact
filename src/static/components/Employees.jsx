import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchEmployees,
  updateEmployee,
  registerEmployee,
  deleteEmployee
} from "../javascript/API/EmployeesAPI";
import { ExceptionHandler } from "../javascript/Exceptions/ExceptionHandler";
export function Employees({ emp }) {

    const navigate = useNavigate();

  const [firstName, setFirstName] = useState(emp?.emri || "");
  const [lastName, setLastName] = useState(emp?.mbiemri || "");
  const [username, setUsername] = useState(emp?.username || "");
  const [email, setEmail] = useState(emp?.email || "");
  const [phone, setPhone] = useState(emp?.numri_telefonit || "");
  const [gender, setGender] = useState(emp?.gjinia || "Mashkull");
  const [status, setStatus] = useState(emp?.is_active ? "true" : "false");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (emp) {
      setFirstName(emp.emri);
      setLastName(emp.mbiemri);
      setEmail(emp.email);
      setUsername(emp.username);
      setPhone(emp.numri_telefonit);
      setGender(emp.gjinia);
      setStatus(emp.is_active ? "true" : "false");
    }
  }, [emp]);

  if (!emp) return <div>No employee selected</div>;

const deleteEmp = async () => {

  const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
  
  if (!confirmDelete) return; 

  try {
    await deleteEmployee(emp.ID);
    alert("Employee Deleted!");
    navigate("/", { replace: true }); 
  } catch (err) {
    ExceptionHandler.handle(err);
  }
};

  const save = async () => {
    setLoading(true);

    const updatedEmp = {
      emri: firstName,
      mbiemri: lastName,
      username: username,
      email,
      numri_telefonit: phone,
      gjinia: gender,
      is_active: status === "true",
    };

    try {
      await updateEmployee(emp.ID, updatedEmp); // call your API
      alert("Employee updated successfully!");
    } catch (err) {
 //     console.error(err);
    //  alert("Failed to update employee.");
    ExceptionHandler.handle(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">👤</div>

        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
        />

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="profile-info">
        <label>
          ID:
          <input type="text" value={emp.ID} readOnly />
        </label>

        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Phone:
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        <label>
          Gender:
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="Mashkull">Male</option>
            <option value="Femër">Female</option>
          </select>
        </label>

        <label>
          Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
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

      <button onClick={save} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
      <button className="delete-btn" onClick={deleteEmp}>Delete</button>
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
          {employees.map((emp) => (
            <tr key={emp.ID} onClick={() => onSelect && onSelect(emp)}>
              <td>{emp.ID}</td>
              <td>
                {emp.emri} {emp.mbiemri}
              </td>
              <td>{emp.username}</td>
              <td>{emp.email}</td>
              <td>{emp.numri_telefonit}</td>
              <td>{emp.gjinia}</td>
              <td>{emp.is_active ? "Active" : "Inactive"}</td>
              <td>
                {emp.data_regjistrimit
                  ? new Date(emp.data_regjistrimit).toLocaleString()
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RegisterEmployee() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);

      const data = {
        emri: formData.get("emri"),
        mbiemri: formData.get("mbiemri"),
        pershkrimi: formData.get("pershkrimi"),
        gjinia: formData.get("gjinia"),
        numri_telefonit: formData.get("numri_telefonit"),
        email: formData.get("email"),
        username: formData.get("username"),
        userpassword: formData.get("userpassword"),
      };

      const message = await registerEmployee(data);
      alert(message);
      e.target.reset();
    } catch (err) {
      console.error(err);
      alert("Failed to register employee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <label>Emri</label>
        <input type="text" name="emri" required />

        <label>Mbiemri</label>
        <input type="text" name="mbiemri" required />

        <label>Pershkrimi</label>
        <textarea name="pershkrimi" />

        <label>Gjinia</label>
        <select name="gjinia" required>
          <option value="Mashkull">Mashkull</option>
          <option value="Femer">Femer</option>
        </select>

        <label>Numri i telefonit</label>
        <input type="text" name="numri_telefonit" required />

        <label>Email</label>
        <input type="email" name="email" required />

        <label>Username</label>
        <input type="text" name="username" required />

        <label>Password</label>
        <input type="password" name="userpassword" required />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
