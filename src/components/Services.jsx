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
          <h4 className="mb-0 fw-bold">Shërbimet</h4>
          <small className="text-muted">
            Menaxhoni ofertat e shërbimeve
          </small>
        </div>

<div className="d-flex gap-2">
        <button
          className="btn btn-sm btn-primary w-auto px-3"
          onClick={onRegister}
        >
          + Krijo shërbim
        </button>
</div>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">

        <table className="custom-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Emri i shërbimit</th>
              <th>Gjendja</th>
              <th>Kohëzgjatja</th>
              <th>Çmimi</th>
              <th>Zbritja</th>
              <th>Përshkrimi</th>
              <th>Data e krijimit</th>
            </tr>
          </thead>

          <tbody>
            {services.map((ser) => (
              <tr key={ser.ID} onClick={() => onSelect?.(ser)}>

                <td>#{ser.ID}</td>

                <td><b>{ser.emri_sherbimit}</b></td>

                <td>
                  <span className={`badge ${ser.is_active ? "bg-success" : "bg-secondary"}`}>
                    {ser.is_active ? "Aktiv" : "Jo-Aktiv"}
                  </span>
                </td>

                <td>
  {ser.kohezgjatja >= 60 ? `${Math.floor(ser.kohezgjatja / 60)}h ${ser.kohezgjatja % 60}m`
    : `${ser.kohezgjatja}m`}
</td>
               <td>{Number(ser.qmimi_baze).toFixed(2)}</td>
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

export function ViewService({ service, onDelete}) {
  const navigate = useNavigate();

  const [form, setForm] = useState({ ...service });
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    if (!service?.ID) return;

    async function loadAttributes() {
      try {
        const data = await fetchServiceAtributes(service.ID);

      setForm((prev) => {
  const totalMinutes = Number(service?.kohezgjatja || 0);

  return {
    ...prev,
    ...data,
    kohezgjatja: totalMinutes,
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };
});

        setAttributes(
  (data.atributet || []).map((a) => {
    const mins = Number(a.kohezgjatja || 0);

    return {
      ...a,
      hours: Math.floor(mins / 60),
      minutes: mins % 60,
    };
  })
);
      } catch (err) {
        ExceptionHandler.handle(err);
      }
    }

    loadAttributes();
  }, [service]);

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
  if (!window.confirm("Përditëso të dhënat e shërbimit?")) return;

  try {
  
    const cleanedAttributes = attributes.map((a) => ({
  id_atributit: a.id_atributit,
  opsioni: a.opsioni,
  pershkrimi: a.pershkrimi,
  qmimi: Number(a.qmimi) || 0,
  zbritja: Number(a.zbritja) || 0,
  kohezgjatja:
    (Number(a.hours) || 0) * 60 +
    (Number(a.minutes) || 0),
}));

    const payload = {
      ...form,
      atributet: cleanedAttributes, // ✅ send only clean data
    };

    const success = await updateService(service.ID, payload);

    if (success) {
      alert("Të dhënat u përditësuan!");
    } else {
      alert("Dështim");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};

  const handleDelete = async () => {
  if (!window.confirm("Fshi këtë shërbim?")) return;

  try {
    await deleteService(service.ID);

    onDelete();
  } catch (err) {
    ExceptionHandler.handle(err);
  }
};
  if (!service) return <div>Loading...</div>;

  return (
 //   <div className="container-fluid py-3">
 <div className="w-100">
      {/* HEADER */}

 <div className="d-flex align-items-center justify-content-between mb-3">

    <h4 className="mb-0">{service.emri_sherbimit}</h4>

    <span className="text-muted small">
      • Përditësimi i fundit{" "}
      {new Date(service.update_at).toLocaleString("sq-AL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
 
  <div className="d-flex gap-2">
    
<button
  className="btn btn-sm btn-primary w-auto px-3"
      onClick={handleSave}
    >
      Ruaj ndryshimet
</button>

<button
  className="btn btn-danger btn-sm w-auto px-3"
  onClick={handleDelete}
>
  Fshi shërbimin
</button>

  </div>

</div>

      {/* SERVICE */}
   <div className="bg-white border rounded p-4 mb-4">
  <div className="row g-3 align-items-start">

 {/* IMAGE */}
<div className="col-md-3 text-center">

  <label style={{ cursor: "pointer", position: "relative" }}>

    {form.imageURL ? (
      <img
        src={form.imageURL}
        alt="service"
        style={{
          width: "140px",
          height: "140px",
          objectFit: "cover",
          borderRadius: "50%",
          border: "1px solid #ddd",
        }}
      />
    ) : (
      <div
        style={{
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          border: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "40px",
          margin: "0 auto",
        }}
      >
        🛠️
      </div>
    )}

    <input
      type="file"
      accept="image/*"
      style={{ display: "none" }}
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          const preview = URL.createObjectURL(file);

          setForm({
            ...form,
            imageURL: preview,
            imageFile: file,
            removeImage: false,
          });
        }
      }}
    />
  </label>

  {form.imageURL && (
    <button
      type="button"
      className="btn btn-sm btn-danger mt-2"
      onClick={() =>
        setForm({
          ...form,
          imageURL: null,
          imageFile: null,
          removeImage: true,
        })
      }
    >
      Fshi imazhin
    </button>
  )}

  <div style={{ fontSize: "12px", marginTop: "6px", color: "#777" }}>
    Kliko për të ndryshuar imazhin
  </div>

</div>

    {/* RIGHT SIDE CONTENT */}
    <div className="col-md-9">

      <div className="row g-3">

        {/* NAME */}
        <div className="col-md-6">
          <label className="form-label">Emri i shërbimit</label>
          <input
            className="form-control"
            value={form.emri_sherbimit || ""}
            onChange={(e) =>
              setForm({ ...form, emri_sherbimit: e.target.value })
            }
          />
        </div>

        {/* PRICE */}
      <div className="col-md-6">
  <label className="form-label">Çmimi</label>
  <input
    className="form-control"
    value={form.qmimi_baze ?? ""}
    required
    min="0"
    step="0.01"
    type="number"
    onChange={(e) =>
      setForm({ ...form, qmimi_baze: e.target.value })
    }
  />
</div>

        {/* DURATION */}
        <div className="col-md-6">
          <label className="form-label">Orë</label>
          <input
            className="form-control"
            type="number"
            value={form.hours ?? ""}
            onChange={(e) =>
              handleServiceDuration("hours", e.target.value)
            }
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Minuta</label>
          <input
            className="form-control"
            type="number"
            min="0"
            max="59"
            value={form.minutes ?? ""}
            onChange={(e) =>
              handleServiceDuration("minutes", e.target.value)
            }
          />
        </div>

        {/* SWITCH */}
        <div className="col-12">
          <div className="form-check form-switch mt-2">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              checked={form.is_active || false}
              onChange={(e) => {
                const newValue = e.target.checked;

                const confirmed = window.confirm(
                  `Dëshironi të ${
                    newValue ? "aktivizoni" : "deaktivizoni"
                  } këtë shërbim?`
                );

                if (confirmed) {
                  setForm({ ...form, is_active: newValue });
                }
              }}
            />
            <label className="form-check-label">
              {form.is_active ? "Aktiv" : "Jo Aktiv"}
            </label>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

      {/* ATTRIBUTES */}
   <div className="bg-white border rounded p-3">

  {/* HEADER */}
  <div className="d-flex align-items-center justify-content-between mb-2">

    <h5 className="mb-0">Atributet</h5>

    <button
      type="button"
      className="btn btn-sm btn-outline-primary w-auto px-3"
      onClick={addAttribute}
    >
      + Shto atribute
    </button>

  </div>

  {/* EMPTY STATE */}
  {attributes.length === 0 ? (
    <p className="text-muted mb-0">Nuk ka atribut të shtuar</p>
  ) : (

    /* TABLE */
    <table className="table table-sm">

      <thead>
        <tr>
          <th>Emri</th>
          <th>Përshkrimi</th>
          <th>Kohëzgjatja</th>
          <th>Çmimi</th>
          <th>Zbritja</th>
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
  )}
</div>
    </div>
  );
}
export function RegisterService({onRegister}) {
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

  const numericFields = ["hours", "minutes", "qmimi_baze", "zbritja"];

  setService((prev) => ({
    ...prev,
    [name]: numericFields.includes(name)
      ? Number(value)
      : value,
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

    if(!window.confirm("Dëshironi të krijoni këtë shërbim?")) return;
    e.preventDefault();

  const kohezgjatja =
  (Number(service.hours) || 0) * 60 +
  (Number(service.minutes) || 0);

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
    alert(response ? "Shërbimi u krijua me sukses!" : "Dështim!");
    onRegister();
  };

  return (
    <div className="container-fluid py-3">
      <h4 className="mb-3">Krijo shërbim</h4>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded shadow-sm p-4"
      >
        <div className="row g-3">

          <div className="col-md-6">
            <label className="form-label">Emri i shërbimit</label>
            <input
              className="form-control"
              name="emri_sherbimit"
               required
    pattern="[A-Za-zÀ-ž\s]+"
              onChange={handleChange}
            />
          </div>

         <div className="col-md-6">
  <label className="form-label">Çmimi</label>
  <input
    className="form-control"
    name="qmimi_baze"
    type="number"
    min="0"
    step="0.01"
    required
    onChange={handleChange}
  />
</div>

          <div className="col-12">
            <label className="form-label">Përshkrimi</label>
            <textarea
              className="form-control"
              name="pershkrimi"
              onChange={handleChange}
            />
          </div>

          {/* DURATION */}
          <div className="col-md-6">
            <label className="form-label">Kohëzgjatja</label>

            <div className="row g-2">
              <div className="col-6">
                <input
                  type="number"
                  className="form-control"
                  name="hours"
                  min="0"
                  placeholder="Orë"
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
                  placeholder="Minuta"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* IMAGE */}
          <div className="col-md-6">
            <label className="form-label">Imazhi</label>
            <input
              className="form-control"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

        </div>

        <hr className="my-4" />

       {/* ATTRIBUTES HEADER */}
<div className="bg-white border rounded p-3">

  <div className="d-flex align-items-center justify-content-between mb-2">

    <h5 className="mb-0">Atributet</h5>

    <button
      type="button"
      className="btn btn-sm btn-outline-primary w-auto px-3"
      onClick={addAtribut}
    >
      + Shto atribute
    </button>

  </div>

  {/* EMPTY STATE */}
  {service.atributet.length === 0 ? (
    <p className="text-muted mb-0">Nuk ka atribut të shtuar</p>
  ) : (

    /* TABLE */
    <table className="table table-sm">

      <thead>
        <tr>
          <th>Emri</th>
          <th>Përshkrimi</th>
          <th>Kohëzgjatja</th>
          <th>Çmimi</th>
          <th>Zbritja</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {service.atributet.map((atribut, index) => (
          <tr key={index}>

            <td>
              <input
                className="form-control form-control-sm"
                name="opsioni"
                value={atribut.opsioni}
                onChange={(e) => handleAtributChange(index, e)}
              />
            </td>

            <td>
              <input
                className="form-control form-control-sm"
                name="pershkrimi"
                value={atribut.pershkrimi}
                onChange={(e) => handleAtributChange(index, e)}
              />
            </td>

            <td>
              <div className="d-flex gap-1">
                <input
                  style={{ width: "60px" }}
                  className="form-control form-control-sm"
                  name="hours"
                  type="number"
                  value={atribut.hours || 0}
                  onChange={(e) => handleAtributChange(index, e)}
                />

                <input
                  style={{ width: "60px" }}
                  className="form-control form-control-sm"
                  name="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={atribut.minutes || 0}
                  onChange={(e) => handleAtributChange(index, e)}
                />
              </div>
            </td>

            <td>
              <input
                className="form-control form-control-sm"
                name="qmimi"
                type="number"
                min="0"
                step="0.01"
                value={atribut.qmimi}
                onChange={(e) => handleAtributChange(index, e)}
              />
            </td>

            <td>
              <input
                className="form-control form-control-sm"
                name="zbritja"
                type="number"
                min="0"
                value={atribut.zbritja}
                onChange={(e) => handleAtributChange(index, e)}
              />
            </td>

            <td>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => removeAtribut(index)}
              >
                ✕
              </button>
            </td>

          </tr>
        ))}
      </tbody>

    </table>
  )}
</div>
        <div className="text-end">
          <button className="btn btn-primary mt-3" type="submit">
            Krijo shërbimin
          </button>
        </div>

      </form>
    </div>
  );
}