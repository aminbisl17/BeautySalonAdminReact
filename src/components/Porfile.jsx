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
            {user.emri?.charAt(0) || "A"}
          </div>

          <div>
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
          <h6>Personal Information</h6>
          <p><b>First Name:</b> {user.emri}</p>
          <p><b>Last Name:</b> {user.mbiemri}</p>
          <p><b>Username:</b> @{user.username}</p>
        </div>

        <div className="profile-card">
          <h6>Account Details</h6>
          <p><b>User ID:</b> {user.id ?? "N/A"}</p>
          <p><b>Status:</b> Active</p>
          <p><b>Registered:</b> {user.dateRegistered ?? "N/A"}</p>
        </div>

      </div>

    </div>
  );
}