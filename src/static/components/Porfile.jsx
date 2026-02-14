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

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-card" id="profileCard">
      <div className="profile-header">
        <div className="profile-avatar">👤</div>
        <h2 id="profile-name">{user.emri} {user.mbiemri}</h2>
        <p id="profile-username">@{user.username}</p>
      </div>
      <div className="profile-info">
        <p><strong>Date Registered:</strong> {user.dateRegistered ?? "N/A"}</p>
      </div>
    </div>
  );
}