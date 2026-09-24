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
          process.env.REACT_APP_DASHBOARD_STATISTICS,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Server error: " + res.status);
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        ExceptionHandler.handle(err);
      }
    };

    load();
  }, []);

  if (!stats) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-spinner"></div>
        <span>Po ngarkohen të dhënat...</span>
      </div>
    );
  }

  /*
   * Demo/UI data.
   * Replace with real analytics data when the API is ready.
   */
  const monthlyData = [
    { month: "Jan", value: 42 },
    { month: "Shk", value: 28 },
    { month: "Mar", value: 55 },
    { month: "Pri", value: 38 },
    { month: "Maj", value: 70 },
    { month: "Qer", value: 62 },
    { month: "Kor", value: 85 },
    { month: "Gus", value: 78 },
    { month: "Sht", value: 95 },
    { month: "Tet", value: 88 },
    { month: "Nën", value: 110 },
    { month: "Dhj", value: 102 },
  ];

  const maxValue = Math.max(
    ...monthlyData.map((item) => item.value),
    1
  );

  const revenue = stats.services * 120;

  return (
    <div className="dashboard-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="dashboard-header">

        <div>
          <span className="dashboard-eyebrow">
            PËRMBLEDHJE
          </span>

          <h1>Dashboard</h1>

          <p>
            Pasqyra e përgjithshme e salonit tuaj.
          </p>
        </div>

        <div className="dashboard-date">
          <span className="dashboard-date-dot"></span>
          Sistemi aktiv
        </div>

      </header>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="dashboard-grid">

        {/* CLIENTS */}

        <div className="dashboard-card">

          <div className="dashboard-card-top">

            <div className="dashboard-card-icon clients-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="9" cy="8" r="3" />
                <path d="M3 20a6 6 0 0 1 12 0" />
                <path d="M16 5a3 3 0 0 1 0 6" />
                <path d="M18 14a5 5 0 0 1 3 4" />
              </svg>
            </div>

            <span className="dashboard-card-label">
              Klientë
            </span>

          </div>

          <div className="dashboard-card-value">
            {stats.clients?.toLocaleString() ?? 0}
          </div>

          <div className="dashboard-card-description">
            Klientë të regjistruar
          </div>

        </div>


        {/* EMPLOYEES */}

        <div className="dashboard-card">

          <div className="dashboard-card-top">

            <div className="dashboard-card-icon employees-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 21a7 7 0 0 1 14 0" />
              </svg>
            </div>

            <span className="dashboard-card-label">
              Stafi
            </span>

          </div>

          <div className="dashboard-card-value">
            {stats.employees?.toLocaleString() ?? 0}
          </div>

          <div className="dashboard-card-description">
            Anëtarë të stafit
          </div>

        </div>


        {/* SERVICES */}

        <div className="dashboard-card">

          <div className="dashboard-card-top">

            <div className="dashboard-card-icon services-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 3l2.1 5.9L20 11l-5.9 2.1L12 19l-2.1-5.9L4 11l5.9-2.1L12 3z" />
              </svg>
            </div>

            <span className="dashboard-card-label">
              Shërbime
            </span>

          </div>

          <div className="dashboard-card-value">
            {stats.services?.toLocaleString() ?? 0}
          </div>

          <div className="dashboard-card-description">
            Shërbime aktive
          </div>

        </div>


        {/* REVENUE */}

        <div className="dashboard-card">

          <div className="dashboard-card-top">

            <div className="dashboard-card-icon revenue-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v10" />
                <path d="M15 9.5c0-1.2-1.2-2-3-2s-3 .8-3 2 1.2 2 3 2 3 .8 3 2-1.2 2-3 2-3-.8-3-2" />
              </svg>
            </div>

            <span className="dashboard-card-label">
              Të ardhura
            </span>

          </div>

          <div className="dashboard-card-value revenue-value">
            € {revenue.toLocaleString()}
          </div>

          <div className="dashboard-card-description">
            Përllogaritje aktuale
          </div>

        </div>

      </section>


      {/* =====================================================
          ANALYTICS
      ===================================================== */}

      <section className="dashboard-analytics">

        <div className="analytics-header">

          <div>
            <h2>Aktiviteti mujor</h2>

            <p>
              Pasqyrë vizuale e aktivitetit gjatë vitit.
            </p>
          </div>

          <span className="demo-badge">
            DEMO
          </span>

        </div>


        <div className="chart-container">

          <div className="chart-y-axis">
            <span>{maxValue}</span>
            <span>{Math.round(maxValue * 0.75)}</span>
            <span>{Math.round(maxValue * 0.5)}</span>
            <span>{Math.round(maxValue * 0.25)}</span>
            <span>0</span>
          </div>


          <div className="chart-area">

            <div className="chart-grid-lines">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>


            <div className="chart-bars">

              {monthlyData.map((item, index) => {

                const height =
                  Math.max(
                    (item.value / maxValue) * 100,
                    5
                  );

                return (
                  <div
                    key={index}
                    className="chart-bar-wrapper"
                  >

                    <div className="chart-value">
                      {item.value}
                    </div>

                    <div className="chart-bar-track">

                      <div
                        className="chart-bar"
                        style={{
                          height: `${height}%`
                        }}
                      />

                    </div>

                    <span className="chart-month">
                      {item.month}
                    </span>

                  </div>
                );
              })}

            </div>

          </div>

        </div>

        <div className="chart-note">
          <span className="chart-note-dot"></span>
          Të dhënat e grafikut janë shembull për paraqitjen
          vizuale dhe mund të zëvendësohen me të dhëna reale.
        </div>

      </section>


      {/* =====================================================
          QUICK OVERVIEW
      ===================================================== */}

      <section className="dashboard-bottom-grid">

        <div className="dashboard-info-card">

          <div className="info-card-icon">
            ✓
          </div>

          <div>
            <h3>Paneli është aktiv</h3>

            <p>
              Të dhënat e salonit janë të disponueshme
              dhe sistemi është gati për menaxhim.
            </p>
          </div>

        </div>


        <div className="dashboard-info-card">

          <div className="info-card-icon">
            ✦
          </div>

          <div>
            <h3>Menaxhoni salonin</h3>

            <p>
              Përdorni menunë anësore për të menaxhuar
              stafin, shërbimet dhe profilin.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}