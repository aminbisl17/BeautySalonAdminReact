import { useState, useEffect } from "react";
import { deleteService, fetchServiceAtributes, fetchServices, updateService, registerServices } from "../javascript/API/ServicesAPI";
import { ExceptionHandler } from "../javascript/Exceptions/ExceptionHandler";
import "../css/tables.css";
import { useNavigate } from "react-router-dom";
export function ServiceTable({ onSelect, onRegister }) {
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
    <div className="page">

      {/* HEADER */}
      <div className="page-header">

        <div>
          <h4 className="mb-0 fw-bold">Services</h4>
          <small className="text-muted">
            Manage service offerings
          </small>
        </div>

        <button
          className="btn btn-primary rounded-pill px-4"
          onClick={onRegister}
        >
          + Add Service
        </button>

      </div>

      {/* TABLE */}
      <div className="table-wrapper">

        <table className="custom-table">

          <thead>
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
              <tr key={ser.ID} onClick={() => onSelect?.(ser)}>

                <td>#{ser.ID}</td>

                <td><b>{ser.emri_sherbimit}</b></td>

                <td>
                  <span className={`badge ${ser.is_active ? "bg-success" : "bg-secondary"}`}>
                    {ser.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>{ser.kohezgjatja}</td>
                <td>{ser.qmimi_baze}</td>
                <td>{ser.zbritja}</td>

                <td className="text-muted">
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

  // =========================
  // SERVICE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // ATTRIBUTE CHANGE
  // =========================
  const handleAttrChange = (index, field, value) => {
    setAttributes((prev) =>
      prev.map((attr, i) =>
        i === index ? { ...attr, [field]: value } : attr
      )
    );
  };

  // =========================
  // ADD ATTRIBUTE
  // =========================
  const addAttribute = () => {
    setAttributes((prev) => [
      ...prev,
      {
        id_atributit: null,
        opsioni: "",
        pershkrimi: "",
        kohezgjatja: "",
        qmimi: 0,
        zbritja: 0,
      },
    ]);
  };

  // =========================
  // DELETE ATTRIBUTE
  // =========================
  const deleteAttribute = (index) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================
  // DELETE SERVICE
  // =========================
  const handleDelete = async () => {
    try {
      const res = await deleteService(service.ID);
      alert(res);
      navigate("/", { replace: true });
    } catch (err) {
      ExceptionHandler.handle(err);
    }
  };

  // =========================
  // SAVE SERVICE
  // =========================
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
          id_atributit: attr.id_atributit ?? null,
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
                  style={{
                    width: "90px",
                    height: "90px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div className="fs-1">🛠️</div>
              )}
            </div>

            <input
              className="form-control mb-2 text-center"
              name="emri_sherbimit"
              value={form.emri_sherbimit || ""}
              onChange={handleChange}
            />

            <span
              className={`badge ${
                form.is_active ? "bg-success" : "bg-secondary"
              }`}
            >
              {form.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          {/* RIGHT */}
          <div className="col-md-8">

            <div className="row g-3">

              <div className="col-md-6">
                <label className="form-label">Price</label>
                <input
                  className="form-control"
                  name="qmimi_baze"
                  value={form.qmimi_baze || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Discount</label>
                <input
                  className="form-control"
                  name="zbritja"
                  value={form.zbritja || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="pershkrimi"
                  value={form.pershkrimi || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 text-end mt-3">
                <button
                  className="btn btn-outline-primary"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* =========================
          ATTRIBUTES SECTION
      ========================= */}
      <div className="mt-4 bg-white border rounded shadow-sm p-3">

        <div className="d-flex justify-content-between align-items-center mb-3">

          <h6 className="mb-0 text-muted">Attributes</h6>

          <button
            className="btn btn-sm btn-primary"
            onClick={addAttribute}
          >
            + Add Attribute
          </button>

        </div>

        <div className="table-responsive">

          <table className="table table-sm table-hover align-middle">

            <thead className="table-light">
              <tr>
                <th>Option</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {attributes.map((attr, idx) => (
                <tr key={idx}>

                  <td>
                    <input
                      className="form-control form-control-sm"
                      value={attr.opsioni}
                      onChange={(e) =>
                        handleAttrChange(idx, "opsioni", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      className="form-control form-control-sm"
                      value={attr.pershkrimi}
                      onChange={(e) =>
                        handleAttrChange(idx, "pershkrimi", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      className="form-control form-control-sm"
                      value={attr.kohezgjatja}
                      onChange={(e) =>
                        handleAttrChange(idx, "kohezgjatja", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      className="form-control form-control-sm"
                      value={attr.qmimi}
                      onChange={(e) =>
                        handleAttrChange(idx, "qmimi", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      className="form-control form-control-sm"
                      value={attr.zbritja}
                      onChange={(e) =>
                        handleAttrChange(idx, "zbritja", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteAttribute(idx)}
                    >
                      ✕
                    </button>
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setService((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const removeAtribut = (index) => {
    setService((prev) => ({
      ...prev,
      atributet: prev.atributet.filter((_, i) => i !== index),
    }));
  };

  const handleAtributChange = (index, e) => {
    const { name, value } = e.target;

    const updated = [...service.atributet];
    updated[index][name] = value;

    setService((prev) => ({
      ...prev,
      atributet: updated,
    }));
  };

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
            <input className="form-control" name="emri_sherbimit" onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Price</label>
            <input className="form-control" name="qmimi_baze" type="number" onChange={handleChange} />
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea className="form-control" name="pershkrimi" onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Duration</label>
            <input className="form-control" name="kohezgjatja" onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Image</label>
            <input
              className="form-control"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

        </div>

        {/* ================= ATTRIBUTES ================= */}
        <hr className="my-4" />

        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">Attributes</h5>

          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={addAtribut}
          >
            + Add Attribute
          </button>
        </div>

        {service.atributet.length === 0 && (
          <p className="text-muted">No attributes added yet</p>
        )}

       {service.atributet.map((atribut, index) => (
  <div key={index} className="border rounded-3 p-3 mb-3 bg-light">

    {/* HEADER ROW */}
    <div className="d-flex justify-content-between align-items-center mb-3">

      <strong className="text-muted">
        Attribute #{index + 1}
      </strong>

      <button
        type="button"
        className="btn btn-sm btn-outline-danger"
        onClick={() => removeAtribut(index)}
      >
        Remove
      </button>

    </div>

    {/* INPUT GRID */}
    <div className="row g-2">

      <div className="col-md-4">
        <input
          className="form-control"
          name="opsioni"
          placeholder="Opsioni"
          value={atribut.opsioni}
          onChange={(e) => handleAtributChange(index, e)}
        />
      </div>

      <div className="col-md-4">
        <input
          className="form-control"
          name="pershkrimi"
          placeholder="Pershkrimi"
          value={atribut.pershkrimi}
          onChange={(e) => handleAtributChange(index, e)}
        />
      </div>

      <div className="col-md-4">
        <input
          className="form-control"
          name="kohezgjatja"
          placeholder="Kohezgjatja"
          value={atribut.kohezgjatja}
          onChange={(e) => handleAtributChange(index, e)}
        />
      </div>

      <div className="col-md-6">
        <input
          className="form-control"
          name="qmimi"
          placeholder="Qmimi"
          value={atribut.qmimi}
          onChange={(e) => handleAtributChange(index, e)}
        />
      </div>

      <div className="col-md-6">
        <input
          className="form-control"
          name="zbritja"
          placeholder="Zbritja"
          value={atribut.zbritja}
          onChange={(e) => handleAtributChange(index, e)}
        />
      </div>

    </div>

  </div>
))}

        <div className="text-end">
          <button className="btn btn-primary mt-3" type="submit">
            Create Service
          </button>
        </div>

      </form>
    </div>
  );
}