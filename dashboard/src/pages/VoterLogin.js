import React from "react"
import { PollerLogo } from "../components/icons"
import { Navbar, Form, Container, Spinner, Card, Button, Alert } from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import { getBallotData, formInputChange, setLoginVoterError, loginVoter } from "../features/election/electionSlice"
import NetworkError from "./NetworkError"
import { useParams, Navigate } from "react-router-dom"

export default function VoterLogin() {
    const { ballotId } = useParams()
    const dispatch = useDispatch()

    React.useEffect(function () {
        dispatch(getBallotData(ballotId))
    }, [])

    const { ballotData, ballotDataLoading, ballotDataLoadingFailed, loginVoterLoading, loginVoterErrorMessage, loginVoterError, idValid } = useSelector(store => store.election)

    if (ballotDataLoading) return (
        <section className="dashboard d-flex flex-row align-items-center justify-content-center">
            <div className="lds-hourglass"></div>
        </section>
    )

    if (ballotDataLoadingFailed) return (
        <NetworkError function={() => getBallotData(ballotId)} />
    )

    function handleSubmit(event) {
        event.preventDefault()
        dispatch(loginVoter(ballotId))
    }

    if (idValid === true) return <Navigate to="ballot" />

    if (ballotData !== null && ballotData.status === "completed") return (
        <div>
            <Navbar bg="info" className="d-flex align-items-center justify-content-center">
                <PollerLogo />
            </Navbar>
            <Container className="mb-4">
                <p className="mt-4 h2 text-center">{ballotData.title}</p>
                <Card className="mt-4">
                    <Card.Body className="text-center fs-5">
                        <p className="h5 fw-bold">Voting for this election has been closed!</p>
                        <p>Contact your election administrator for more details</p>
                        <a href={`${location.origin}/election/${ballotId}/results`}>
                            <Button type="button" variant="info" className="text-white">View Results</Button>
                        </a>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    )

    return (
        <div>
            <Navbar bg="info" className="d-flex align-items-center justify-content-center">
                <PollerLogo />
            </Navbar>
            <Alert variant="danger" dismissible className="position-fixed fixed-top" onClose={() => dispatch(setLoginVoterError(false))} show={loginVoterError}>
                {loginVoterErrorMessage}
            </Alert>
            <Container className="d-flex flex-column align-items-center justify-content-center">
                <p className="h2 text-center mt-4">{ballotData && ballotData.title}</p>
                <Card className="mt-3 w-100" style={{ maxWidth: "40rem" }}>
                    <Card.Title className="bg-info text-white p-2">Login to Vote</Card.Title>
                    <Card.Body>
                        <Form className="d-flex flex-column justify-content-center align-items-start" onSubmit={handleSubmit}>
                            <Form.Group className="mb-3 w-100" controlId="formBasicEmail">
                                <Form.Label className="fw-bold">Voter ID</Form.Label>
                                <Form.Control
                                    size="lg"
                                    type="text"
                                    name="voterId"
                                    required
                                    maxLength={10}
                                    minLength={10}
                                    placeholder="Voter ID"
                                    onChange={function (event) {
                                        const { name, value } = event.target
                                        dispatch(formInputChange({ name: name, value: value }))
                                    }}
                                />
                            </Form.Group>

                            <Button variant="info" type="submit" className="w-100 p-2">
                                {
                                    loginVoterLoading &&
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                        variant="white"
                                    />
                                }
                                <span className="text-white">Login</span>
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>

            </Container>
        </div >
    )
}