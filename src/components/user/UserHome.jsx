import React, { useState, useEffect, useCallback, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../../AuthContext/Context'
import { toast } from 'react-toastify'

function UserHome() {
  const [files,setFiles] = useState([])
  const context = useContext(AuthContext)
  const token = context.token
  const currentUser = context.currentUser

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
                    <div className="col-md-3 mt-2 mb-2" key={index}>
                        <div className="card">
                            <embed src={item.url} alt={item.title} className="card-img-top" />
                            <div className="card-body">
                                 <p className="badge bg-primary float-end"> {item.category} </p>
                                 <br />
                                <h6 className="text-primary"> { item.title } </h6>
                            </div>
                            <div className="card-footer">
                              <a target="_blank" href={item.url} className="btn btn-primary">View</a>
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
