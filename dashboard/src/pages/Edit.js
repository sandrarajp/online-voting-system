import React from "react"
import { Container, Nav, Form, Button, Spinner, Alert, Modal } from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import { setShowAlert, formInputChange, editBallot, deleteBallot } from "../features/ballots/ballotsSlice"
import { ExclamationIcon } from "../components/icons"
import { RiEditBoxFill } from "react-icons/ri"
import { ImBin } from "react-icons/im"

export default function Edit() {
    const dispatch = useDispatch()
    const { ballotOverview } = useSelector(store => store.overview)
    const { createBallotLoading, errorMessage, showAlert } = useSelector(store => store.ballots)

    function handleEditVoterFormInputChange(event) {
        const { name, value } = event.target
        dispatch(formInputChange({
            name: name,
            value: value
        }))
    }

    function handleEditVoterFormSubmit(event) {
        event.preventDefault()
        dispatch(editBallot(ballotOverview.id))
    }

    const [deleteBallotModalShow, setDeleteBallotModalShow] = React.useState(false)

    return (
        <div>
            <Nav className="pt-2 pb-2 bg-white border-bottom border-secondary border-opacity-25 dashboard-nav" >
                <Container className=" d-flex flex-row justify-content-between">
                    <Nav.Item className="d-flex flex-row align-items-center justify-content-between w-100">
                        <div className="d-flex flex-row justify-content-start align-items-center fs-5">
                            <RiEditBoxFill />
                            <span className="ms-2">
                                Edit
                            </span>
                        </div>
                        <Button variant="danger" type="button" onClick={() => setDeleteBallotModalShow(true)} className="text-white d-flex flex-row justify-content-start align-items-center" size="sm">
                            <ImBin />
                            <span className="ms-2">
                                Delete Election
                            </span>
                        </Button>
                    </Nav.Item>
                </Container>
            </Nav>

            <Container style={{ minWidth: "60vw" }}>
                {/*CONFIRM DELETE BALLOT MODAL */}
                <Modal
                    show={deleteBallotModalShow}
                    onHide={() => setDeleteBallotModalShow(false)}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                >

                    <Modal.Body className="d-flex flex-column align-items-center justify-content-center">
                        <ExclamationIcon />
                        <p className="h3 text-center fw-bold mt-3">Warning!</p>
                        <p className="text-muted text-center">
                            Are you sure you want to delete this election?
                        </p>
                        <div className="d-flex flex-row align-items-center justify-content-center">
                            <Button variant="primary" className="me-2 ps-4 pe-4" onClick={() => dispatch(deleteBallot())}>
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
                                setDeleteBallotModalShow(false)
                            }}>No</Button>
                        </div>
                    </Modal.Body>
                </Modal>

                <Form className="mt-4 d-flex flex-column justify-content-center align-items-start" onSubmit={handleEditVoterFormSubmit}>
                    <Alert variant="danger" dismissible className="position-fixed fixed-top" onClose={() => dispatch(setShowAlert(false))} show={showAlert}>
                        {errorMessage}
                    </Alert>
                    <Form.Group className="mb-3 w-100" controlId="formBasicEmail">
                        <Form.Label className="fw-bold">Title</Form.Label>
                        <Form.Control size="lg" type="text" defaultValue={ballotOverview && ballotOverview.title} name="ballotTitle" required maxLength={100} onChange={handleEditVoterFormInputChange} />
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
                        <span className="text-white">Edit</span>
                    </Button>

                </Form>
            </Container>
        </div>
    )
}