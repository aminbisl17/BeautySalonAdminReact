import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchEmployees,
  updateEmployee,
  registerEmployee,
  deleteEmployee,
} from "../javascript/API/EmployeesAPI";
import { ExceptionHandler } from "../javascript/Exceptions/ExceptionHandler";
import "../css/tables.css";
/* =======================================================
   EMPLOYEE PROFILE
======================================================= */
export function Employees({ emp }) {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(emp?.emri || "");
  const [lastName, setLastName] = useState(emp?.mbiemri || "");
  const [username, setUsername] = useState(emp?.username || "");
  const [email, setEmail] = useState(emp?.email || "");
  const [phone, setPhone] = useState(emp?.numri_telefonit || "");
  const [gender, setGender] = useState(emp?.gjinia || "Mashkull");
  const [userpassword, setUserpassword] = useState(emp?.userpassword || "");
  const [status, setStatus] = useState(emp?.is_active ? "true" : "false");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (emp) {
      setFirstName(emp.emri);
      setLastName(emp.mbiemri);
      setUsername(emp.username);
      setEmail(emp.email);
      setPhone(emp.numri_telefonit);
      setGender(emp.gjinia);
      setStatus(emp.is_active ? "true" : "false");
      setUserpassword(emp.userpassword);
    }
  }, [emp]);

  if (!emp) return <div className="container-xl py-4">No employee selected</div>;

  const deleteEmp = async () => {
    if (!window.confirm("Delete this employee?")) return;

    try {
      await deleteEmployee(emp.ID);
      alert("Employee deleted");
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
      username,
      userpassword,
      email,
      numri_telefonit: phone,
      gjinia: gender,
      is_active: status === "true",
    };

    try {
      await updateEmployee(emp.ID, updatedEmp);
      alert("Employee updated successfully!");
    } catch (err) {
      ExceptionHandler.handle(err);
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="w-100">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h3 className="fw-bold mb-1">Employee Profile</h3>
          <small className="text-muted">Manage employee details</small>
        </div>

<div className="d-flex gap-2">
            <button
                    className="btn btn-sm btn-primary w-auto px-3"
                    onClick={save}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>

        <button className="btn btn-sm btn-outline-danger w-auto px-3" onClick={deleteEmp}>
          Delete
        </button>
      </div></div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <div className="row g-4">
            {/* LEFT */}
            <div className="col-md-4 border-end text-center">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: 90, height: 90, fontSize: 34 }}
              >
                👤
              </div>

              <input
                className="form-control rounded-3 mb-2"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />

              <input
                className="form-control rounded-3 mb-2"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />

              <input
                className="form-control rounded-3"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* RIGHT */}
            <div className="col-md-8">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control rounded-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-control rounded-3"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Password</label>
                  <input
                    className="form-control rounded-3"
                    value={userpassword}
                    onChange={(e) => setUserpassword(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select rounded-3"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Mashkull">Male</option>
                    <option value="Femër">Female</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select rounded-3"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Employee ID</label>
                  <input
                    className="form-control rounded-3"
                    value={emp.ID}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =======================================================
   EMPLOYEES TABLE
======================================================= */
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
  <div className="page">

    <div className="page-header">
      <div>
        <h4 className="mb-0 fw-bold">Stafi</h4>
        <small className="text-muted">
         Menaxho llogaritë dhe lejet e stafit
        </small>
      </div>

      
<div className="d-flex gap-2">
            <button
                    className="btn btn-sm btn-primary w-auto px-3"
        onClick={onRegister}
      >
        + Add Employee
      </button>
    </div>
</div>

    <div className="table-wrapper">

      <table className="custom-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Emri & Mbiemri</th>
            <th>Emri i përdoruesit</th>
            <th>Email</th>
            <th>Numri i telefonit</th>
            <th>Gjendja</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.ID} onClick={() => onSelect(emp)}>

              <td>#{emp.ID}</td>

              <td>
                <b>{emp.emri} {emp.mbiemri}</b>
              </td>

              <td className="text-muted">@{emp.username}</td>

              <td>{emp.email}</td>

              <td>{emp.numri_telefonit}</td>

              <td>
                <span
                  className={`badge ${
                    emp.is_active ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {emp.is_active ? "Active" : "Inactive"}
                </span>
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>

  </div>
);
}

/* =======================================================
   REGISTER EMPLOYEE
======================================================= */
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
        username: formData.get("username"),
        email: formData.get("email"),
        numri_telefonit: formData.get("numri_telefonit"),
        gjinia: formData.get("gjinia"),
        userpassword: formData.get("userpassword"),
        pershkrimi: formData.get("pershkrimi"),
      };

      await registerEmployee(data);
      alert("Employee created!");
      e.target.reset();
    } catch (err) {
      ExceptionHandler.handle(err);
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="w-100">
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Register Employee</h3>
        <small className="text-muted">Create a new employee account</small>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input className="form-control rounded-3" name="emri" required />
              </div>

              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input
                  className="form-control rounded-3"
                  name="mbiemri"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Username</label>
                <input
                  className="form-control rounded-3"
                  name="username"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  className="form-control rounded-3"
                  type="email"
                  name="email"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input
                  className="form-control rounded-3"
                  name="numri_telefonit"
                  type="tel"
                  pattern="^\+?[0-9]{8,15}$"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Password</label>
                <input
                  className="form-control rounded-3"
                  name="userpassword"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Gender</label>
                <select
                  className="form-select rounded-3"
                  name="gjinia"
                >
                  <option value="Mashkull">Male</option>
                  <option value="Femër">Female</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control rounded-3"
                  rows="3"
                  name="pershkrimi"
                ></textarea>
              </div>

              <div className="col-12 text-end mt-3">
                <button
                  className="btn btn-primary rounded-pill px-4"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Employee"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}