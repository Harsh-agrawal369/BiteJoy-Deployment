import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';

const Navbar = ({showLogin, setShowLogin}) => {

  const [menu, setMenu] = useState("home");

  const {getTotalCartAmount, token, setToken, name, setName, setCartItems} = useContext(StoreContext);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setToken("");
    setName("");
    setCartItems({});
    navigate("/");
  }


  return (
    <div className='navbar'>
      <Link to='/' ><img src={assets.biteJoy_logo} alt="" className="logo" /></Link> 
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active":""}>Home</Link>
        <a  href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu"? "active" : ""}>Menu</a>
        {/* <li onClick={() => setMenu("mobile-app")} className={menu === "mobile-app"? "active" : ""}>Mobile-app</li> */}
        <a  href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us"? "active" : ""}>Contact Us</a>
      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt="" className="search" />
        <div className="navbar-search-icon">
          <Link to='/Cart'><img src={assets.basket_icon}></img></Link> 
          <div className={getTotalCartAmount() ? "dot" : ""}></div>
        </div>

        {!token ? <button onClick={() => {setShowLogin(true)}}>Sign-In</button> : 
          
          <>
          <p className='user-name'>{name}</p>
          <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className='nav-profile-dropdown'>
              <li onClick={() => navigate('/myorders')}> <img src={assets.bag_icon} alt="" /><p>Orders</p></li>
              <hr/>
              <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
            </ul>
          </div>
          </>
        }
        
      </div>
    </div>
  )
}

export default Navbar
