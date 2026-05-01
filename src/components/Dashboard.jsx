import { useEffect, useState } from "react";
import { ExceptionHandler } from "../javascript/Exceptions/ExceptionHandler";
import "../css/dashboard.css";

export function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");

        const res = await fetch(
          "http://localhost:8000/api/admin/dashboard/statistics",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Server error: " + res.status);

        const data = await res.json();
        setStats(data);
      } catch (err) {
        ExceptionHandler.handle(err);
      }
    };

    load();
  }, []);

  if (!stats) return <div className="dashboard-loading">Loading...</div>;

  // fake data just for UI
const monthlyData = [
  { month: "Jan", value: 42 },
  { month: "Feb", value: 28 },
  { month: "Mar", value: 55 },
  { month: "Apr", value: 38 },
  { month: "May", value: 70 },
  { month: "Jun", value: 62 },
  { month: "Jul", value: 85 },
  { month: "Aug", value: 78 },
  { month: "Sep", value: 95 },
  { month: "Oct", value: 88 },
  { month: "Nov", value: 110 },
  { month: "Dec", value: 102 },
];

 const maxValue = Math.max(...monthlyData.map((d) => d.value), 1);

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p>System overview & performance analytics</p>
      </div>

      {/* STATS */}
      <div className="dashboard-grid">
        <div className="dashboard-card blue">
          <div className="card-title">Clients</div>
          <div className="card-value">{stats.clients}</div>
        </div>

        <div className="dashboard-card purple">
          <div className="card-title">Employees</div>
          <div className="card-value">{stats.employees}</div>
        </div>

        <div className="dashboard-card green">
          <div className="card-title">Services</div>
          <div className="card-value">{stats.services}</div>
        </div>

        <div className="dashboard-card orange">
          <div className="card-title">Revenue</div>
          <div className="card-value">
            $ {(stats.services * 120).toLocaleString()}
          </div>
        </div>
      </div>

      {/* FAKE CHART */}
      <div className="dashboard-chart">
  <h3>Monthly Activity</h3>

  <div className="chart-bars">
    {monthlyData.map((item, i) => (
      <div key={i} className="chart-bar-wrapper">
        <div
          className="chart-bar"
          style={{
            height: `${Math.max((item.value / maxValue) * 100, 6)}%`,
          }}
        />
        <span>{item.month}</span>
      </div>
    ))}
  </div>
</div>

    </div>
  );
}