import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { Container, Nav, Button, Offcanvas, Form, Spinner, Alert, Table, Modal } from "react-bootstrap"
import { PlusCircleIcon, ExclamationIcon } from "../components/icons"
import { voterFormInputChange, setVoterErrorAlert, addVoter, deleteVoter, deleteAllVoters, importVoters } from "../features/dashboard/votersSlice"
import { HiUsers } from "react-icons/hi"
import { ImBin } from "react-icons/im"
import { FaCheck } from "react-icons/fa"
import { TbFileImport } from "react-icons/tb"

export default function Voters() {
    const dispatch = useDispatch()
    const { ballotOverview } = useSelector(store => store.overview)

    const { voterLoading, voterErrorAlert, voterErrorMessage } = useSelector(store => store.voters)
    const [addVoterFormShow, setAddVoterFormShow] = React.useState(false)

    function handleAddVoterFormInputChange(event) {
        const { name, value } = event.target
        dispatch(voterFormInputChange({
            name: name,
            value: value
        }))
    }

    function handleAddVoterFormSubmit(event) {
        event.preventDefault()
        dispatch(addVoter())
    }

    const [deleteAllVotersModalShow, setDeleteAllVotersModalShow] = React.useState(false)

    const [importVotersFormShow, setImportVotersFormShow] = React.useState(false)

    function handleImportVoterFormSubmit(event) {
        event.preventDefault()
        dispatch(importVoters())
    }

    if (ballotOverview === null || ballotOverview.voters.length === 0) {
        return (
            <div className="bg-light d-flex align-items-center justify-content-center">
                {/* ADD VOTER FORM */}
                <Offcanvas show={addVoterFormShow} onHide={() => setAddVoterFormShow(false)} backdrop="static" placement="end">
                    <Offcanvas.Header closeButton className="bg-info">
                        <Offcanvas.Title className="text-white">Add Voter</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Alert variant="danger" dismissible className="position-fixed fixed-top" onClose={() => dispatch(setVoterErrorAlert(false))} show={voterErrorAlert}>
                            {voterErrorMessage}
                        </Alert>
                        <Form onSubmit={handleAddVoterFormSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicTitle">
                                <Form.Label className="fw-bold">Fullname</Form.Label>
                                <Form.Control type="text" placeholder="Enter voter's fullname" name="voterFullname" required maxLength={100} minLength={2} onChange={handleAddVoterFormInputChange} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicDesc">
                                <Form.Label className="fw-bold">Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter voter's email" name="voterEmail" required onChange={handleAddVoterFormInputChange} />
                                <Form.Text>
                                    If a valid email address provided is valid, the user gets the voter ID sent to their email address.
                                </Form.Text>
                            </Form.Group>

                            <Button variant="success" type="submit">
                                {
                                    voterLoading &&
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
                                <span className="text-white">Save</span>
                            </Button>
                        </Form>
                    </Offcanvas.Body>
                </Offcanvas>

                {/* IMPORT VOTERS FORM */}
                <Offcanvas show={importVotersFormShow} onHide={() => setImportVotersFormShow(false)} backdrop="static" placement="end">
                    <Offcanvas.Header closeButton className="bg-info">
                        <Offcanvas.Title className="text-white">Import Voter</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Alert variant="danger" dismissible className="position-fixed fixed-top" onClose={() => dispatch(setVoterErrorAlert(false))} show={voterErrorAlert}>
                            {voterErrorMessage}
                        </Alert>
                        <Form onSubmit={handleImportVoterFormSubmit}>
                            <Form.Group className="mb-3" controlId="csvFile">
                                <Form.Label className="fw-bold">Photo</Form.Label>
                                <Form.Control type="file" name="csv_file" required />
                                <Form.Text>
                                    Select a csv file less than 2mb in size containing two columns.
                                    The first column is the "Fullname" column and the second is the "Email" column.
                                </Form.Text>
                            </Form.Group>

                            <Button variant="success" type="submit">
                                {
                                    voterLoading &&
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
                                <span className="text-white">Import</span>
                            </Button>
                        </Form>
                    </Offcanvas.Body>
                </Offcanvas>


                <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh", minWidth: "100vw" }}>
                    <div className="d-flex flex-column align-items-center justify-content-center">
                        <div className=" d-flex flex-row justify-content-start align-items-center fs-3">
                            <HiUsers />
                            <span className="ms-2">
                                Add Voters
                            </span>
                        </div>
                        <p className="text-muted mt-2 text-center">Add voters to participate in this election.</p>
                        <div className="d-flex flex-row align-items-center justify-content-center">
                            <Button
                                type="button"
                                onClick={() => setImportVotersFormShow(true)}
                                className="d-flex flex-row justify-content-center align-items-center btn btn-outline-primary"
                                size="md"
                                variant="none"
                            >
                                <TbFileImport />
                                <span className="ms-2">Import</span>
                            </Button>
                            <Button variant="success" className="d-flex align-items-center justify-content-center ms-2" onClick={() => setAddVoterFormShow(true)}>
                                <PlusCircleIcon /><span className="ms-1">Add Voter</span>
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div>
            {/* ADD VOTER FORM */}
            <Offcanvas show={addVoterFormShow} onHide={() => setAddVoterFormShow(false)} backdrop="static" placement="end">
                <Offcanvas.Header closeButton className="bg-info">
                    <Offcanvas.Title className="text-white">Add Voter</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Alert variant="danger" dismissible className="position-fixed fixed-top" onClose={() => dispatch(setVoterErrorAlert(false))} show={voterErrorAlert}>
                        {voterErrorMessage}
                    </Alert>
                    <Form onSubmit={handleAddVoterFormSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicTitle">
                            <Form.Label className="fw-bold">Fullname</Form.Label>
                            <Form.Control type="text" placeholder="Enter voter's fullname" name="voterFullname" required maxLength={100} minLength={2} onChange={handleAddVoterFormInputChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicDesc">
                            <Form.Label className="fw-bold">Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter voter's email" name="voterEmail" required onChange={handleAddVoterFormInputChange} />
                            <Form.Text>
                                If a valid email address provided is valid, the user gets the voter ID sent to their email address.
                            </Form.Text>
                        </Form.Group>

                        <Button variant="success" type="submit">
                            {
                                voterLoading &&
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
                            <span className="text-white">Save</span>
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            {/* IMPORT VOTERS FORM */}
            <Offcanvas show={importVotersFormShow} onHide={() => setImportVotersFormShow(false)} backdrop="static" placement="end">
                <Offcanvas.Header closeButton className="bg-info">
                    <Offcanvas.Title className="text-white">Import Voter</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Alert variant="danger" dismissible className="position-fixed fixed-top" onClose={() => dispatch(setVoterErrorAlert(false))} show={voterErrorAlert}>
                        {voterErrorMessage}
                    </Alert>
                    <Form onSubmit={handleImportVoterFormSubmit}>
                        <Form.Group className="mb-3" controlId="csvFile">
                            <Form.Label className="fw-bold">Photo</Form.Label>
                            <Form.Control type="file" name="csv_file" required />
                            <Form.Text>
                                Select a csv file less than 2mb in size containing two columns.
                                The first column is the "Fullname" column and the second is the "Email" column.
                            </Form.Text>
                        </Form.Group>

                        <Button variant="success" type="submit">
                            {
                                voterLoading &&
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
                            <span className="text-white">Import</span>
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            {/*CONFIRM DELETE ALL VOTERS MODAL */}
            <Modal
                show={deleteAllVotersModalShow}
                onHide={() => setDeleteAllVotersModalShow(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
            >

                <Modal.Body className="d-flex flex-column align-items-center justify-content-center">
                    <Alert variant="danger" dismissible className="position-fixed fixed-top" onClose={() => dispatch(setVoterErrorAlert(false))} show={voterErrorAlert}>
                        {voterErrorMessage}
                    </Alert>
                    <ExclamationIcon />
                    <p className="h3 text-center fw-bold mt-3">Warning!</p>
                    <p className="text-muted text-center">
                        Are you sure you want to delete all voters, this action is irreversible?
                    </p>
                    <div className="d-flex flex-row align-items-center justify-content-center">
                        <Button variant="primary" className="me-2 ps-4 pe-4" onClick={() => {
                            dispatch(deleteAllVoters())
                        }}>
                            {
                                voterLoading &&
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
                        <Button variant="secondary" onClick={() => {
                            setDeleteAllVotersModalShow(false)
                        }} className="ps-4 pe-4">No</Button>
                    </div>
                </Modal.Body>

            </Modal>

            <Nav className="pt-2 pb-2 bg-white border-bottom border-secondary border-opacity-25 dashboard-nav" >
                <Container className=" d-flex flex-row justify-content-between">
                    <Nav.Item className="d-flex flex-row align-items-center justify-content-between w-100">
                        <div className=" d-flex flex-row justify-content-start align-items-center fs-5">
                            <HiUsers />
                            <span className="ms-2">
                                Voters
                            </span>
                        </div>
                        {
                            ballotOverview !== null &&
                            ballotOverview.status === "building" &&
                            <div className="d-flex flex-row ">
                                <Button
                                    type="button"
                                    onClick={() => setImportVotersFormShow(true)}
                                    className="d-flex flex-row justify-content-center align-items-center btn btn-outline-primary"
                                    size="md"
                                    variant="none"
                                >
                                    <TbFileImport />
                                    <span className="ms-2">Import</span>
                                </Button>

                                <Button variant="success" className="d-flex align-items-center justify-content-center ms-2" onClick={() => setAddVoterFormShow(true)}>
                                    <PlusCircleIcon /><span className="ms-1">Add Voter</span>
                                </Button>

                            </div>
                        }
                    </Nav.Item>
                </Container>
            </Nav>

            <Container>
                {
                    ballotOverview !== null && ballotOverview.status === "building" ?
                        <>
                            <Table striped bordered hover responsive="lg" className="mt-4">
                                <thead className="bg-dark">
                                    <tr>
                                        <th className="text-white">Fullname</th>
                                        <th className="text-white">Email</th>
                                        <th className="text-white">Voter ID</th>
                                        <th className="text-white"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        ballotOverview.voters.map((voter, index) => (
                                            <tr key={index}>
                                                <td>{voter.fullname}</td>
                                                <td>{voter.email}</td>
                                                <td>{voter.voter_id}</td>
                                                <td>
                                                    <Button
                                                        variant="danger"
                                                        type="button"
                                                        onClick={function () {
                                                            dispatch(deleteVoter(voter.id))
                                                        }}
                                                        className="text-white d-flex flex-row justify-content-start align-items-center"
                                                        size="sm"
                                                    >
                                                        <ImBin />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                            <Button
                                type="button"
                                onClick={() => setDeleteAllVotersModalShow(true)}
                                className="d-flex flex-row justify-content-start align-items-center btn btn-outline-danger"
                                size="md"
                                variant="none"
                            >
                                <ImBin />
                                <span className="ms-2">Delete all</span>
                            </Button>
                        </>
                        :
                        <Table striped bordered hover responsive="lg" className="mt-4">
                            <thead className="bg-dark">
                                <tr>
                                    <th className="text-white">Fullname</th>
                                    <th className="text-white">Email</th>
                                    <th className="text-white">Voter ID</th>
                                    <th className="text-white">Voted?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    ballotOverview.voters.map((voter, index) => (
                                        <tr key={index}>
                                            <td>{voter.fullname}</td>
                                            <td>{voter.email}</td>
                                            <td>{voter.voter_id}</td>
                                            <td>
                                                {
                                                    voter.has_voted === true ?
                                                        <div className="text-success"><FaCheck /></div>
                                                        :
                                                        ""
                                                }
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                }
            </Container>
        </div>
    )
}