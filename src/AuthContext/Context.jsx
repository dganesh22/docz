import React, { createContext, useState, useEffect, useCallback  } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AuthContext = createContext()

function AuthProvider(props) {
    const [currentUser, setCurrentUser] = useState(null)
    const [token,setToken] = useState(false)
    const [pending,setPending] = useState(false)

    // role
    const [isAdmin,setIsAdmin] = useState(false)
    const [isUser,setIsUser] = useState(false)

    // login status 
    const loginStatus = JSON.parse(localStorage.getItem("loginStatus"))

    // to read the auth token
    const initAuth = useCallback(() => {
        const getAuth = async () => {
            const res = await axios.get(`/api/auth/signin/token`)
            //  console.log(`token =`, res.data)
            if(res.data.authToken) {
                setToken(res.data.authToken)
                await axios.get(`/api/auth/current/user`, {
                    headers: {
                        Authorization: `${res.data.authToken}`
                    }
                }).then(res => {
                    // console.log('user info ', res.data)
                    setCurrentUser(res.data.user)
                        if(res.data.user.role === "admin") {
                            setIsAdmin(true)
                        } else if (res.data.user.role === "user") {
                            setIsUser(true)
                        } else {
                            setIsAdmin(false)
                            setIsUser(false)
                        }
                }).catch(err => toast.error(err.response.data.msg))
            } else {
                setToken(false)
            }
        }

        getAuth()
    },[])

    useEffect(() => {
        if(loginStatus) {
            initAuth()
        }
    },[])


    return (
        <AuthContext.Provider value={{ currentUser, token, isAdmin, isUser }} >
                { props.children }
        </AuthContext.Provider>
    )
}

export default AuthProvider