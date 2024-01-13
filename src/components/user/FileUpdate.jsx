import React, { useState, useEffect, useCallback, useContext } from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'
import { AuthContext } from '../../AuthContext/Context'
import { useParams, useNavigate } from 'react-router-dom'

function FileUpdate(props) {
    const [category,setCategory] = useState([])
    const [image,setImage] = useState(false)
    const [data,setData] = useState({
        title: "",
        desc: "",
        url: "",
        public_id: "",
        category: ""
    })
    const context = useContext(AuthContext)
    const token = context.token
    const currentUser = context.currentUser
    const params = useParams()
    const navigate = useNavigate()

    const readFile = useCallback(() => {
        const readData = async () => {
            const res = await axios.get(`/api/document/single/${params.id}`, {
                headers: {
                    Authorization: `${token}`
                }
            })

            setData(res.data.file)
            setImage({
                url: res.data.file.url,
                public_id: res.data.file.public_id
            })
        }
        readData()
    },[])

    const readCategory = useCallback(() => {
        const readData = async () => {
            const res = await axios.get(`/api/category/all`,{
                headers: {
                    "Authorization": `${token}`
                }
            })
            setCategory(res.data.categories)
        }
        readData()
    },[])

    useEffect(() => {
        readCategory()
        readFile()
        setData({ user_id: currentUser._id})
    },[])

    // read data function
    const readValue = (e) => {
        const { name, value } = e.target
        setData({...data, [name]:value })
    }

    // for file uploading
    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            const file = e.target.files[0];
                // console.log(`file data =`, file);
            if(!file) 
                return toast.error('file not exists..choose file to upload')

                let formData = new FormData()
                formData.append('myFile', file)

                // post the image to cloudinary
                 await axios.post(`/api/file/upload`,formData, { 
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `${token}`
                    }
                }).then(res => {
                    toast.success("File uploaded successfully")
                    setImage(res.data.result)
                    setData({ 
                        url: res.data.result.secure_url,
                        public_id: res.data.result.public_id
                    })
                }).catch(err => toast.error(err.response.data.msg))
                
        } catch (err) {
            toast.error(err.response.data.msg)
        }
    }

    // submit handler 
    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            let finaldata = {
                ...data,
                user_id: currentUser._id
            }
            await axios.patch(`/api/document/update/${params.id}`, finaldata, {
                headers: {
                    Authorization: `${token}`
                }
            }).then(res => {
                toast.success(res.data.msg)
                window.location.href = "/"
            }).catch(err => toast.error(err.response.data.msg))
        } catch (err) {
            toast.error(err.response.data.msg)
        }
    }

    const deleteImage = async (public_id) => {
        if(window.confirm(`Are you sure to delete an image?`)) {
            await axios.post(`/api/file/delete/${params.id}`, { public_id }, {
                headers: {
                  Authorization: `${token}`
                }
              }).then(res => {
                toast.success(res.data.msg)
                setImage(false)
              }).catch(err => toast.error(err.response.data.msg))
          } else {
            toast.warning('delete terminated')
          }
    }

  return (
    <div className='container'>
        <div className="row">
            <div className="col-md-12 mt-5 text-center">
                <h4 className="display-5 text-primary">Edit the File</h4>
                <p className="text-secondary">
                    Update file content
                </p>
            </div>
        </div>
        <div className="row">
            <div className="col-md-12">
                
                    <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-12 mt-4">
                           <div className="card">
                                {
                                    image ? (
                                        <div className="image-btn">
                                            <img src={image.url} alt="no image" className="card-img-top" />
                                            <button onClick={() => deleteImage(image.public_id)} className="btn btn-danger">
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    ): (
                                        <div className="card-body">
                                            <div className="form-group mt-2 mb-2 fileBox">
                                                <label htmlFor="myFile"> <i className="bi bi-upload"></i> Upload File</label>
                                                <input type="file" name="myFile" id="myFile" className="form-control" onChange={handleUpload} required />
                                            </div>
                                        </div>
                                    )
                                }
                           </div>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-12 mt-4 mb-5">
                        <form autoComplete="off" method='post' onSubmit={submitHandler} >
                            <div className="card">
                                <div className="card-body">
                                    <div className="form-control mt-2">
                                        <label htmlFor="title">File Title</label>
                                        <input type="text" name="title" id="title" value={data.title} onChange={readValue} className="form-control" placeholder='Enter file title' required />
                                    </div>
                                    <div className="form-group mt-2">
                                        <label htmlFor="desc">File Description</label>
                                        <input type="text" name="desc" id="desc" value={data.desc} onChange={readValue} className="form-control" placeholder='Enter file description' required />
                                    </div>
                                    <div className="form-group mt-2">
                                        <label htmlFor="url">File Url</label>
                                        <input type="url" name="url" id="url" value={data.url} onChange={readValue} className="form-control" placeholder="https://sample.com/jpeg/value.png" readOnly required />
                                    </div>
                                    <div className="form-group mt-2">
                                        <label htmlFor="public_id">Public Id</label>
                                        <input type="text" name="public_id" id="public_id" value={data.public_id} onChange={readValue} className="form-control" placeholder="Enter public id" readOnly required />
                                    </div>

                                    <div className="form-group mt-2">
                                        <label htmlFor="category">Category</label>
                                        <select name="category" id="category" value={data.category} onChange={readValue} className="form-control" required>
                                            <option value="null">Choose Category</option>
                                            {
                                                category && category.map((item,index) => {
                                                    return (
                                                        <option key={index}> {item.title} </option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group mt-2">
                                        <input type="submit" value="Update File" className="btn btn-success" />
                                    </div>
                                </div>
                            </div>
                        </form>
                        </div>
                    </div>
                
            </div>
        </div>
    </div>
  )
}

export default FileUpdate
