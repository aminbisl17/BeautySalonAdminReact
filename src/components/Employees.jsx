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
export function Employees({ emp, onDelete }) {
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
      setFirstName(emp.emri || "");
      setLastName(emp.mbiemri || "");
      setUsername(emp.username || "");
      setEmail(emp.email || "");
      setPhone(emp.numri_telefonit || "");
      setGender(emp.gjinia || "Mashkull");
      setStatus(emp.is_active ? "true" : "false");
      setUserpassword(emp.userpassword || "");
    }
  }, [emp]);

  if (!emp) {
    return (
      <div className="employee-empty">
        No employee selected
      </div>
    );
  }

  const deleteEmp = async () => {
    if (!window.confirm("Fshi këtë punonjës?")) return;

    try {
      await deleteEmployee(emp.ID);
      alert("Punonjësi u fshi!");
      onDelete();
    } catch (err) {
      ExceptionHandler.handle(err);
    }
  };

  const save = async () => {
    if (!window.confirm("Përditësoni të dhënat?")) return;

    setLoading(true);

    const updatedEmp = {
      emri: firstName,
      mbiemri: lastName,
      username,
      userpassword,
      email,
      numri_telefonit: phone,
      gjinia: gender,
      isActive: status === "true",
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
    <div className="employee-profile">

      {/* HEADER */}
      <div className="employee-profile-header">

        <div className="employee-profile-title">
          <h3>{emp.emri}</h3>
          <small>Menaxhoni detajet e punonjësve</small>
        </div>

        <div className="employee-profile-actions">

          <button
            className="employee-btn employee-btn-primary"
            onClick={save}
            disabled={loading}
          >
            {loading
              ? "Duke u përditësuar..."
              : "Ruaj ndryshimet"}
          </button>

          <button
            className="employee-btn employee-btn-danger"
            onClick={deleteEmp}
          >
            Fshi punonjësin
          </button>

        </div>

      </div>


      {/* PROFILE CARD */}
      <div className="employee-profile-card">

        <div className="employee-profile-layout">

          {/* LEFT PROFILE SUMMARY */}
          <div className="employee-summary">

            <div className="employee-summary-content">

              <div className="employee-avatar">
                {emp.emri?.charAt(0)}
              </div>

              <h5 className="employee-summary-name">
                {emp.emri}
              </h5>

              <p className="employee-summary-email">
                {email}
              </p>

              <span
                className={`employee-status ${
                  status === "true"
                    ? "employee-status-active"
                    : "employee-status-inactive"
                }`}
              >
                {status === "true"
                  ? "Aktiv"
                  : "Jo-Aktiv"}
              </span>

            </div>

            <div className="employee-summary-divider" />

            <div className="employee-meta">

              <div className="employee-meta-row">
                <span>ID</span>
                <strong>{emp.ID}</strong>
              </div>

              <div className="employee-meta-row">
                <span>Role</span>
                <strong>Employee</strong>
              </div>

            </div>

          </div>


          {/* RIGHT FORM */}
          <div className="employee-form">

            <div className="employee-form-header">
              <h4>Të dhënat e punonjësit</h4>
              <p>Përditësoni informacionin e llogarisë</p>
            </div>

            <div className="employee-form-grid">

              <div className="employee-field">
                <label>Emri</label>

                <input
                  className="employee-input"
                  value={firstName}
                  onChange={(e) =>
                    setFirstName(e.target.value)
                  }
                />
              </div>


              <div className="employee-field">
                <label>Mbiemri</label>

                <input
                  className="employee-input"
                  value={lastName}
                  onChange={(e) =>
                    setLastName(e.target.value)
                  }
                />
              </div>


              <div className="employee-field">
                <label>Emri i përdoruesit</label>

                <input
                  className="employee-input"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                />
              </div>


              <div className="employee-field">
                <label>Email</label>

                <input
                  className="employee-input"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>


              <div className="employee-field">
                <label>Numri i telefonit</label>

                <input
                  className="employee-input"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                />
              </div>


              <div className="employee-field">
                <label>Fjalëkalimi</label>

                <input
                  className="employee-input"
                  value={userpassword}
                  onChange={(e) =>
                    setUserpassword(e.target.value)
                  }
                />
              </div>


              <div className="employee-field">
                <label>Gjinia</label>

                <select
                  className="employee-input employee-select"
                  value={gender}
                  onChange={(e) =>
                    setGender(e.target.value)
                  }
                >
                  <option value="Mashkull">
                    Mashkull
                  </option>

                  <option value="Femër">
                    Femër
                  </option>
                </select>

              </div>


              <div className="employee-field">
                <label>Gjendja</label>

                <select
                  className="employee-input employee-select"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                >
                  <option value="true">
                    Aktiv
                  </option>

                  <option value="false">
                    Jo-Aktiv
                  </option>
                </select>

              </div>


              <div className="employee-field employee-field-full">
                <label>Numri identifikues</label>

                <input
                  className="employee-input employee-input-readonly"
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
    <div className="employees-page">

      {/* HEADER */}
      <div className="employee-page-header">

        <div>
          <h4>Stafi</h4>

          <small>
            Menaxho llogaritë dhe lejet e stafit
          </small>
        </div>

        <button
          className="employee-btn employee-btn-primary"
          onClick={onRegister}
        >
          + Shto punonjës
        </button>

      </div>


      {/* DESKTOP TABLE */}
      <div className="employee-table-wrapper">

        <table className="employee-table">

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

              <tr
                key={emp.ID}
                onClick={() => onSelect(emp)}
              >

                <td className="employee-table-id">
                  #{emp.ID}
                </td>

                <td className="employee-table-name">
                  {emp.emri} {emp.mbiemri}
                </td>

                <td className="employee-table-username">
                  @{emp.username}
                </td>

                <td className="employee-table-email">
                  {emp.email}
                </td>

                <td>
                  {emp.numri_telefonit}
                </td>

                <td>

                  <span
                    className={`employee-status ${
                      emp.is_active
                        ? "employee-status-active"
                        : "employee-status-inactive"
                    }`}
                  >
                    {emp.is_active
                      ? "Aktiv"
                      : "Jo-Aktiv"}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      {/* MOBILE */}
      <div className="employee-mobile-list">

        {employees.map((emp) => (

          <div
            className="employee-mobile-card"
            key={emp.ID}
            onClick={() => onSelect(emp)}
          >

            <div className="employee-mobile-header">

              <div className="employee-mobile-identity">

                <div className="employee-mobile-avatar">
                  {emp.emri?.charAt(0)}
                </div>

                <div className="employee-mobile-name">

                  <strong>
                    {emp.emri} {emp.mbiemri}
                  </strong>

                  <span>
                    @{emp.username}
                  </span>

                </div>

              </div>

              <span
                className={`employee-status ${
                  emp.is_active
                    ? "employee-status-active"
                    : "employee-status-inactive"
                }`}
              >
                {emp.is_active
                  ? "Aktiv"
                  : "Jo-Aktiv"}
              </span>

            </div>


            <div className="employee-mobile-details">

              <div className="employee-mobile-detail">

                <span className="employee-mobile-label">
                  Email
                </span>

                <span className="employee-mobile-value">
                  {emp.email}
                </span>

              </div>


              <div className="employee-mobile-detail">

                <span className="employee-mobile-label">
                  Telefon
                </span>

                <span className="employee-mobile-value">
                  {emp.numri_telefonit}
                </span>

              </div>


              <div className="employee-mobile-detail">

                <span className="employee-mobile-label">
                  ID
                </span>

                <span className="employee-mobile-value">
                  #{emp.ID}
                </span>

              </div>


              <div className="employee-mobile-detail">

                <span className="employee-mobile-label">
                  Roli
                </span>

                <span className="employee-mobile-value">
                  Employee
                </span>

              </div>

            </div>


            <div className="employee-mobile-open">
              <span>Shiko dhe ndrysho</span>
              <span className="employee-mobile-arrow">
                ›
              </span>
            </div>

          </div>

        ))}

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

    if (!window.confirm("Dëshironi të krijoni këtë punonjës?")) return;

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
      alert("Punonjësi u krijua me sukses!");
      e.target.reset();
    } catch (err) {
      if (err.status === 400) {
        alert("Punonjësi ekziston!");
      } else {
        alert(err.message || "Dështim!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-register">

      {/* HEADER */}
      <div className="employee-register-header">

        <div>
          <h3>Regjistro punonjës</h3>

          <small>
            Krijoni një llogari të re për punonjësin
          </small>
        </div>

      </div>


      {/* CARD */}
      <div className="employee-register-card">

        <form
          onSubmit={handleSubmit}
          className="employee-register-form"
        >

          <div className="employee-register-grid">

            <div className="employee-field">
              <label>Emri</label>

              <input
                className="employee-input"
                name="emri"
                required
              />
            </div>


            <div className="employee-field">
              <label>Mbiemri</label>

              <input
                className="employee-input"
                name="mbiemri"
                required
              />
            </div>


            <div className="employee-field">
              <label>Emri i përdoruesit</label>

              <input
                className="employee-input"
                name="username"
                required
              />
            </div>


            <div className="employee-field">
              <label>Email</label>

              <input
                className="employee-input"
                type="email"
                name="email"
                required
              />
            </div>


            <div className="employee-field">
              <label>Numri i telefonit</label>

              <input
                className="employee-input"
                name="numri_telefonit"
                type="tel"
                pattern="^\+?[0-9]{8,15}$"
                required
              />
            </div>


            <div className="employee-field">
              <label>Fjalëkalimi</label>

              <input
                className="employee-input"
                name="userpassword"
                required
              />
            </div>


            <div className="employee-field">
              <label>Gjinia</label>

              <select
                className="employee-input employee-select"
                name="gjinia"
              >
                <option value="Mashkull">
                  Mashkull
                </option>

                <option value="Femër">
                  Femër
                </option>
              </select>
            </div>


            <div className="employee-field employee-field-full">
              <label>Përshkrimi</label>

              <textarea
                className="employee-input employee-textarea"
                rows="3"
                name="pershkrimi"
              ></textarea>
            </div>

          </div>


          <div className="employee-register-footer">

            <button
              className="employee-btn employee-btn-primary employee-register-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Duke regjistruar..."
                : "Regjistro punonjës"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}