import { useState, useEffect } from "react";
import { fetchServices } from "../javascript/API/ServicesAPI";
import { ExceptionHandler } from "../javascript/Exceptions/ExceptionHandler";
import "../css/services.css";

export function ServiceTable() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (err) {
      ExceptionHandler.handle(err);
    }
  }

  return (
    <div>
      <button id="registerBtn">Register</button>
      <table className="employees-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Service Name</th>
            <th>Active</th>
            <th>Duration</th>
            <th>Description</th>
            <th>Base Price</th>
            <th>Discount</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {services.map((ser) => (
            <tr key={ser.ID} data-id={ser.ID}>
              <td>{ser.ID}</td>
              <td>{ser.emri_sherbimit}</td>
              <td>{ser.is_active ? "Yes" : "No"}</td>
              <td>{ser.kohezgjatja}</td>
              <td>{ser.pershkrimi}</td>
              <td>{ser.qmimi_baze}</td>
              <td>{ser.zbritja}</td>
              <td>{new Date(ser.created_at).toLocaleString()}</td>
              <td>{new Date(ser.update_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}