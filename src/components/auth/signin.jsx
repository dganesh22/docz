import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function SignIn(props) {
  const [user,setUser] = useState({
    email: '',
    mobile: '',
    password: ''
  })
  const [active,setActive] = useState("email") // state to handle toggle email and mobile inputs
  const navigate = useNavigate() // navigation instance

  // to toggler mobile and email inputs
  const setToggle = (val) => {
      if(val === "email") {
        setActive("email")
      } else {
        setActive("mobile")
      }
  }

  // input handler to read name and value 
  const readValue = (e) => {
      const { name, value } = e.target
      setUser({...user, [name]: value })
  }

  // submit handler
  const submitHandler = async (e) => {
    e.preventDefault()
      try {
         let data;
          if(active === "email") {
             data = {
                email: user.email,
                password: user.password
             }
          } else {
            data = {
               mobile: user.mobile,
               password: user.password
            }
          }
          // console.log('login data =', data);
          await axios.post(`/api/auth/signin`, data)
            .then(res => {
              toast.success(res.data.msg)
              localStorage.setItem('loginToken', res.data.authToken)
              localStorage.setItem('loginStatus', true)
              window.location.href = "/"
              navigate('/')
            }).catch(err => toast.error(err.response.data.msg))
      } catch (err) {
        toast.error(err)
      }
  }

  return (
    <div className='container'>
       <div className="row">
        <div className="col-md-12 text-center">
            <h3 className="display-3 text-primary">SignIn</h3>
        </div>
       </div>

       <div className="row">
        <div className="col-md-6 offset-md-3">
            <div className="card">
                <div className="card-body">
                    <form onSubmit={submitHandler} >
                        <section className="d-block">
                            <ul className="btn-group d-flex align-items-center">
                              <li className={active === "email"? "btn btn-primary" : "btn btn-secondary"}  onClick={() => setToggle('email')}>
                                  <span className="tab-link" >Email</span>
                              </li>
                              <li className={active === "mobile"? "btn btn-primary" : "btn btn-secondary"} onClick={() => setToggle('mobile')}>
                                  <span className="tab-link">Mobile</span>
                              </li>
                            </ul>
                            <main className="content">
                                {
                                    active === "email" ? ( 
                                    <div className="form-group mt-2">
                                      <label htmlFor="email">Email</label>
                                      <input type="email" name="email" value={user.email} onChange={readValue} id="email" className="form-control" required />
                                  </div> ) : (
                                    <div className="form-group mt-2">
                                      <label htmlFor="mobile">Mobile</label>
                                      <input type="number" name="mobile" value={user.mobile} onChange={readValue} id="mobile" className="form-control" required />
                                  </div>
                                  )
                                }
                            </main>
                        </section>
                        <div className="form-group mt-2">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" value={user.password} onChange={readValue} id="password" className="form-control" required />
                        </div>
                        <div className="form-group mt-2">
                              <input type="submit" value="SignIn" className="btn btn-success" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
       </div>
    </div>
  )
}

export default SignIn
