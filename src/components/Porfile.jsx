import { useState, useEffect } from "react";
import { ExceptionHandler } from "../javascript/Exceptions/ExceptionHandler";
import "../css/profile.css"

export function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("userDetails");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
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

  return (
  <div className="profile-page">

    {/* HEADER */}
    <div className="profile-header">

      <div className="profile-user">
        <div className="avatar">
          {user.emri?.charAt(0)?.toUpperCase() || "A"}
        </div>

        <div className="profile-user-info">
          <h5>{user.emri} {user.mbiemri}</h5>
          <span>@{user.username}</span>
        </div>
      </div>

      <div className="profile-badge">
        Admin Account
      </div>

    </div>

    {/* GRID */}
    <div className="profile-grid">

      <div className="profile-card">
        <h6>Informacion Personal</h6>

        <div className="profile-row">
          <span>Emri</span>
          <b>{user.emri}</b>
        </div>

        <div className="profile-row">
          <span>Mbiemri</span>
          <b>{user.mbiemri}</b>
        </div>

        <div className="profile-row">
          <span>Username</span>
          <b>@{user.username}</b>
        </div>
      </div>

      <div className="profile-card">
        <h6>Detajet e Llogarisë</h6>

        <div className="profile-row">
          <span>User ID</span>
          <b>{user.id ?? "N/A"}</b>
        </div>

        <div className="profile-row">
          <span>Statusi</span>
          <b className="status-active">Aktiv</b>
        </div>

        <div className="profile-row">
          <span>Regjistruar</span>
          <b>{user.dateRegistered ?? "N/A"}</b>
        </div>
      </div>

    </div>

  </div>
);
}