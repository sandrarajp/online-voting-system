import React from "react"
import { useParams } from "react-router-dom"
import { Nav, Container, Card, Modal, Button, Spinner, Form, Alert, Tooltip, Overlay } from "react-bootstrap"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { ExclamationIcon } from "../components/icons"
import { closeBallot, setShowAlert } from "../features/ballots/ballotsSlice"
import { FaHome } from "react-icons/fa"
import { HiUsers } from "react-icons/hi"
import { FaQuestionCircle } from "react-icons/fa"
import { FaListAlt } from "react-icons/fa"
import { FaCheckCircle } from "react-icons/fa"


export default function Overview() {
    const { ballotId } = useParams()
    const dispatch = useDispatch()
    const { ballotOverview } = useSelector(store => store.overview)
    const { createBallotLoading, errorMessage, showAlert } = useSelector(store => store.ballots)

    function getNumberOfOptions() {
        if (ballotOverview === null) return 0
        if (ballotOverview.questions.length === 0) return 0
        let numberOfOptions = 0
        for (let question of ballotOverview.questions) {
            numberOfOptions += question.options.length
        }
        return numberOfOptions
    }

    function getParticipationPercent() {
        if (ballotOverview === null) return 0
        const number_of_voters = ballotOverview.voters.length
        let number_of_participated_voters = 0
        for (let voter of ballotOverview.voters) {
            if (voter.has_voted === true) number_of_participated_voters += 1
        }
        const participationPercent = (number_of_participated_voters / number_of_voters) * 100
        return Math.round(participationPercent)
    }

    const [closeElectionModalShow, setCloseElectionModalShow] = React.useState(false)


    const [showTooltip, setShowTooltip] = React.useState(false)
    const target = React.useRef(null)

    return (
        <div className="">

            <Nav className="pt-2 pb-2 bg-white border-bottom border-secondary border-opacity-25 dashboard-nav" >
                <Container className=" d-flex flex-row justify-content-between">
                    <Nav.Item className="d-flex flex-row align-items-center justify-content-between w-100">
                        <div className=" d-flex flex-row justify-content-start align-items-center fs-5">
                            <FaHome />
                            <span className="ms-2">
                                Overview
                            </span>
                        </div>
                        {
                            ballotOverview !== null &&
                            ballotOverview.status === "running" &&
                            <Button variant="warning" size="sm" className="text-white" onClick={() => setCloseElectionModalShow(true)}>Close Election</Button>
                        }
                    </Nav.Item>
                </Container>
            </Nav>

            <Container>
                {/*CONFIRM CLOSE BALLOT MODAL */}
                <Modal
                    show={closeElectionModalShow}
                    onHide={() => setCloseElectionModalShow(false)}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                >
                    <Alert variant="danger" dismissible className="position-fixed fixed-top" onClose={() => dispatch(setShowAlert(false))} show={showAlert}>
                        {errorMessage}
                    </Alert>
                    <Modal.Body className="d-flex flex-column align-items-center justify-content-center">
                        <ExclamationIcon />
                        <p className="h3 text-center fw-bold mt-3">Warning!</p>
                        <p className="text-muted text-center">
                            Are you sure you want to close this election? Voters will be unable to access the election and submit their ballots.
                        </p>
                        <div className="d-flex flex-row align-items-center justify-content-center">
                            <Button variant="primary" className="me-2 ps-4 pe-4" onClick={() => dispatch(closeBallot())}>
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
                                <span>Yes</span>
                            </Button>
                            <Button variant="secondary" className="ps-4 pe-4" onClick={() => {
                                setCloseElectionModalShow(false)
                            }}>No</Button>
                        </div>
                    </Modal.Body>
                </Modal>

                <section className="mt-4 dashboard-nav">
                    <Card className="p-0">
                        <Card.Body>
                            <Form.Group className="mb-3 w-100 " controlId="formBasicEmail">
                                <Form.Label className="fw-bold">Voting URL</Form.Label>
                                <div className="d-flex flex-row">
                                    <Form.Control
                                        size="sm"
                                        type="text"
                                        name="voterId"
                                        required
                                        placeholder={`${location.origin}/election/${ballotId}/ballot`}
                                        disabled
                                        className="bg-white"
                                    />
                                    <Button
                                        variant="light"
                                        className="border border-secondary border-opacity-25"
                                        ref={target}
                                        onClick={() => {
                                            setShowTooltip(true)
                                            navigator.clipboard.writeText(`${location.origin}/election/${ballotId}/ballot`)
                                        }}
                                        onMouseOut={() => setShowTooltip(false)}
                                    >
                                        Copy
                                    </Button>
                                    <Overlay target={target.current} show={showTooltip} placement="top-start">
                                        {
                                            (props) => (
                                                <Tooltip id="overlay-example" {...props}>Copied</Tooltip>
                                            )
                                        }
                                    </Overlay>
                                </div>
                                <Form.Text className="text-info">
                                    This URL is only valid when the election is running.
                                </Form.Text>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </section>

                <section className="mt-4 mb-3 d-flex flex-lg-row flex-column justify-content-start align-items-lg-center align-items-start dashboard-nav">
                    <div className="row g-3 w-100">
                        <div className="col-lg-6 col-12">
                            <Card bg="warning" className="p-4" >
                                <Card.Body className="d-flex flex-row justify-content-between align-items-center ">
                                    <div className="overview-card-icon"><HiUsers /></div>
                                    <div className="d-flex flex-column align-items-end justify-content-center">
                                        <span className="text-white fs-1 fw-bold">{ballotOverview === null ? 0 : ballotOverview.voters.length}</span>
                                        <span className="text-white fs-5">
                                            {
                                                ballotOverview === null ?
                                                    "Voters" :
                                                    ballotOverview.voters.length === 1 ?
                                                        "Voter" :
                                                        "Voters"
                                            }
                                        </span>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>

                        <div className="col-lg-6 col-12">
                            <Card bg="danger" className="p-4" >
                                <Card.Body className="d-flex flex-row justify-content-between align-items-center ">
                                    <div className="overview-card-icon"><FaQuestionCircle /></div>
                                    <div className="d-flex flex-column align-items-end justify-content-center">
                                        <span className="text-white fs-1 fw-bold">{ballotOverview === null ? 0 : ballotOverview.questions.length}</span>
                                        <span className="text-white fs-5">
                                            {
                                                ballotOverview === null ?
                                                    "Questions" :
                                                    ballotOverview.questions.length === 1 ?
                                                        "Question" :
                                                        "Questions"
                                            }
                                        </span>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>

                        <div className="col-lg-6 col-12">
                            <Card bg="info" className="p-4" >
                                <Card.Body className="d-flex flex-row justify-content-between align-items-center ">
                                    <div className="overview-card-icon"><FaListAlt /></div>
                                    <div className="d-flex flex-column align-items-end justify-content-center">
                                        <span className="text-white fs-1 fw-bold">
                                            {getNumberOfOptions()}
                                        </span>
                                        <span className="text-white fs-5">
                                            {
                                                ballotOverview === null ?
                                                    "Options" :
                                                    getNumberOfOptions() === 1 ?
                                                        "Option" :
                                                        "Options"
                                            }
                                        </span>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>

                        {
                            ballotOverview !== null &&
                            ballotOverview.status !== "building" &&
                            <div className="col-lg-6 col-12">
                                <Card className="p-4" style={{ backgroundColor: " rgb(34, 179, 111)" }}>
                                    <div style={{
                                        width: `${getParticipationPercent()}%`,
                                        backgroundColor: "rgb(25, 135, 84)",
                                        height: "100%",
                                        zIndex: "10",
                                        position: "absolute",
                                        top: "0",
                                        left: "0",
                                        borderRadius: "2% 0 0 2%",
                                        transition: "all 0.1s ease"
                                    }}></div>
                                    <Card.Body className="d-flex flex-row justify-content-between align-items-center ">
                                        <div className="overview-card-icon" style={{ zIndex: "20" }}><FaCheckCircle /></div>
                                        <div className="d-flex flex-column align-items-end justify-content-center">
                                            <span className="text-white fs-1 fw-bold" style={{ zIndex: "20" }}>
                                                {getParticipationPercent()}%
                                            </span>
                                            <span className="text-white fs-5" style={{ zIndex: "20" }}>
                                                Participation
                                            </span>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        }
                    </div>
                </section>
            </Container>
        </div>

    )
}