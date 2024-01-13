import React, { useContext } from 'react'
import "./App.css"
import { BrowserRouter, Route, Routes,Navigate } from 'react-router-dom'
import  { AuthContext } from './AuthContext/Context'
import AuthGaurd from './PrivateRoute/AuthGaurd'

import { ToastContainer } from 'react-toastify'

import Menu from './components/default/menu'
import Home from './components/default/home'
import SignIn from './components/auth/signin'
import SignUp from './components/auth/signup'
import Category from './components/default/category'
import Single from './components/default/single'
import Pnf from './components/util/pnf'
import AdminHome from './components/admin/adminHome'
import UserHome from './components/user/UserHome'
import Upload from './components/user/Upload'
import FileUpdate from './components/user/FileUpdate'

function App() {
  const context = useContext(AuthContext)
  const token = context.token
  const isUser = context.isUser
  const isAdmin = context.isAdmin

  return (
    <BrowserRouter>
          <Menu/>
          <ToastContainer autoClose={4000} position={'top-right'} />
          <Routes>
              <Route element={<AuthGaurd/>} >
                  <Route path={`/`} element={<Home/>} />
                  {
                     isAdmin && token ? (
                      <React.Fragment>
                            <Route path={`/admin/home`} element={<AdminHome/>} />
                            <Route path={`/admin/category`} element={<Category/>} />
                      </React.Fragment>
                     ) : null
                  }
                  {
                     isUser && token ? (
                      <React.Fragment>
                            <Route path={`/user/home`} element={<UserHome/>} />
                            <Route path={`/doc/upload`} element={<Upload/>} />
                            <Route path={`/single/:id`} element={<Single/>} />
                            <Route path={`/update/:id`} element={<FileUpdate/>} />
                      </React.Fragment>
                     ) : null
                  }
              </Route>

             
              <Route path={`/login`} element={token ? <Navigate to="/"/>: <SignIn/>} />
              <Route path={`/register`} element={token ? <Navigate to={"/"} />: <SignUp/> } />

              <Route path={`/*`} element={<Pnf/>} />
          </Routes>
    </BrowserRouter>
  )
}

export default App
