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

        setAttributes(
          (data.atributet || []).map((a) => ({
            ...a,
            hours: Math.floor((a.kohezgjatja || 0) / 60),
            minutes: (a.kohezgjatja || 0) % 60,
          }))
        );
      } catch (err) {
        ExceptionHandler.handle(err);
      }
    }

    loadAttributes();
  }, [service]);

  // =========================
  // SERVICE DURATION UPDATE
  // =========================
  const handleServiceDuration = (field, value) => {
    setForm((prev) => {
      const hours = field === "hours" ? Number(value) : Number(prev.hours || 0);
      const minutes =
        field === "minutes" ? Number(value) : Number(prev.minutes || 0);

      return {
        ...prev,
        hours,
        minutes,
        kohezgjatja: hours * 60 + minutes,
      };
    });
  };

  // =========================
  // ATTRIBUTE UPDATE
  // =========================
  const handleAttrChange = (index, field, value) => {
    setAttributes((prev) =>
      prev.map((attr, i) => {
        if (i !== index) return attr;

        const updated = {
          ...attr,
          [field]: ["qmimi", "zbritja", "hours", "minutes"].includes(field)
            ? Number(value)
            : value,
        };

        const hours = Number(updated.hours || 0);
        const minutes = Number(updated.minutes || 0);

        updated.kohezgjatja = hours * 60 + minutes;

        return updated;
      })
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
        hours: 0,
        minutes: 0,
        kohezgjatja: 0,
        qmimi: 0,
        zbritja: 0,
      },
    ]);
  };

  const deleteAttribute = (index) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================
  // SAVE
  // =========================
  const handleSave = async () => {
    try {
      const updatedService = {
        emri_sherbimit: form.emri_sherbimit,
        pershkrimi: form.pershkrimi,
        qmimi_baze: parseFloat(form.qmimi_baze),
        zbritja: parseFloat(form.zbritja),
        is_active: form.is_active === true || form.is_active === "true",

        kohezgjatja: form.kohezgjatja,

        atributet: attributes.map((attr) => ({
          id_atributit: attr.id_atributit ?? null,
          opsioni: attr.opsioni,
          pershkrimi: attr.pershkrimi,
          qmimi: Number(attr.qmimi),
          zbritja: Number(attr.zbritja),
          kohezgjatja: attr.kohezgjatja,
        })),
      };

      const success = await updateService(form.ID, updatedService);

      if (success) alert("Service updated successfully!");
    } catch (err) {
      ExceptionHandler.handle(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteService(service.ID);
      alert(res);
      navigate("/", { replace: true });
    } catch (err) {
      ExceptionHandler.handle(err);
    }
  };

  if (!service) return <div>Loading...</div>;

  return (
    <div className="container-fluid py-3">

      {/* HEADER */}
   <div className="d-flex align-items-center justify-content-between mb-3">

  <h4 className="mb-0">Service Details</h4>

  <div className="d-flex gap-2">
    
    <button
      className="btn btn-sm btn-primary w-auto px-3"
      onClick={handleSave}
    >
      Save Changes
    </button>

    <button
      className="btn btn-sm btn-outline-danger w-auto px-3"
      onClick={handleDelete}
    >
      Delete
    </button>

  </div>

</div>

      {/* SERVICE */}
      <div className="bg-white border rounded p-4 mb-4">

  <div className="row g-3 align-items-center">

    {/* IMAGE */}
    <div className="col-md-3 text-center">

      {form.imageURL ? (
        <img
          src={form.imageURL}
          alt="service"
          style={{
            width: "90px",
            height: "90px",
            objectFit: "cover",
            borderRadius: "50%",
            border: "1px solid #ddd",
          }}
        />
      ) : (
        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            border: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            margin: "0 auto",
          }}
        >
          🛠️
        </div>
      )}

    </div>

    {/* INPUTS */}
    <div className="col-md-9">

      <input
        className="form-control mb-2"
        value={form.emri_sherbimit || ""}
        onChange={(e) =>
          setForm({ ...form, emri_sherbimit: e.target.value })
        }
      />

      {/* DURATION */}
      <div className="row g-2">

        <div className="col-6">
          <input
            className="form-control"
            type="number"
            value={form.hours || 0}
            onChange={(e) =>
              handleServiceDuration("hours", e.target.value)
            }
            placeholder="Hours"
          />
        </div>

        <div className="col-6">
          <input
            className="form-control"
            type="number"
            value={form.minutes || 0}
            onChange={(e) =>
              handleServiceDuration("minutes", e.target.value)
            }
            placeholder="Minutes"
            min="0"
            max="59"
          />
        </div>

      </div>

    </div>

  </div>
</div>

      {/* ATTRIBUTES */}
      <div className="bg-white border rounded p-3">

     <button
  className="btn btn-sm btn-outline-primary w-auto px-3"
  onClick={addAttribute}
>
  + Add Attribute
