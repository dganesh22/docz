import React, { useState, useEffect, useCallback, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../../AuthContext/Context'
import { toast } from 'react-toastify'
import { NavLink, useNavigate } from 'react-router-dom'

function UserHome() {
  const [files,setFiles] = useState([])
  const context = useContext(AuthContext)
  const token = context.token
  const currentUser = context.currentUser
  const navigate = useNavigate()

  const readFiles = useCallback(() => {
      const getFiles = async () => {
          await axios.get(`/api/document/all`,{
            headers: {
              Authorization: `${token}`
            }
          }).then(res => {
              let filterd = res.data.files.filter(item => item.user_id === currentUser._id)
              setFiles(filterd)
          }).catch(err => toast.error(err.response.data.msg))
      }
      getFiles()
  }, [])

  useEffect(() => {
      readFiles()
  },[])

  if(files.length === 0) {
      return (
        <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                  <h3 className="display-3 text-secondary">No Files</h3>
              </div>
            </div>
        </div>
      )
  }

  // delete the file
  const deleteHandler = async (id, public_id) => {
      if(window.confirm(`Are you sure to delete the file?`)) {
          await axios.post(`/api/file/delete/${id}`, { public_id }, {
            headers: {
              Authorization: `${token}`
            }
          }).then(res => {
            toast.success(res.data.msg)
            deleteDocument(id)
          }).catch(err => toast.error(err.response.data.msg))
      } else {
        toast.warning('delete terminated')
      }
  }

  const deleteDocument = async (id) => {
    await axios.delete(`/api/document/delete/${id}`, {
      headers: {
        Authorization: `${token}`
      }
    }).then(res => {
        toast.success(res.data.msg)
        navigate(`/`)
    }).catch(err => toast.error(err.response.data.msg))
  }

  return (
    <div className='container'>
       <div className="row">
        <div className="col-md-12 text-center">
            <h3 className="display-3 text-primary">User Home</h3>
        </div>
       </div>

       <div className="row">
           {
              files && files.map((item,index) => {
                  return (
                    <div className="col-md-6 col-sm-12 col-lg-3 mt-2 mb-2" key={index}>
                        <div className="card">
                            <embed src={item.url} alt={item.title} className="card-img-top" height={250} />
                            <div className="card-body">
                                 <p className="badge bg-primary float-end"> {item.category} </p>
                                 <br/>
                                <h6 className="text-primary"> { item.title } </h6>
                            </div>
                            <div className="card-footer">
                              <NavLink target="_blank" to={item.url} className="btn btn-primary">View</NavLink>
                              <div className="btn-group float-end">
                                  <NavLink to={`/update/${item._id}`} className="btn btn-warning" title='Edit data'>
                                      <bi className="bi bi-pencil"></bi>
                                  </NavLink>
                                  <NavLink onClick={() => deleteHandler(item._id, item.public_id)} className="btn btn-danger" title='Delete data'>
                                      <bi className="bi bi-trash"></bi>
                                  </NavLink>
                              </div>
                            </div>
                        </div>
                    </div>
                  )
              })
           }
       </div>
    </div>
  )
}

export default UserHome
