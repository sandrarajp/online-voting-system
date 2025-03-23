import React from "react"
import SharedLayout from "./components/SharedLayout"
import SharedOverviewLayout from "./components/SharedOverviewLayout"
import SharedElectionLayout from "./components/SharedElectionLayout"
import Dashboard from "./pages/Dashboard"
import Overview from "./pages/Overview"
import Edit from "./pages/Edit"
import Ballot from "./pages/Ballot"
import Voters from "./pages/Voters"
import Launch from "./pages/Launch"
import Results from "./pages/Results"
import VoterLogin from "./pages/VoterLogin"
import CastBallot from "./pages/CastBallot"
import ProtectedRoute from "./components/ProtectedRoute"
import ElectionResults from "./pages/ElectionResults"
import { BrowserRouter, Routes, Route } from "react-router-dom"

export default function App() {


    return (
        <BrowserRouter>
            <Routes>

                <Route path="dashboard/" element={<SharedLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="overview/:ballotId/" element={<SharedOverviewLayout />} >
                        <Route index element={<Overview />} />
                        <Route path="edit" element={<Edit />} />
                        <Route path="ballot" element={<Ballot />} />
                        <Route path="voters" element={<Voters />} />
                        <Route path="launch" element={<Launch />} />
                        <Route path="results" element={<Results />} />
                    </Route>
                </Route>

                <Route path="election/:ballotId" element={<SharedElectionLayout />} >
                    <Route index element={<VoterLogin />} />
                    <Route path="ballot" element={
                        <ProtectedRoute>
                            <CastBallot />
                        </ProtectedRoute>
                    } />
                    <Route path="results" element={<ElectionResults />} />
                </Route>

            </Routes>
        </BrowserRouter>
    )
}