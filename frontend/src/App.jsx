import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Cart from './pages/Cart/Cart'
import HomePage from './pages/HomePage/HomePage'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'

const App = () => {

  const [showLogin, setShowLogin] = useState(false);


  return (

    <>

    {showLogin ? <LoginPopup showLogin={showLogin} setShowLogin={setShowLogin}/> : <></>}

      <div className='app'>
      <Navbar showLogin={showLogin} setShowLogin={setShowLogin}/>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/placeorder' element={<PlaceOrder/>} />
        <Route path='/verify' element={<Verify/>} />
        <Route path='/myOrders' element={<MyOrders/>} />
      </Routes>
      </div>
      <Footer />
    </>
    
  )
}

export default App
