import React from 'react'
import { NavLink } from 'react-router-dom'
import { PollerLogo } from './icons'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/ballots/ballotsSlice'
import { RiLogoutCircleLine, RiRocketLine } from "react-icons/ri"
import { BsPeople } from "react-icons/bs"
import { FaRegListAlt, FaRegEdit } from "react-icons/fa"
import { AiOutlineHome, AiOutlinePieChart } from "react-icons/ai"

export default function SideBar() {
    const dispatch = useDispatch()
    const { ballotOverview } = useSelector(store => store.overview)

    return (
        <div className='sidebar'>
            <div className='logo p-3 bg-info text-center'>
                <NavLink to="/dashboard">
                    <PollerLogo />
                </NavLink>
            </div>
            <div className='list-group-flush bg-transparent'>
                <NavLink to="" end className="list-group-item list-group-item-action p-3 sidebar-link" >
                    <div className="text-white d-flex flex-row justify-content-start align-items-center">
                        <AiOutlineHome />
                        <span className="text-white ms-2">Overview</span>
                    </div>
                </NavLink>


                <NavLink to="edit" className="list-group-item p-3 sidebar-link">
                    <div className="text-white d-flex flex-row justify-content-start align-items-center">
                        <FaRegEdit />
                        <span className="text-white ms-2">Edit</span>
                    </div>
                </NavLink>


                <NavLink to="ballot" className="list-group-item p-3 sidebar-link">
                    <div className="text-white d-flex flex-row justify-content-start align-items-center">
                        <FaRegListAlt />
                        <span className="text-white ms-2">Ballot</span>
                    </div>
                </NavLink>


                <NavLink to="voters" className="list-group-item p-3 sidebar-link">
                    <div className="text-white d-flex flex-row justify-content-start align-items-center">
                        <BsPeople />
                        <span className="text-white ms-2">Voters</span>
                    </div>
                </NavLink>


                {
                    ballotOverview === null ?
                        <NavLink to="launch" className="list-group-item p-3 sidebar-link">
                            <div className="text-white d-flex flex-row justify-content-start align-items-center">
                                <RiRocketLine />
                                <span className="text-white ms-2">Launch</span>
                            </div>
                        </NavLink>
                        : ballotOverview.status === "building" ?
                            <NavLink to="launch" className="list-group-item p-3 sidebar-link">
                                <div className="text-white d-flex flex-row justify-content-start align-items-center">
                                    <RiRocketLine />
                                    <span className="text-white ms-2">Launch</span>
                                </div>
                            </NavLink>
                            :
                            <NavLink to="results" className="list-group-item p-3 sidebar-link">
                                <div className="text-white d-flex flex-row justify-content-start align-items-center">
                                    <AiOutlinePieChart />
                                    <span className="text-white ms-2">Results</span>
                                </div>
                            </NavLink>
                }


                <div className="list-group-item p-3 sidebar-link" onClick={() => dispatch(logout())}>
                    <span className="text-white me-2"><RiLogoutCircleLine /></span>
                    <span className="text-white">Logout</span>
                </div>
            </div>
        </div>
    );
};

