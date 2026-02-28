import { useState, useEffect } from "react";
import { deleteService, fetchServiceAtributes, fetchServices, updateService } from "../javascript/API/ServicesAPI";
import { ExceptionHandler } from "../javascript/Exceptions/ExceptionHandler";
import "../css/services.css";
import { useNavigate } from "react-router-dom";

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
    <tr 
      key={ser.ID}
      onClick={() => onSelect?.(ser)}
    > 
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



export function ViewService({ service }) {

      const navigate = useNavigate();
  const [form, setForm] = useState({ ...service });
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
  if (!service?.ID) return;

  async function loadAttributes() {
    try {
      const data = await fetchServiceAtributes(service.ID);

      // Set imageURL in form
      setForm((prev) => ({
        ...prev,
        ...data, 
      }));

      // Set attributes
      setAttributes(data.atributet || []);
    } catch (err) {
      ExceptionHandler.handle(err);
    }
  }

  loadAttributes();
}, [service]);

  // Handle service field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle attribute row changes
  const handleAttrChange = (index, field, value) => {
    setAttributes((prev) =>
      prev.map((attr, i) => (i === index ? { ...attr, [field]: value } : attr))
    );
  };

  const handleDelete = async () =>{
    try{

      const res = await deleteService(service.ID);

      alert(res);

       navigate("/", { replace: true }); 
    }catch(err){
      ExceptionHandler.handle(err);
    }
  }
  const handleSave = async () => {
    try {
      const updatedService = {
        emri_sherbimit: form.emri_sherbimit,
        pershkrimi: form.pershkrimi,
        qmimi_baze: parseFloat(form.qmimi_baze),
        zbritja: parseFloat(form.zbritja),
        is_active: form.is_active === "true" || form.is_active === true,
        kohezgjatja: form.kohezgjatja,
 
        atributet: attributes.map((attr) => ({
          id_atributit: attr.id_atributit ?? null, // null for new attrs
          opsioni: attr.opsioni,
          pershkrimi: attr.pershkrimi,
          kohezgjatja: attr.kohezgjatja,
          qmimi: parseFloat(attr.qmimi),
          zbritja: parseFloat(attr.zbritja),
        })),
      };

      const success = await updateService(form.ID, updatedService);
      if (success) alert("Service updated successfully!");
    } catch (err) {
      ExceptionHandler.handle(err);
    }
  };



  if (!service) return <div>Loading service...</div>;

  return (
    <div className="profile-card">
      <div className="profile-header">
       
    
  <div className="profile-avatar">
  {form.imageURL ? (
    <img
      src={form.imageURL}
      alt="Service"
      loading="lazy"
      style={{ width: "80px", height: "80px", borderRadius: "50%" }}
    />
  ) : (
    <div style={{ fontSize: "40px" }}>🛠️</div> // fallback avatar
  )}
</div>
   
        <input
          type="text"
          name="emri_sherbimit"
          value={form.emri_sherbimit}
          onChange={handleChange}
        />
      </div>

      <div className="profile-info">
        <label>
          ID:
          <input type="text" value={form.ID} readOnly />
        </label>

        <label>
          Active:
          <select name="is_active" value={form.is_active} onChange={handleChange}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </label>

        <label>
          Duration:
          <input type="text" name="kohezgjatja" value={form.kohezgjatja} onChange={handleChange} />
        </label>

        <label>
          Description:
          <input type="text" name="pershkrimi" value={form.pershkrimi} onChange={handleChange} />
        </label>

        <label>
          Base Price:
          <input type="number" name="qmimi_baze" value={form.qmimi_baze} onChange={handleChange} />
        </label>

        <label>
          Discount:
          <input type="number" name="zbritja" value={form.zbritja} onChange={handleChange} />
        </label>
      </div>

      {attributes.length > 0 && (
        <>
          <h3>Attributes</h3>
          <table border="1">
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
              {attributes.map((attr, idx) => (
                <tr key={attr.id_atributit ?? idx}>
                  <td>{attr.id_atributit}</td>
                  <td>
                    <input
                      value={attr.opsioni}
                      onChange={(e) => handleAttrChange(idx, "opsioni", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={attr.pershkrimi}
                      onChange={(e) => handleAttrChange(idx, "pershkrimi", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={attr.kohezgjatja}
                      onChange={(e) => handleAttrChange(idx, "kohezgjatja", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={attr.qmimi}
                      onChange={(e) => handleAttrChange(idx, "qmimi", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={attr.zbritja}
                      onChange={(e) => handleAttrChange(idx, "zbritja", e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <button onClick={handleSave}>Save</button>
      <button onClick={handleDelete} className="delete-btn">Delete</button>
    </div>
  );
}