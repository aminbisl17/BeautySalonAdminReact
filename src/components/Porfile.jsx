import { useState, useEffect } from "react";
import { ExceptionHandler } from "../javascript/Exceptions/ExceptionHandler";
import "../css/profile.css";
export function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("userDetails");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (Err) {
      ExceptionHandler.handle(Err);
    }
  }, []);

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
        <p className="mt-3">Loading profile...</p>
      </div>
    );
  }

 return (
  <div className="profile-page">

    {/* TOP HEADER */}
    <div className="profile-header-card">

      <div className="profile-user">
        <div className="avatar">
          👤
        </div>

        <div>
          <h4>
            {user.emri} {user.mbiemri}
          </h4>
          <small>@{user.username}</small>
        </div>
      </div>

      <span className="badge">Admin Profile</span>

    </div>

    {/* CONTENT */}
    <div className="profile-grid">

      {/* LEFT */}
      <div className="profile-card">
        <h6>Personal Info</h6>

        <p><b>First Name:</b> {user.emri}</p>
        <p><b>Last Name:</b> {user.mbiemri}</p>
        <p><b>Username:</b> @{user.username}</p>
      </div>

      {/* RIGHT */}
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