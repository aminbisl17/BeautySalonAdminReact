import { useState, useEffect } from "react";
import { deleteService, fetchServiceAtributes, fetchServices, updateService, registerServices } from "../javascript/API/ServicesAPI";
import { ExceptionHandler } from "../javascript/Exceptions/ExceptionHandler";
import "../css/services.css";
import { useNavigate } from "react-router-dom";

export function ServiceTable({onSelect, onRegister}) {
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
      <button id="registerBtn" onClick={onRegister}>Register</button>
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

      setForm((prev) => ({
        ...prev,
        ...data, 
      }));

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

;

export function RegisterService() {
  const [service, setService] = useState({
    emri_sherbimit: "",
    pershkrimi: "",
    qmimi_baze: "",
    zbritja: 0,
    kohezgjatja: "",
    atributet: [],
  });

  const [image, setImage] = useState(null);

  // Handle main form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add atribut
  const addAtribut = () => {
    setService((prev) => ({
      ...prev,
      atributet: [
        ...prev.atributet,
        {
          opsioni: "",
          pershkrimi: "",
          kohezgjatja: "",
          qmimi: 0,
          zbritja: 0,
        },
      ],
    }));
  };

  // Handle atribut change
  const handleAtributChange = (index, e) => {
    const { name, value } = e.target;

    const updatedAtributet = [...service.atributet];
    updatedAtributet[index][name] = value;

    setService((prev) => ({
      ...prev,
      atributet: updatedAtributet,
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...service,
      qmimi_baze: parseFloat(service.qmimi_baze),
      zbritja: parseInt(service.zbritja),
      atributet: service.atributet.map((a) => ({
        ...a,
        qmimi: parseFloat(a.qmimi),
        zbritja: parseInt(a.zbritja),
      })),
    };

    const response = await registerServices(formattedData, image);
    alert(response ? "Success" : "Failed");
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>Service Info</legend>

        <label>Emri Sherbimit</label>
        <input
          type="text"
          name="emri_sherbimit"
          value={service.emri_sherbimit}
          onChange={handleChange}
          required
        />

        <label>Pershkrimi</label>
        <textarea
          name="pershkrimi"
          value={service.pershkrimi}
          onChange={handleChange}
          required
        />

        <label>Qmimi Baze</label>
        <input
          type="number"
          step="0.01"
          name="qmimi_baze"
          value={service.qmimi_baze}
          onChange={handleChange}
          required
        />

        <label>Zbritja</label>
        <input
          type="number"
          name="zbritja"
          value={service.zbritja}
          onChange={handleChange}
        />

        <label>Kohëzgjatja</label>
        <input
          type="time"
          step="1"
          name="kohezgjatja"
          value={service.kohezgjatja}
          onChange={handleChange}
          required
        />

        <label>Image</label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </fieldset>

      <fieldset>
        <legend>Atributet</legend>

        {service.atributet.map((atribut, index) => (
          <div key={index} className="atribut">
            <input
              type="text"
              name="opsioni"
              placeholder="Opsioni"
              value={atribut.opsioni}
              onChange={(e) => handleAtributChange(index, e)}
            />

            <textarea
              name="pershkrimi"
              placeholder="Pershkrimi"
              value={atribut.pershkrimi}
              onChange={(e) => handleAtributChange(index, e)}
            />

            <input
              type="time"
              step="1"
              name="kohezgjatja"
              value={atribut.kohezgjatja}
              onChange={(e) => handleAtributChange(index, e)}
            />

            <input
              type="number"
              name="qmimi"
              placeholder="Qmimi"
              value={atribut.qmimi}
              onChange={(e) => handleAtributChange(index, e)}
            />

            <input
              type="number"
              name="zbritja"
              placeholder="Zbritja"
              value={atribut.zbritja}
              onChange={(e) => handleAtributChange(index, e)}
            />
          </div>
        ))}

        <button type="button" onClick={addAtribut}>
          + Add Atribut
        </button>
      </fieldset>

      <button type="submit">Register Service</button>
    </form>
  );
}