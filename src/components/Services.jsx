import { useState, useEffect } from "react";
import { deleteService, fetchServiceAtributes, fetchServices, updateService, registerServices } from "../javascript/API/ServicesAPI";
import { ExceptionHandler } from "../javascript/Exceptions/ExceptionHandler";
//import "../css/services.css";
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
  <div className="container-fluid py-3">

    {/* HEADER */}
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h4 className="mb-0">Services</h4>

      <button className="btn btn-primary btn-sm" onClick={onRegister}>
        + Register Service
      </button>
    </div>

    {/* TABLE WRAPPER */}
    <div className="bg-white border rounded shadow-sm p-3">

      <div className="table-responsive">
        <table className="table table-hover align-middle">

          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Description</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {services.map((ser) => (
              <tr
                key={ser.ID}
                style={{ cursor: "pointer" }}
                onClick={() => onSelect?.(ser)}
              >
                <td>{ser.ID}</td>
                <td className="fw-semibold">{ser.emri_sherbimit}</td>

                <td>
                  <span className={`badge ${ser.is_active ? "bg-success" : "bg-secondary"}`}>
                    {ser.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>{ser.kohezgjatja}</td>
                <td>{ser.qmimi_baze}</td>
                <td>{ser.zbritja}</td>
                <td className="text-truncate" style={{ maxWidth: "200px" }}>
                  {ser.pershkrimi}
                </td>
                <td>
                  {ser.created_at
                    ? new Date(ser.created_at).toLocaleDateString()
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
  <div className="container-fluid py-3">

    {/* HEADER */}
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h4>Service Details</h4>

      <button className="btn btn-danger btn-sm" onClick={handleDelete}>
        Delete
      </button>
    </div>

    {/* MAIN CARD */}
    <div className="bg-white border rounded shadow-sm p-4">

      <div className="row g-4">

        {/* LEFT */}
        <div className="col-md-4 text-center border-end">

          <div className="mb-3">
            {form.imageURL ? (
              <img
                src={form.imageURL}
                alt="service"
                className="rounded-circle"
                style={{ width: "90px", height: "90px", objectFit: "cover" }}
              />
            ) : (
              <div className="fs-1">🛠️</div>
            )}
          </div>

          <input
            className="form-control mb-2 text-center"
            name="emri_sherbimit"
            value={form.emri_sherbimit}
            onChange={handleChange}
          />

          <span className={`badge ${form.is_active ? "bg-success" : "bg-secondary"}`}>
            {form.is_active ? "Active" : "Inactive"}
          </span>

        </div>

        {/* RIGHT */}
        <div className="col-md-8">

          <div className="row g-3">

            <div className="col-md-6">
              <label className="form-label">Price</label>
              <input className="form-control" name="qmimi_baze"
                value={form.qmimi_baze}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Discount</label>
              <input className="form-control" name="zbritja"
                value={form.zbritja}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea className="form-control"
                name="pershkrimi"
                value={form.pershkrimi}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-outline-primary" onClick={handleSave}>
                Save Changes
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>

    {/* ATTRIBUTES TABLE */}
    {attributes.length > 0 && (
      <div className="mt-4 bg-white border rounded shadow-sm p-3">

        <h6 className="text-muted mb-3">Attributes</h6>

        <div className="table-responsive">
          <table className="table table-sm table-hover">

            <thead className="table-light">
              <tr>
                <th>Option</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Discount</th>
              </tr>
            </thead>

            <tbody>
              {attributes.map((attr, idx) => (
                <tr key={idx}>
                  <td>
                    <input className="form-control form-control-sm"
                      value={attr.opsioni}
                      onChange={(e) => handleAttrChange(idx, "opsioni", e.target.value)}
                    />
                  </td>

                  <td>
                    <input className="form-control form-control-sm"
                      value={attr.pershkrimi}
                      onChange={(e) => handleAttrChange(idx, "pershkrimi", e.target.value)}
                    />
                  </td>

                  <td>
                    <input className="form-control form-control-sm"
                      value={attr.kohezgjatja}
                      onChange={(e) => handleAttrChange(idx, "kohezgjatja", e.target.value)}
                    />
                  </td>

                  <td>
                    <input className="form-control form-control-sm"
                      value={attr.qmimi}
                      onChange={(e) => handleAttrChange(idx, "qmimi", e.target.value)}
                    />
                  </td>

                  <td>
                    <input className="form-control form-control-sm"
                      value={attr.zbritja}
                      onChange={(e) => handleAttrChange(idx, "zbritja", e.target.value)}
                    />
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    )}

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
  <div className="container-fluid py-3">

    <h4 className="mb-3">Register Service</h4>

    <form onSubmit={handleSubmit} className="bg-white border rounded shadow-sm p-4">

      <div className="row g-3">

        <div className="col-md-6">
          <label className="form-label">Service Name</label>
          <input className="form-control" name="emri_sherbimit" required />
        </div>

        <div className="col-md-6">
          <label className="form-label">Price</label>
          <input className="form-control" name="qmimi_baze" type="number" />
        </div>

        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea className="form-control" name="pershkrimi" />
        </div>

        <div className="col-md-6">
          <label className="form-label">Duration</label>
          <input className="form-control" name="kohezgjatja" />
        </div>

        <div className="col-md-6">
          <label className="form-label">Image</label>
          <input className="form-control" type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="col-12 text-end mt-3">
          <button className="btn btn-primary" type="submit">
            Create Service
          </button>
        </div>

      </div>

    </form>
  </div>
);
}