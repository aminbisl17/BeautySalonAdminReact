import '../css/home.css';

function SideBar(){
    return(
        <body>
      <div class="mobile-menu-btn">☰</div>

<div class="sidebar">
   
            <button id="profile">
                <span class="icon">👤</span>
                <span class="text">Profili</span>
            </button>
        

        
            <button id="dashboard">
                <span class="icon">📊</span>
                <span class="text">Dashboard</span>
            </button>
        

        
            <button id="employees">
                <span class="icon">🏠</span>
                <span class="text">Stafi</span>
            </button>
        
            <button id="services">
                <span class="icon">🔧</span>
                <span class="text">Sherbimet</span>
            </button>
       
    
</div>
</body>
    );
}

export default SideBar;