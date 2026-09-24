import { useState, useEffect } from "react";
import { ExceptionHandler } from "../javascript/Exceptions/ExceptionHandler";
import "../css/profile.css";
import { updateUser } from "../javascript/API/UserAPI";

export function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    emri: "",
    mbiemri: "",
    username: "",
    userpassword: ""
  });

  useEffect(() => {
    try {
      const storedUser =
        sessionStorage.getItem("userDetails");

      if (storedUser) {
        const parsed = JSON.parse(storedUser);

        setUser(parsed);

        setForm({
          emri: parsed.emri || "",
          mbiemri: parsed.mbiemri || "",
          username: parsed.username || "",
          userpassword: ""
        });
      }
    } catch (err) {
      ExceptionHandler.handle(err);
    }
  }, []);

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="profile-spinner"></div>
        <span>Po ngarkohet profili...</span>
      </div>
    );
  }

  const handleUpdate = async () => {
    const confirmUpdate = window.confirm(
      "Dëshironi t'i ruani ndryshimet në profil?"
    );

    if (!confirmUpdate) return;

    try {
      const updatedUser = {
        ...user,
        emri: form.emri,
        mbiemri: form.mbiemri,
        username: form.username,
        ...(form.userpassword
          ? { userpassword: form.userpassword }
          : {})
      };

      await updateUser(updatedUser);

      setUser(updatedUser);

      sessionStorage.setItem(
        "userDetails",
        JSON.stringify(updatedUser)
      );

      setIsEditing(false);

      setForm((previous) => ({
        ...previous,
        userpassword: ""
      }));

    } catch (err) {
      ExceptionHandler.handle(err);
    }
  };

  const cancelEditing = () => {
    setForm({
      emri: user.emri || "",
      mbiemri: user.mbiemri || "",
      username: user.username || "",
      userpassword: ""
    });

    setIsEditing(false);
  };

  const getInitials = () => {
    const first =
      user.emri?.charAt(0)?.toUpperCase() || "";

    const last =
      user.mbiemri?.charAt(0)?.toUpperCase() || "";

    return `${first}${last}` || "A";
  };

  const renderField = (
    label,
    value,
    key,
    type = "text"
  ) => (
    <div className="profile-field">

      <label>{label}</label>

      {isEditing ? (
        <input
          type={type}
          className="profile-input"
          value={form[key]}
          placeholder={
            key === "userpassword"
              ? "Vendosni fjalëkalim të ri"
              : ""
          }
          onChange={(e) =>
            setForm({
              ...form,
              [key]: e.target.value
            })
          }
        />
      ) : (
        <div className="profile-field-value">
          {key === "username"
            ? `@${value}`
            : value || "N/A"}
        </div>
      )}

    </div>
  );

  return (
    <div className="profile-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="profile-header">

        <div className="profile-header-content">

          <span className="profile-eyebrow">
            LLOGARIA
          </span>

          <h1>Profili</h1>

          <p>
            Menaxhoni informacionin dhe të dhënat
            e llogarisë së administratorit.
          </p>

        </div>

        <div className="profile-header-actions">

          {isEditing ? (
            <>
              <button
                className="profile-button secondary"
                onClick={cancelEditing}
              >
                Anulo
              </button>

              <button
                className="profile-button primary"
                onClick={handleUpdate}
              >
                Ruaj ndryshimet
              </button>
            </>
          ) : (
            <button
              className="profile-button primary"
              onClick={() => setIsEditing(true)}
            >
              <svg viewBox="0 0 24 24">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5z" />
              </svg>

              Ndrysho profilin
            </button>
          )}

        </div>

      </header>


      {/* =====================================================
          PROFILE IDENTITY
      ===================================================== */}

      <section className="profile-identity-card">

        <div className="profile-avatar">
          {getInitials()}
        </div>

        <div className="profile-identity-info">

          {isEditing ? (
            <div className="profile-identity-edit">

              <input
                className="profile-input"
                value={form.emri}
                placeholder="Emri"
                onChange={(e) =>
                  setForm({
                    ...form,
                    emri: e.target.value
                  })
                }
              />

              <input
                className="profile-input"
                value={form.mbiemri}
                placeholder="Mbiemri"
                onChange={(e) =>
                  setForm({
                    ...form,
                    mbiemri: e.target.value
                  })
                }
              />

            </div>
          ) : (
            <>
              <h2>
                {user.emri} {user.mbiemri}
              </h2>

              <span>
                @{user.username}
              </span>
            </>
          )}

        </div>

        <div className="profile-account-status">

          <span className="status-dot"></span>

          <div>
            <strong>Llogari aktive</strong>
            <span>Administrator</span>
          </div>

        </div>

      </section>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="profile-grid">

        {/* PERSONAL INFORMATION */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div className="profile-card-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 21a7 7 0 0 1 14 0" />
              </svg>
            </div>

            <div>
              <h3>Informacion personal</h3>

              <p>
                Të dhënat bazë të profilit tuaj.
              </p>
            </div>

          </div>

          <div className="profile-fields">

            {renderField(
              "Emri",
              user.emri,
              "emri"
            )}

            {renderField(
              "Mbiemri",
              user.mbiemri,
              "mbiemri"
            )}

            {renderField(
              "Username",
              user.username,
              "username"
            )}

          </div>

        </section>


        {/* ACCOUNT */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div className="profile-card-icon">
              <svg viewBox="0 0 24 24">
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="3"
                />

                <path d="M8 9h8M8 13h5" />
              </svg>
            </div>

            <div>
              <h3>Detajet e llogarisë</h3>

              <p>
                Informacion rreth llogarisë suaj.
              </p>
            </div>

          </div>

          <div className="profile-fields">

            <div className="profile-field">

              <label>User ID</label>

              <div className="profile-field-value">
                {user.id ?? "N/A"}
              </div>

            </div>


            <div className="profile-field">

              <label>Statusi</label>

              <div className="profile-field-value">
                <span className="active-badge">
                  <span></span>
                  Aktiv
                </span>
              </div>

            </div>


            <div className="profile-field">

              <label>Regjistruar</label>

              <div className="profile-field-value">
                {user.dateRegistered ?? "N/A"}
              </div>

            </div>

          </div>

        </section>


        {/* SECURITY */}

        <section className="profile-card security-card">

          <div className="profile-card-header">

            <div className="profile-card-icon">
              <svg viewBox="0 0 24 24">
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="10"
                  rx="2"
                />

                <path d="M8 10V7a4 4 0 0 1 8 0v3" />

                <circle
                  cx="12"
                  cy="15"
                  r="1"
                />
              </svg>
            </div>

            <div>
              <h3>Siguria</h3>

              <p>
                Menaxhoni kredencialet e llogarisë.
              </p>
            </div>

          </div>

          {isEditing ? (
            <div className="profile-security-edit">

              {renderField(
                "Fjalëkalimi i ri",
                "",
                "userpassword",
                "password"
              )}

              <span className="security-hint">
                Lëreni bosh nëse nuk dëshironi
                ta ndryshoni fjalëkalimin.
              </span>

            </div>
          ) : (
            <div className="security-status">

              <div className="security-check">
                ✓
              </div>

              <div>
                <strong>
                  Fjalëkalimi është i mbrojtur
                </strong>

                <span>
                  Për të ndryshuar fjalëkalimin,
                  zgjidhni "Ndrysho profilin".
                </span>
              </div>

            </div>
          )}

        </section>

      </div>

    </div>
  );
}