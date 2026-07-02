import React from 'react'
import Nav,{SideNav} from './Nav'
import { BrowserRouter as Router,Route ,Routes } from 'react-router-dom'
import FormBuilder from './pages/FormBuilder'
import Forms from './pages/Forms'
import Responses from './pages/Responses'
import Dashboard from './pages/Dashboard'

export default function main() {
  return (
     <>
    <Nav/>
    <div className='App_container'>
      <div>
        <SideNav/>
      </div>
      <div className='Right_side'>
        <Router>
          <Routes>
            <Route path='/' element={<Dashboard/>}  />
            <Route path='/Responses' element={<Responses/>}  />
            <Route path='/Forms' element={<Forms/>}  />
            <Route path='/FormBuilder' element={<FormBuilder/>}  />
          </Routes>
        </Router>
      </div>
    </div>
    </>
  )
}
