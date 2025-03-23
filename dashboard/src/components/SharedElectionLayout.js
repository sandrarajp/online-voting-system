import React from "react"
import { Outlet } from "react-router-dom"
import Footer from "./Footer"

export default function SharedElectionLayout() {
    return (
        <>
            <div style={{minHeight: "100vh"}}>
                <Outlet />
            </div>
            <Footer />
        </>
    )
}