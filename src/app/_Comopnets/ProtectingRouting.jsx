"use client"
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'



export default function ProtectingRouting({ children }) {
    const Path = usePathname()
    const Router = useRouter()

    useEffect(() => {
        if (localStorage.getItem("UserToken") == null) {
            if (Path !== "/Login" && Path !== "/Signin") {
                toast.error("Login Frist !");
                Router.replace("/Login")
            }
        }
    }, [Path])

    return (
        <div>
            {children}
        </div>
    )
}
