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
  <div className="container-fluid py-3">

    {/* HEADER */}
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h4>Employee Profile</h4>

      <button className="btn btn-danger btn-sm" onClick={deleteEmp}>
        Delete
      </button>
    </div>

    <div className="bg-white border rounded shadow-sm p-4">

      <div className="row g-3">

        {/* LEFT INFO */}
        <div className="col-md-4 text-center border-end">

          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: "80px", height: "80px", fontSize: "30px" }}>
            👤
          </div>

          <input className="form-control mb-2"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input className="form-control mb-2"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <input className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

        </div>

        {/* RIGHT INFO */}
        <div className="col-md-8">

          <div className="row g-3">

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Gender</label>
              <select className="form-select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Mashkull">Male</option>
                <option value="Femër">Female</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Employee ID</label>
              <input className="form-control" value={emp.ID} readOnly />
            </div>

            <div className="col-12 d-flex justify-content-end gap-2 mt-3">

              <button
                className="btn btn-outline-primary"
                onClick={save}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </div>

        </div>

      </div>

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
  <div className="container-fluid py-3">

    {/* HEADER */}
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h4 className="mb-0">Employees</h4>

      <button className="btn btn-primary btn-sm" onClick={onRegister}>
        + Register Employee
      </button>
    </div>

    {/* TABLE CARD */}
    <div className="bg-white border rounded shadow-sm p-3">

      <div className="table-responsive">
        <table className="table table-hover align-middle">

          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Registered</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp.ID}
                style={{ cursor: "pointer" }}
                onClick={() => onSelect && onSelect(emp)}
              >
                <td>{emp.ID}</td>
                <td>{emp.emri} {emp.mbiemri}</td>
                <td>@{emp.username}</td>
                <td>{emp.email}</td>
                <td>{emp.numri_telefonit}</td>
                <td>{emp.gjinia}</td>

                <td>
                  <span
                    className={`badge ${
                      emp.is_active ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {emp.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>
                  {emp.data_regjistrimit
                    ? new Date(emp.data_regjistrimit).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
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
  <div className="container-fluid py-3">

    <div className="d-flex justify-content-between align-items-center mb-3">
      <h4>Register Employee</h4>
    </div>

    <div className="bg-white border rounded shadow-sm p-4">

      <div className="row g-3">

        <div className="col-md-6">
          <label className="form-label">First Name</label>
          <input className="form-control" name="emri" required />
        </div>

        <div className="col-md-6">
          <label className="form-label">Last Name</label>
          <input className="form-control" name="mbiemri" required />
        </div>

        <div className="col-md-6">
          <label className="form-label">Username</label>
          <input className="form-control" name="username" required />
        </div>

        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input className="form-control" name="email" type="email" required />
        </div>

        <div className="col-md-6">
          <label className="form-label">Phone</label>
          <input className="form-control" name="numri_telefonit" />
        </div>

        <div className="col-md-6">
          <label className="form-label">Gender</label>
          <select className="form-select" name="gjinia">
            <option value="Mashkull">Male</option>
            <option value="Femër">Female</option>
          </select>
        </div>

        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea className="form-control" name="pershkrimi" rows="3"></textarea>
        </div>

        <div className="col-12 text-end mt-3">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Create Employee"}
          </button>
        </div>

      </div>

    </div>
  </div>
);
}
