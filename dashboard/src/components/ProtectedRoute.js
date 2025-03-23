import React from "react"
import { useSelector } from "react-redux"
import { Navigate, useParams } from "react-router-dom"

export default function ProtectedRoute({children})
{
    const { ballotId } = useParams()
    const { idValid } = useSelector(store => store.election)
    if (idValid !== true) return <Navigate to={`/election/${ballotId}`} />
    return children
}