</button>

        <table className="table table-sm">

          <thead>
            <tr>
              <th>Option</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Discount</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {attributes.map((attr, i) => (
              <tr key={i}>

                <td>
                  <input
                    className="form-control form-control-sm"
                    value={attr.opsioni}
                    onChange={(e) =>
                      handleAttrChange(i, "opsioni", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    className="form-control form-control-sm"
                    value={attr.pershkrimi}
                    onChange={(e) =>
                      handleAttrChange(i, "pershkrimi", e.target.value)
                    }
                  />
                </td>

                {/* DURATION EDITABLE */}
                <td>
                  <div className="d-flex gap-1">
                    <input
                      style={{ width: "60px" }}
                      className="form-control form-control-sm"
                      value={attr.hours || 0}
                      onChange={(e) =>
                        handleAttrChange(i, "hours", e.target.value)
                      }
                    />

                    <input
                      style={{ width: "60px" }}
                      className="form-control form-control-sm"
                      value={attr.minutes || 0}
                      onChange={(e) =>
                        handleAttrChange(i, "minutes", e.target.value)
                      }
                      min="0"
                      max="59"
                    />
                  </div>
                </td>

                <td>
                  <input
                    className="form-control form-control-sm"
                    value={attr.qmimi}
                    onChange={(e) =>
                      handleAttrChange(i, "qmimi", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    className="form-control form-control-sm"
                    value={attr.zbritja}
                    onChange={(e) =>
                      handleAttrChange(i, "zbritja", e.target.value)
                    }
                  />
                </td>

                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteAttribute(i)}
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
  );
}
export function RegisterService() {
  const [service, setService] = useState({
    emri_sherbimit: "",
    pershkrimi: "",
    qmimi_baze: "",
    zbritja: 0,
    atributet: [],
    hours: 0,
    minutes: 0,
  });

  const [image, setImage] = useState(null);

  // ================= SERVICE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setService((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= ATTRIBUTES =================
  const addAtribut = () => {
    setService((prev) => ({
      ...prev,
      atributet: [
        ...prev.atributet,
        {
          opsioni: "",
          pershkrimi: "",
          hours: 0,
          minutes: 0,
          kohezgjatja: 0,
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

  // ================= ATTRIBUTE CHANGE =================
  const handleAtributChange = (index, e) => {
    const { name, value } = e.target;

    const updated = [...service.atributet];

    const numericFields = ["qmimi", "zbritja", "hours", "minutes"];

    updated[index][name] = numericFields.includes(name)
      ? Number(value)
      : value;

    // duration in minutes
    const hours = Number(updated[index].hours || 0);
    const minutes = Number(updated[index].minutes || 0);

    updated[index].kohezgjatja = hours * 60 + minutes;

    setService((prev) => ({
      ...prev,
      atributet: updated,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const kohezgjatja =
      (service.hours || 0) * 60 + (service.minutes || 0);

    const formattedData = {
      emri_sherbimit: service.emri_sherbimit,
      pershkrimi: service.pershkrimi,
      qmimi_baze: Number(service.qmimi_baze),
      zbritja: Number(service.zbritja),

      kohezgjatja,

      atributet: service.atributet.map((a) => {
        const attrDuration =
          (a.hours || 0) * 60 + (a.minutes || 0);

        return {
          opsioni: a.opsioni,
          pershkrimi: a.pershkrimi,
          qmimi: Number(a.qmimi),
          zbritja: Number(a.zbritja),
          kohezgjatja: attrDuration,
        };
      }),
    };

    const response = await registerServices(formattedData, image);
    alert(response ? "Success" : "Failed");
  };

  return (
    <div className="container-fluid py-3">
      <h4 className="mb-3">Register Service</h4>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded shadow-sm p-4"
      >
        <div className="row g-3">

          <div className="col-md-6">
            <label className="form-label">Service Name</label>
            <input
              className="form-control"
              name="emri_sherbimit"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Price</label>
            <input
              className="form-control"
              name="qmimi_baze"
              type="number"
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="pershkrimi"
              onChange={handleChange}
            />
          </div>

          {/* DURATION */}
          <div className="col-md-6">
            <label className="form-label">Duration</label>

            <div className="row g-2">
              <div className="col-6">
                <input
                  type="number"
                  className="form-control"
                  name="hours"
                  min="0"
                  placeholder="Hours"
                  onChange={handleChange}
                />
              </div>

              <div className="col-6">
                <input
                  type="number"
                  className="form-control"
                  name="minutes"
                  min="0"
                  max="59"
                  placeholder="Minutes"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* IMAGE */}
          <div className="col-md-6">
            <label className="form-label">Image</label>
            <input
              className="form-control"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

        </div>

        <hr className="my-4" />

        {/* ATTRIBUTES */}
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

            <div className="d-flex justify-content-between mb-3">
              <strong>Attribute #{index + 1}</strong>

              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => removeAtribut(index)}
              >
                Remove
              </button>
            </div>

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
                <div className="row g-2">

                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control"
                      name="hours"
                      placeholder="Hours"
                      value={atribut.hours || 0}
                      onChange={(e) => handleAtributChange(index, e)}
                    />
                  </div>

                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control"
                      name="minutes"
                      placeholder="Minutes"
                      value={atribut.minutes || 0}
                      onChange={(e) => handleAtributChange(index, e)}
                    />
                  </div>

                </div>
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