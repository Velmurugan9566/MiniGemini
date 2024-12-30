import { useState } from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import './App.css'
import axios from 'axios'
import Home from './pages/Home.jsx';

function App() {
  
  return (
    <>
     <BrowserRouter>
     <Routes>
      <Route path='/' element={<Home/>}></Route>
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
