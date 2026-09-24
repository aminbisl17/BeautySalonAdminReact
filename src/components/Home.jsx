import { useState } from "react";
import {
  EmployeesTable,
  Employees,
  RegisterEmployee
} from "./Employees";
import {
  ServiceTable,
  ViewService,
  RegisterService
} from "./Services";
import { Dashboard } from "./Dashboard";
import "../css/home.css";
import { Profile } from "./Porfile";
import { useNavigate } from "react-router-dom";

/* =========================================================
   ICONS
========================================================= */

const Icons = {
  profile: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),

  dashboard: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),

  employees: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 4a3 3 0 0 1 0 6" />
      <path d="M18 14a5 5 0 0 1 3 4" />
    </svg>
  ),

  services: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3z" />
      <path d="M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17z" />
    </svg>
  ),

  logout: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
    </svg>
  ),

  menu: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),

  close: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
};

/* =========================================================
   SIDEBAR
========================================================= */

function SideBar({
  setActivePage,
  activePage,
  isOpen,
  closeMenu
}) {
  const handlePageSelect = (page) => {
    setActivePage(page);
    closeMenu();
  };

  const navigation = [
    {
      id: "profile",
      label: "Profili",
      icon: Icons.profile
    },
    {
      id: "dashboard",
      label: "Raportet",
      icon: Icons.dashboard
    },
    {
      id: "employees",
      label: "Stafi",
      icon: Icons.employees
    },
    {
      id: "services",
      label: "Shërbimet",
      icon: Icons.services
    }
  ];

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMenu}
        />
      )}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>

        <div className="sidebar-brand">
          <div className="brand-mark">
            S
          </div>

          <div className="brand-text">
            <strong>BeautySalon</strong>
            <span>Management</span>
          </div>
        </div>

        <div className="sidebar-section-title">
          MENAXHIMI
        </div>

        <nav className="sidebar-navigation">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={
                activePage === item.id
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
              onClick={() => handlePageSelect(item.id)}
            >
              <span className="sidebar-icon">
                {item.icon}
              </span>

              <span className="sidebar-label">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-status">
            <span className="status-dot"></span>

            <div>
              <strong>Sistemi aktiv</strong>
              <span>Gjithçka funksionon</span>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
}

/* =========================================================
   TOP BAR
========================================================= */

function TopBar({
  onToggleMenu,
  isMenuOpen
}) {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    const confirmLogout = window.confirm(
      "Dëshironi të dilni?"
    );

    if (!confirmLogout) return;

    try {
      const API =
        process.env.REACT_APP_DELETE_REFRESH_TOKEN;

      const rest = await fetch(API, {
        method: "POST",
        credentials: "include"
      });

      if (rest.ok) {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("userDetails");

        navigate("/");
      }
    } catch (err) {
      alert("Couldn't reach server!");
    }
  };

  return (
    <header className="topbar">

      <div className="topbar-left">

        <button
          className="menu-toggle-btn"
          onClick={onToggleMenu}
          aria-label="Toggle navigation"
        >
          {isMenuOpen
            ? Icons.close
            : Icons.menu}
        </button>

        <div className="topbar-heading">
          <span className="topbar-eyebrow">
            ADMIN
          </span>

          <span className="topbar-title">
            Paneli i administratorit
          </span>
        </div>

      </div>

      <div className="topbar-right">

        <div className="admin-status">
          <span className="admin-status-dot"></span>
          <span>Online</span>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogOut}
        >
          <span className="logout-icon">
            {Icons.logout}
          </span>

          <span>Dilni</span>
        </button>

      </div>

    </header>
  );
}

/* =========================================================
   HOME
========================================================= */

function Home() {
  const [activePage, setActivePage] =
    useState("profile");

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [selectedService, setSelectedService] =
    useState(null);

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const toggleMenu = () =>
    setIsMenuOpen(!isMenuOpen);

  const closeMenu = () =>
    setIsMenuOpen(false);

  const handleSelectEmployee = (emp) => {
    setSelectedEmployee(emp);
    setActivePage("employeeProfile");
  };

  const handleDeletedEmployee = () => {
    setActivePage("employees");
  };

  const handleSelectedService = (service) => {
    setSelectedService(service);
    setActivePage("service");
  };

  const handleRegisteredOrDeletedService = () => {
    setActivePage("services");
  };

  function renderPage() {
    switch (activePage) {

      case "profile":
        return <Profile />;

      case "dashboard":
        return <Dashboard />;

      case "employees":
        return (
          <EmployeesTable
            onSelect={handleSelectEmployee}
            onRegister={() =>
              setActivePage("employeeRegister")
            }
          />
        );

      case "employeeProfile":
        return selectedEmployee ? (
          <Employees
            emp={selectedEmployee}
            onDelete={handleDeletedEmployee}
          />
        ) : (
          <h2>No employee selected</h2>
        );

      case "employeeRegister":
        return <RegisterEmployee />;

      case "services":
        return (
          <ServiceTable
            onSelect={handleSelectedService}
            onRegister={() =>
              setActivePage("registerService")
            }
          />
        );

      case "service":
        return (
          <ViewService
            service={selectedService}
            onDelete={
              handleRegisteredOrDeletedService
            }
          />
        );

      case "registerService":
        return (
          <RegisterService
            onRegister={
              handleRegisteredOrDeletedService
            }
          />
        );

      default:
        return <h2>Page not found</h2>;
    }
  }

  return (
    <div className="admin-app">

      <TopBar
        onToggleMenu={toggleMenu}
        isMenuOpen={isMenuOpen}
      />

      <div className="layout">

        <SideBar
          setActivePage={setActivePage}
          activePage={activePage}
          isOpen={isMenuOpen}
          closeMenu={closeMenu}
        />

        <main className="center-content">
          {renderPage()}
        </main>

      </div>

    </div>
  );
}

export default Home;