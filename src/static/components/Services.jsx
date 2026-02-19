import { useState, useEffect } from "react";
import { fetchServiceAtributes, fetchServices } from "../javascript/API/ServicesAPI";
import { ExceptionHandler } from "../javascript/Exceptions/ExceptionHandler";
import "../css/services.css";

export function ServiceTable({onSelect}) {
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
         <tr onClick={() => onSelect?.(ser.ID)}> 
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

export function ViewService({ serviceId }) {
  const [service, setService] = useState(null);

  useEffect(() => {
    if (serviceId) {
      loadService();
    }
  }, [serviceId]);

  async function loadService() {
    try {
      const data = await fetchServiceAtributes(serviceId);
      setService(data);
    } catch (err) {
      ExceptionHandler.handle(err);
    }
  }

  if (!service) return <div>Loading...</div>;

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">🛠️</div>
        <input type="text" value={service.emri_sherbimit} readOnly />
      </div>

      <div className="profile-info">
        <label>
          ID:
          <input type="text" value={service.ID} readOnly />
        </label>

        <label>
          Active:
          <select value={service.is_active} disabled>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </label>

        <label>
          Duration:
          <input type="text" value={service.kohezgjatja} readOnly />
        </label>

        <label>
          Description:
          <input type="text" value={service.pershkrimi} readOnly />
        </label>

        <label>
          Base Price:
          <input type="number" value={service.qmimi_baze} readOnly />
        </label>

        <label>
          Discount:
          <input type="number" value={service.zbritja} readOnly />
        </label>

        <label>
          Created At:
          <input
            type="text"
            value={new Date(service.created_at).toLocaleString()}
            readOnly
          />
        </label>

        <label>
          Updated At:
          <input
            type="text"
            value={new Date(service.updated_at).toLocaleString()}
            readOnly
          />
        </label>
      </div>

      {service.atributes?.length > 0 && (
        <>
          <h3>Attributes</h3>
          <table>
            <thead>
              <tr>
                <th>ID Attribute</th>
                <th>Option</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Discount</th>
              </tr>
            </thead>
            <tbody>
              {service.atributes.map((attr) => (
                <tr key={attr.id_atributit}>
                  <td>{attr.id_atributit}</td>
                  <td>{attr.opsioni}</td>
                  <td>{attr.pershkrimi}</td>
                  <td>{attr.kohezgjatja}</td>
                  <td>{attr.qmimi}</td>
                  <td>{attr.zbritja}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <button>Save</button>
      <button className="delete-btn">Delete</button>
    </div>
  );
}
