import React from "react";
import './Navbar.css'
import navlogo from '../../assets/logo.png';
import admin from '../../assets/admin.jpg'

const Navbar = () =>{
    return(
        <div className="navbar">
            <div className="logo-title">
                <img src={navlogo} alt="Logo" className="nav-logo" />
                <div>
                    <h1>UpTrend</h1>
                    <p className="admin-panel">Admin Panel</p>
                </div>
            </div>
            <img src={admin} alt="Admin" className="admin-image" />
        </div>
    )
}

export default Navbar
