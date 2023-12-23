import React, { useEffect, useState, useCallback, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AuthContext } from '../../AuthContext/Context'
import { useNavigate, NavLink } from 'react-router-dom'

function Category() {
  const context = useContext(AuthContext)
  const token = context.token
  const [category,setCategory] = useState([])

  // state
  const [title,setTitle] = useState('')
  const [isEdit,setIsEdit] = useState(false)
  const [editId,setEditId] = useState('')

  const readCategory = useCallback(() => {
    const getData = async () => {
      await axios.get(`/api/category/all`, {
          headers: {
            Authorization: `${token}`
          }
      }).then(res => {
        setCategory(res.data.categories)
      }).catch(err => toast.error(err.response.data.msg))
    }
    getData()
  },[])

  useEffect(() => {
    readCategory()
  },[])

  
  const newHandler = () => {
    setTitle('')
    setIsEdit(false)
  }

  const createCategory = async (e) => {
    e.preventDefault();
      try {
         await axios.post(`/api/category/add`, { title }, {
            headers: {
              Authorization: `${token}`
            }
         }).then(res => {
          toast.success(res.data.msg)
          window.location.reload()
         }).catch(err => toast.error(err.response.data.msg))
      } catch (err) {
        toast.success(err)
      }
  }

  const editHandler = (id) => {
       setIsEdit(true)
       let single = category.find(item => item._id === id)
       setTitle(single.title)
       setEditId(id)
  }


  const updateCategory = async (e) => {
    e.preventDefault()
    try {
      await axios.patch(`/api/category/update/${editId}`, { title }, {
         headers: {
           Authorization: `${token}`
         }
      }).then(res => {
       toast.success(res.data.msg)
       setTitle('')
       setIsEdit(false)
       setEditId('')
       window.location.reload()
      }).catch(err => toast.error(err.response.data.msg))
   } catch (err) {
     toast.success(err)
   }
  }

  const deleteHandler = async (id) => {
      if(window.confirm(`Are you sure to delete category?`)) {
          await axios.delete(`/api/category/delete/${id}`, {
              headers: {
                Authorization: `${token}`
              }
          }).then(res => {
              toast.success(res.data.msg)
              window.location.reload()
          }).catch(err => toast.error(err.response.data.msg))
      }
  }

  return (
    <div className='container'>
       <div className="row">
        <div className="col-md-12 text-center">
            <h3 className="display-3 text-primary">Category</h3>
        </div>
       </div>
       <div className="row">
          <div className="col-md-12">
              <div className="table-responsive">
                  <table className="table table-bordered table-striped table-hovered text-center">
                      <thead>
                        <tr>
                            <th colSpan={3}> 
                            <NavLink data-bs-toggle='modal' data-bs-target="#newCat" className="btn btn-primary float-end">Create New</NavLink> </th>
                        </tr>
                        <tr>
                          <th>Title</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                            category && category.map((item,index) => {
                              return (
                                  <tr key={index}>
                                    <td> { item.title } </td>
                                    <td> { item.isActive? "Active": "In Active"} </td>
                                    <td>
                                        <NavLink data-bs-toggle='modal' data-bs-target="#newCat" onClick={() => editHandler(item._id)} className="btn btn-info">
                                          <i className="bi bi-pencil"></i>
                                        </NavLink>

                                        <button onClick={() => deleteHandler(item._id)} className="btn btn-danger float-end">
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                  </tr>
                              )
                            })
                        }
                      </tbody>
                  </table>
              </div>
          </div>
       </div>

       {/* create category modal */}
       <div className="modal fade" id="newCat" tabIndex={"-1"}>
            <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                              <h1 className="modal-title fs-5">
                                  { isEdit ? "Update Category" : "Create Category"}
                              </h1>
                              <button type='button' className="btn-close" data-bs-dismiss="modal" onClick={newHandler} ></button>
                            </div>
                            <div className="modal-body"> 
                                <form autoComplete="off" onSubmit={isEdit ? updateCategory: createCategory} >
                                    <div className="form-group mt-2">
                                        <label htmlFor="title">Title</label>
                                        <input type="text" name="title" id='title' value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" required />
                                    </div>
                                    
                                    <div className="form-group mt-2">
                                      <input type="submit" value={isEdit ? "Update Category": "Add Category"}  className="btn btn-success" data-bs-dismiss="modal" />
                                    </div>
                                </form>
                            </div>
                        </div>
              </div>
        </div>{/* modal end */}
    </div>
  )
}

export default Category
