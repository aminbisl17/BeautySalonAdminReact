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
    if (!window.confirm("Fshi këtë punonjës?")) return;

    try {
      await deleteEmployee(emp.ID);
      alert("Punonjësi u fshi!");
      navigate("/", { replace: true });
    } catch (err) {
      ExceptionHandler.handle(err);
    }
  };

  const save = async () => {

    if (!window.confirm("Përditësoni të dhënat?")) return

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
      alert("Të dhënat u përditësuan!");
    } catch (err) {
      ExceptionHandler.handle(err);
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="w-100">

    {/* HEADER */}
    <div className="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h3 className="fw-bold mb-1">{emp.emri}</h3>
        <small className="text-muted">Menaxhoni detajet e punonjësve</small>
      </div>

    <div className="d-flex gap-2">
     <button
  className="btn btn-sm btn-primary w-auto px-3"

  onClick={save}
  disabled={loading}
>
  {loading ? "Duke u përditësuar..." : "Ruaj ndryshimet"}
</button>

<button
   className="btn btn-danger btn-sm w-auto px-3"

  onClick={deleteEmp}
>
  Fshi punonjësin
</button>
      </div>
    </div>

    {/* CARD */}
    <div className="card border-0 shadow-sm rounded-4 p-4">
      <div className="row g-4">

        {/* LEFT SIDEBAR (PROFILE SUMMARY) */}
        <div className="col-md-4 border-end pe-4">

          <div className="text-center">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: 90, height: 90, fontSize: 28, fontWeight: "bold" }}
            >
              {emp.emri?.charAt(0)}
            </div>

            <h5 className="mb-1">{emp.emri}</h5>
            <p className="text-muted mb-3">{email}</p>

            <span className={`badge ${status === "true" ? "bg-success" : "bg-secondary"}`}>
              {status === "true" ? "Aktiv" : "Jo-Aktiv"}
            </span>
          </div>

          <hr className="my-4" />

          <div className="small text-muted">
            <div className="mb-2">
              <strong>ID:</strong> {emp.ID}
            </div>
            <div className="mb-2">
              <strong>Role:</strong> Employee
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (FORM) */}
        <div className="col-md-8">
          <div className="row g-3">

            <div className="col-md-6">
              <label className="form-label">Emri</label>
              <input
                className="form-control rounded-3"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Mbiemri</label>
              <input
                className="form-control rounded-3"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Emri i përdoruesit</label>
              <input
                className="form-control rounded-3"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                className="form-control rounded-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Numri i telefonit</label>
              <input
                className="form-control rounded-3"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Fjalkalimi</label>
              <input
                className="form-control rounded-3"
                value={userpassword}
                onChange={(e) => setUserpassword(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Gjinia</label>
              <select
                className="form-select rounded-3"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Mashkull">Mashkull</option>
                <option value="Femër">Femër</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Gjendja</label>
              <select
                className="form-select rounded-3"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="true">Aktiv</option>
                <option value="false">Jo-Aktiv</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Numri identifikues</label>
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
        + Shto punonjës
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
                  {emp.is_active ? "Aktiv" : "Jo-Aktiv"}
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