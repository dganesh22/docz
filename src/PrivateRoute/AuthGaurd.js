import React , { useState, useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext/Context'

function AuthGaurd(props) {
    const context = useContext(AuthContext)
    const token = context.token

    return (
        <React.Fragment>
                {
                    token ? <Outlet/> : <Navigate to={`/login`} />
                }
        </React.Fragment>
    )
}

export default AuthGaurd