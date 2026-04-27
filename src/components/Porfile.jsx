import { useState, useEffect } from "react";
import { ExceptionHandler } from "../javascript/Exceptions/ExceptionHandler";

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
    <div className="container-fluid py-4">

      {/* TOP HEADER */}
      <div className="bg-white border rounded shadow-sm p-4 mb-4 d-flex align-items-center justify-content-between">

        <div className="d-flex align-items-center gap-3">

          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
            style={{ width: "80px", height: "80px", fontSize: "32px" }}
          >
            👤
          </div>

          <div>
            <h4 className="mb-0">
              {user.emri} {user.mbiemri}
            </h4>
            <small className="text-muted">
              @{user.username}
            </small>
          </div>

        </div>

        <span className="badge bg-primary px-3 py-2">
          Admin Profile
        </span>

      </div>

      {/* CONTENT */}
      <div className="row g-4">

        {/* LEFT PANEL */}
        <div className="col-md-4">

          <div className="bg-white border rounded shadow-sm p-4 h-100">

            <h6 className="text-uppercase text-muted mb-3">
              Personal Info
            </h6>

            <div className="mb-3">
              <small className="text-muted">First Name</small>
              <div className="fw-semibold">{user.emri}</div>
            </div>

            <div className="mb-3">
              <small className="text-muted">Last Name</small>
              <div className="fw-semibold">{user.mbiemri}</div>
            </div>

            <div className="mb-3">
              <small className="text-muted">Username</small>
              <div className="fw-semibold">@{user.username}</div>
            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="col-md-8">

          <div className="bg-white border rounded shadow-sm p-4 h-100">

            <h6 className="text-uppercase text-muted mb-3">
              Account Details
            </h6>

            <div className="row g-3">

              <div className="col-md-6">
                <div className="p-3 bg-light rounded">
                  <small className="text-muted">User ID</small>
                  <div className="fw-semibold">{user.id ?? "N/A"}</div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3 bg-light rounded">
                  <small className="text-muted">Status</small>
                  <div className="fw-semibold text-success">Active</div>
                </div>
              </div>

              <div className="col-12">
                <div className="p-3 bg-light rounded">
                  <small className="text-muted">Registered Date</small>
                  <div className="fw-semibold">
                    {user.dateRegistered ?? "N/A"}
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}