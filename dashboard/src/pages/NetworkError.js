import React from "react"
import errorImg from "../errorImg.png"
import { Button } from "react-bootstrap"
import { useDispatch } from "react-redux"
import Footer from "../components/Footer"

export default function NetworkError(props) {
    const dispatch = useDispatch()
    return (
        <section>
            <section className="dashboard d-flex flex-column align-items-center p-5">
                <img src={errorImg} alt="error image" className="mt-5" />
                <h5 className="text-center">Something went wrong. Check your connection and try again.</h5>
                <Button variant="info" className="mt-2 text-white" onClick={() => dispatch(props.function())}>Try again</Button>
            </section>
            <div className="fixed-bottom">
                <Footer />
            </div>
        </section>
    )
}