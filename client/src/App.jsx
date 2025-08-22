import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AuthForm from './components/AuthForm'
import { Routes,Route} from "react-router-dom"
import Navbar from './components/Navbar'
import Header from './components/Header'
import {Toaster} from "react-hot-toast"
import VerifyEmail from './components/VerifyEmail'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Toaster/>
      <Routes>
        <Route path='/' element={<Header/>}/>
        <Route path='login' element={<AuthForm/>}/>
        <Route path='/verify-email' element={<VerifyEmail/>}/>
      </Routes>
    </>
  )
}

export default App
