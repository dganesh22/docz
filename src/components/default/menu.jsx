import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AuthContext } from '../../AuthContext/Context'

function Menu(props) {
    const context = useContext(AuthContext)
    const token = context.token
    const isAdmin = context.isAdmin
    const isUser = context.isUser

    const navigate = useNavigate()

    const logoutUser = async () => {
        if(window.confirm(`Are you sure to logout?`)) {
                await axios.get(`/api/auth/signout`)
                    .then(res => {
                        toast.success(res.data.msg)
                        localStorage.removeItem('loginStatus')
                        localStorage.removeItem('loginToken')
                        window.location.reload()
                        navigate(`/`)
                    }).catch(err => toast.error(err.response.data.msg))
        }
    }
    

  return (
    <header className='mb-5'>
        <nav className="navbar navbar-expand-md navbar-dark bg-primary fixed-top">
            <div className="container">
                <NavLink to={`/`} className="navbar-brand">
                        <h4>
                        DocZ - <span className="text-warning">App</span>
                        </h4>
                </NavLink>

                <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#menu">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={token ? "collapse navbar-collapse d-md-flex justify-content-between": "collapse navbar-collapse d-md-flex justify-content-end"} id='menu'>
                   {
                        token ? (
                            <React.Fragment>
                                     <ul className="navbar-nav">
                                        <li className="nav-item">
                                            <NavLink to={`/`} className="nav-link">Home</NavLink>
                                        </li>
                                    </ul>
                                    <ul className="navbar-nav">
                                        {
                                            isUser && token ? (
                                                <React.Fragment>
                                                    <li className="nav-item dropdown">
                                                            <NavLink className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Account</NavLink>
                                                            <ul className="dropdown-menu">
                                                                <li>
                                                                    <NavLink to={`/user/home`} className="dropdown-item">
                                                                        User Dashboard
                                                                    </NavLink>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                </React.Fragment>
                                            ) : null 
                                        }
                                        {
                                            isAdmin && token ? (
                                                <React.Fragment>
                                                    <li className="nav-item dropdown">
                                                            <NavLink className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Account</NavLink>
                                                            <ul className="dropdown-menu">
                                                                <li>
                                                                    <NavLink to={`/admin/home`} className="dropdown-item">
                                                                        Admin Dashboard
                                                                    </NavLink>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                </React.Fragment>
                                            ) : null 
                                        }
                                        <li className="nav-item">
                                            <NavLink onClick={logoutUser} className="btn btn-danger nav-link">Logout</NavLink>
                                        </li>
                                    </ul>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                     <ul className="navbar-nav">
                                        <li className="nav-item">
                                            <NavLink to={`/login`} className="nav-link">SignIn</NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to={`/register`} className="nav-link">SignUp</NavLink>
                                        </li>
                                    </ul>
                            </React.Fragment>
                        )
                   }
                   
                </div>
            </div>
        </nav>
    </header>
  )
}

export default Menu
