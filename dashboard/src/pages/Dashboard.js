import React from "react"
import { PlusCircleIcon, CalendarIcon } from "../components/icons"
import { Nav, Container, Button, ListGroup, Offcanvas, Form, Alert, Spinner, Badge } from "react-bootstrap"
import NavBar from "../components/NavBar"
import { getBallotsList, formInputChange, createBallot, setShowAlert } from "../features/ballots/ballotsSlice"
import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import Footer from "../components/Footer"
import NetworkError from "./NetworkError"

export default function Dashboard() {
    const dispatch = useDispatch()

    const { isLoading, loadingFailed, ballotsList, createBallotLoading, errorMessage, showAlert } = useSelector(store => store.ballots)

    React.useEffect(function () {
        dispatch(getBallotsList())
    }, [])

    const [show, setShow] = React.useState(false)

    function handleChange(event) {
        const { name, value } = event.target
        dispatch(formInputChange({
            name: name,
            value: value
        }))
    }

    function handleSubmit(event) {
        event.preventDefault()
        dispatch(createBallot())
    }


    if (isLoading) return (
        <section className="dashboard d-flex flex-row align-items-center justify-content-center">
            <div className="lds-hourglass"></div>
        </section>
    )

    if (loadingFailed) return (
        <NetworkError function={getBallotsList} />
    )

    if (ballotsList.length === 0) return (
        <section className="dashboard bg-white ">
            <Offcanvas show={show} onHide={() => setShow(false)} backdrop="static" placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Create an Election</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Alert variant="danger" dismissible className="position-fixed fixed-top" onClose={() => dispatch(setShowAlert(false))} show={showAlert}>
                        {errorMessage}
                    </Alert>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label className="fw-bold">Title</Form.Label>
                            <Form.Control type="text" placeholder="e.g. Board of Directors" name="ballotTitle" onChange={handleChange} required maxLength={100} />
                        </Form.Group>

                        <Button variant="success" type="submit">
                            {
                                createBallotLoading &&
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
                            <span className="text-white">Create</span>
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            <NavBar />

            <div className="d-flex flex-column align-items-center justify-content-center mt-5 pt-5">
                <p className="fs-1 text-center">Welcome to Poller!</p>
                <p className="fs-4 text-center">Create your first election</p>
                <Button variant="success" onClick={() => setShow(true)}>
                    <span className="d-flex flex-row align-items-center justify-content-center">
                        <PlusCircleIcon />
                        <span className="ms-1">New Ballot
                        </span>
                    </span>
                </Button>
            </div>

            <div className="fixed-bottom">
                <Footer />
            </div>
        </section>
    )

    return (
        <section>
            <section className="dashboard">
                <NavBar />

                <Nav className="p-3 bg-white">
                    <Container className=" d-flex flex-row justify-content-between">
                        <Nav.Item>
                            <h2 className="text-bold">Ballots</h2>
                        </Nav.Item>
                        <Nav.Item>
                            <Button variant="success" onClick={() => setShow(true)}>
                                <span className="d-flex flex-row align-items-center justify-content-center">
                                    <PlusCircleIcon />
                                    <span className="ms-1">New Ballot
                                    </span>
                                </span>
                            </Button>
                        </Nav.Item>
                    </Container>
                </Nav>

                <Offcanvas show={show} onHide={() => setShow(false)} backdrop="static" placement="end">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Create an Election</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Alert variant="danger" dismissible className="position-fixed fixed-top" onClose={() => dispatch(setShowAlert(false))} show={showAlert}>
                            {errorMessage}
                        </Alert>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label className="fw-bold">Title</Form.Label>
                                <Form.Control type="text" placeholder="e.g. Board of Directors" name="ballotTitle" onChange={handleChange} required maxLength={100} />
                            </Form.Group>

                            <Button variant="success" type="submit">
                                {
                                    createBallotLoading &&
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
                                <span className="text-white">Create</span>
                            </Button>
                        </Form>
                    </Offcanvas.Body>
                </Offcanvas>

                <Container className="mt-4">
                    <ListGroup>
                        {
                            ballotsList.map((ballot, index) => {
                                return (
                                    <NavLink to={`overview/${ballot.id}`} key={index} className="text-decoration-none mb-3">
                                        <ListGroup.Item>
                                            <div className="row">
                                                <p className="col-md-6 col-sm-12 fw-bold fs-5 text-secondary d-flex flex-row align-items-center justify-content-start">{ballot.title}
                                                    <Badge className={
                                                        ballot.status === "building" ?
                                                            "bg-secondary bg-opacity-10 border border-secondary text-secondary ms-2 fs-6" :
                                                            ballot.status === "running" ?
                                                                "bg-success bg-opacity-10 border border-success text-success ms-2 fs-6" :
                                                                "bg-primary bg-opacity-10 border border-primary text-primary ms-2 fs-6"
                                                    }
                                                    >
                                                        {ballot.status}
                                                    </Badge>
                                                </p>
                                                <div className="col-md-6 col-sm-12  d-flex flex-column align-items-start justify-content-center">
                                                    <div className="d-flex flex-row align-items-center justify-content-center">
                                                        <CalendarIcon />
                                                        <span className="ms-2 fw-bold text-secondary date-text">DATE CREATED</span>
                                                    </div>
                                                    <div className="text-secondary date-text">
                                                        <span>{ballot.date_created.split("T")[0]}</span>
                                                    </div>
                                                </div>

                                            </div>
                                        </ListGroup.Item>
                                    </NavLink>
                                )
                            })
                        }
                    </ListGroup>
                </Container>
            </section>
            <Footer />
        </section>
    )
}