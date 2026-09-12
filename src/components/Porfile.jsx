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
      const storedUser = sessionStorage.getItem("userDetails");

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
        <div className="spinner-border text-primary" />
        <p>Loading profile...</p>
      </div>
    );
  }

  const handleUpdate = async () => {
    const confirmUpdate = window.confirm(
      "Are you sure you want to update your profile?"
    );

    if (!confirmUpdate) {
      return;
    }

    try {
      const updatedUser = {
        ...user,
        emri: form.emri,
        mbiemri: form.mbiemri,
        username: form.username,
        ...(form.userpassword ? { userpassword: form.userpassword } : {})
      };

      await updateUser(updatedUser);

      setUser(updatedUser);
      sessionStorage.setItem("userDetails", JSON.stringify(updatedUser));

      setIsEditing(false);
    } catch (err) {
      ExceptionHandler.handle(err);
    }
  };

  const renderField = (label, value, key, type = "text") => (
    <div className="profile-row">
      <span className="profile-row-label">{label}</span>

      {isEditing ? (
        <input
          type={type}
          className="form-control profile-input"
          value={form[key]}
          onChange={(e) =>
            setForm({ ...form, [key]: e.target.value })
          }
        />
      ) : (
        <b className="profile-value">
          {key === "username" ? `@${value}` : value}
        </b>
      )}
    </div>
  );

  // ---------------- UI ----------------
  return (
    <div className="profile-page">
      {/* HEADER */}
      <div className="profile-header">
        <div className="profile-user">
          <div className="avatar">
            {user.emri?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <div className="profile-user-info">
            {isEditing ? (
              <div className="profile-user-inputs">
                <input
                  className="form-control profile-input mb-2"
                  placeholder="Emri"
                  value={form.emri}
                  onChange={(e) =>
                    setForm({ ...form, emri: e.target.value })
                  }
                />

                <input
                  className="form-control profile-input"
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
              </div>
            ) : (
              <>
                <h5>
                  {user.emri} {user.mbiemri}
                </h5>
                <span>@{user.username}</span>
              </>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="profile-actions">
          {isEditing ? (
            <div className="profile-actions-group">
              <button
                className="btn btn-success btn-sm profile-btn"
                onClick={handleUpdate}
              >
                Save Changes
              </button>

              <button
                className="btn btn-outline-secondary btn-sm profile-btn"
                onClick={() => {
                  setForm({
                    emri: user.emri,
                    mbiemri: user.mbiemri,
                    username: user.username,
                    userpassword: ""
                  });
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-sm profile-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* GRID */}
      <div className="profile-grid">
        {/* PERSONAL INFO */}
        <div className="profile-card">
          <h6>Informacion Personal</h6>

          {renderField("Emri", user.emri, "emri")}
          {renderField("Mbiemri", user.mbiemri, "mbiemri")}
          {renderField("Username", user.username, "username")}

          {isEditing &&
            renderField(
              "Password",
              "",
              "userpassword",
              "password"
            )}
        </div>

        {/* ACCOUNT DETAILS */}
        <div className="profile-card">
          <h6>Detajet e Llogarisë</h6>

          <div className="profile-row">
            <span className="profile-row-label">User ID</span>
            <b className="profile-value">{user.id ?? "N/A"}</b>
          </div>

          <div className="profile-row">
            <span className="profile-row-label">Statusi</span>
            <b className="profile-value status-active">Aktiv</b>
          </div>

          <div className="profile-row">
            <span className="profile-row-label">Regjistruar</span>
            <b className="profile-value">{user.dateRegistered ?? "N/A"}</b>
          </div>
        </div>
      </div>
    </div>
  );
}