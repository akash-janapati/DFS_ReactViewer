import React from 'react'
import './NavBar.css'

function NavBar(props) {

  function handleClick() {
    props.logout()
  }

  return (
    <div className='navbar'>
      <div id='ihub-logo' ></div>
      <p id='heading'>Data Anonymisation</p>
      <button id="logout-btn" onClick={handleClick}>Logout</button>
    </div>
  )
}

export default NavBar
