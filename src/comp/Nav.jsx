import React from 'react'
import "./styles/Nav.css"
// import { Link } from 'react-router-dom'
export default function Nav() {
  return (
<>
<div className="Nav_container">
<div className='Nav_logo'>
    <img src={require("./images/company logo.png")} alt="Company logo" />
</div>
<div className='Nav_link'>

    <a href="/">Dashboard</a>
    <a href="/FormBuilder">Form Builder</a>
    <a href="/Forms">Forms</a>
    <a href="/Responses">Responses</a>
</div>
<div className='profile_section'>
<img className='Nav-profile-section1' src={require("./images/bell.png")} alt="Profile section"  />
<img className='Nav-profile-section2' src={require("./images/settings.png")} alt="Profile section"  />
<img className='Nav-profile-section3' src={require("./images/Rahul.jpg")} alt="Profile section"  />

</div>

</div>
</>
)
}

export const SideNav=()=>{
    return(
        <>
        <div className="Sidenav_container">
            <div className='Side_nav_top'>

            <div><img src={require("./images/home.png")} alt="Side navigation"  /><label>Dashborad</label></div>
            <div><img src={require("./images/pen-tool.png")} alt="Side navigation"  /><label>Form Builder</label></div>
            <div><img src={require("./images/view.png")} alt="Side navigation"  /><label>Form Preview</label></div>
            <div><img src={require("./images/credit-card.png")} alt="Side navigation"  /><label>Payment Integration</label></div>
            <div><img src={require("./images/social-responsibility.png")} alt="Side navigation"  /><label>Responses</label></div>
            </div>
            <div className='Side_nav_down'>


            </div>
        </div>
        </>
    );
}

