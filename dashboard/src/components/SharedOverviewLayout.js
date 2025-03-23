import React from "react"
import { Outlet, useParams } from "react-router-dom"
import SideBar from "./SideBar"
import { useDispatch, useSelector } from "react-redux"
import { getBallotOverview } from "../features/overview/overviewSlice"
import NetworkError from "../pages/NetworkError"
import { Badge } from "react-bootstrap"
import { FaBars } from "react-icons/fa"
import Footer from "./Footer"

export default function SharedOverviewLayout() {
    const dispatch = useDispatch()
    const { ballotId } = useParams()
    const { loadingFailed, isLoading, ballotOverview } = useSelector(store => store.overview)
    React.useEffect(function () {
        dispatch(getBallotOverview(ballotId))
    }, [])

    if (isLoading) return (
        <section className="dashboard d-flex flex-row align-items-center justify-content-center">
            <div className="lds-hourglass"></div>
        </section>
    )

    if (loadingFailed) return (
        <NetworkError function={() => getBallotOverview(ballotId)} />
    )

    return (
        <div className="wrapper">
            <div className="section">
                <div className="nav bg-white pt-3 pb-3 border-bottom border-secondary border-opacity-25 d-flex align-items-center justify-content-center dashboard-nav">
                    <div className="hamburger container d-flex flex-row align-items-center justify-content-start" >
                        <div icon="bars" className="icon" onClick={function (event) {
                            document.querySelector("body").classList.toggle("active")
                        }}
                        >
                            <FaBars />
                        </div>
                        <div className="p-1 ms-2">
                            <span className="fw-bold fs-5 text-dark">{ballotOverview && ballotOverview.title}</span>
                            {
                                ballotOverview &&
                                <Badge className={
                                    ballotOverview.status === "building" ?
                                        "bg-secondary bg-opacity-10 border border-secondary text-secondary ms-2 fs-6" :
                                        ballotOverview.status === "running" ?
                                            "bg-success bg-opacity-10 border border-success text-success ms-2 fs-6" :
                                            "bg-primary bg-opacity-10 border border-primary text-primary ms-2 fs-6"
                                }
                                >
                                    {ballotOverview.status}
                                </Badge>
                            }
                        </div>
                    </div>
                </div>
                <div>
                    <div className="bg-light" style={{ minHeight: "100vh" }}>
                        <Outlet />
                    </div>
                    <Footer />
                </div>
            </div>
            <SideBar />
        </div>
    )
}