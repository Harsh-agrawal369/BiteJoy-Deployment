import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img  src={assets.biteJoy_logo} />
            <p>At Bitejoy, we believe in bringing you the freshest and most delicious meals, made with the finest ingredients. Whether you're craving a hearty salad, a savory roll, or a sweet dessert, we have something to satisfy every palate. Join us on a culinary adventure and enjoy the joy of good food, delivered right to your doorstep.</p>
            <div className="footer-social-icons">
                <img src={assets.linkedin_icon} className='socials' />
                <img src={assets.github_icon} className='socials' />
                <img src={assets.gmail_icon} className='socials' />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+91 767-676-7676</li>
                <li>contact@Bitejoy.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">&copy; 2024 Bitejoy. All rights reserved.</p>
    </div>
  )
}

export default Footer
