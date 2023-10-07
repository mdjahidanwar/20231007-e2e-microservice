import React, { useState } from 'react';
import Aside from './Aside';
import {FaBars } from 'react-icons/fa';
import Cookies from 'js-cookie';
function Layout({children}) {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const handleCollapsedChange = () => {
    setCollapsed(!collapsed);
  };


  const handleToggleSidebar = () => {
    setToggled(!toggled);
  };

  const logout=()=>{
    Cookies.remove("ecom");
      window.location.pathname='/login'
  }

  return (
    <div className={`app ${toggled ? 'toggled' : ''}`}>
      <Aside
        image={false}
        collapsed={collapsed}
        rtl={false}
        toggled={toggled}
        handleToggleSidebar={handleToggleSidebar}
      />
     
      <div className='main_layout'>
      <div className='appbar'>
          <div className="appbar_container">
          <div className="collapse_icon toggle" onClick={() => handleToggleSidebar()}>
            <FaBars />
          </div>
          <div className="collapse_icon collapse" onClick={() => handleCollapsedChange()}>
            <FaBars />
          </div>
          <button onClick={()=>logout()}>Logout</button>
          </div>
          
        </div>

<div className="main_container">
{children}
</div>




      </div>
    </div>
  );
}

export default Layout;
