import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { Container, Nav, Button, Offcanvas, Form, Spinner, Alert, Card, ListGroup, ListGroupItem, Dropdown, Modal } from "react-bootstrap"
import { PlusCircleIcon, ExclamationIcon } from "../components/icons"
import { questionFormInputChange, setQuestionErrorAlert, addQuestion, deleteQuestion, editQuestion } from "../features/dashboard/questionsSlice"
import { optionFormInputChange, setOptionErrorAlert, removeOptionImage, setOptionErrorMessage, setQuestionId, addOption, deleteOption, editOption } from "../features/dashboard/optionsSlice"
import { FaListAlt, FaRegEdit, FaEllipsisH } from "react-icons/fa"
import { ImBin } from "react-icons/im"

export default function Ballot() {
    const dispatch = useDispatch()
    const { ballotOverview } = useSelector(store => store.overview)

    /* START OF THINGS USED TO ADD, EDIT AND DELETE QUESTIONS */
    const { questionLoading, questionErrorMessage, questionErrorAlert } = useSelector(store => store.questions)
    const [addQuestionFormShow, setAddQuestionFormShow] = React.useState(false)

    function handleAddQuestionFormSubmit(event) {
        event.preventDefault()
        dispatch(addQuestion())
    }

    function handleQuestionFormInputChange(event) {
        const { name, value } = event.target
        dispatch(questionFormInputChange({
            name: name,
            value: value
        }))
    }

    const [editQuestionFormShow, setEditQuestionFormShow] = React.useState(false)
    const [editQuestionObj, setEditQuestionObj] = React.useState({})

    function handleEditQuestionFormSubmit(event) {
        event.preventDefault()
        dispatch(editQuestion(editQuestionObj.id))
    }

    const [deleteQuestionModalShow, setDeleteQuestionModalShow] = React.useState(false)
    const [deleteQuestionId, setDeleteQuestionId] = React.useState(null)

    /* END OF THINGS USED TO ADD, EDIT AND DELETE QUESTIONS */


    /* START OF THINGS USED TO ADD, EDIT AND DELETE OPTIONS */

    const { optionLoading, optionErrorMessage, optionErrorAlert, optionImage } = useSelector(store => store.options)
    const [addOptionFormShow, setAddOptionFormShow] = React.useState(false)

    function handleAddOptionFormSubmit(event) {
        event.preventDefault()
        dispatch(addOption())
    }

    function handleOptionFormInputChange(event) {
        const { name, value } = event.target
        if (name === "optionImage") {
            console.log(event.target.files[0])
            const file = event.target.files[0]
            console.log(file.type, file.size)
            if (!(file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg")) {
                dispatch(setOptionErrorMessage("Image format not allowed."))
                dispatch(setOptionErrorAlert(true))
                handleRemoveOptionImage()
                return
            }
            if (file.size > 2e6) {
                dispatch(setOptionErrorMessage("Image size greater than 2mb."))
                dispatch(setOptionErrorAlert(true))
                handleRemoveOptionImage()
                return
            }
            dispatch(optionFormInputChange({
                name: name,
                value: (window.URL ?? window.webkitURL).createObjectURL(event.target.files[0])
            }))
            return
        }

        dispatch(optionFormInputChange({
            name: name,
            value: value,
        }))
    }

    function handleRemoveOptionImage() {
        dispatch(removeOptionImage())
        const optionImageElement = document.getElementById("formOptionImage")
        optionImageElement.value = null
    }

    const [editOptionFormShow, setEditOptionFormShow] = React.useState(false)
    const [editOptionObj, setEditOptionObj] = React.useState({})

    function handleEditOptionFormSubmit(event) {
        event.preventDefault()
        dispatch(editOption(editOptionObj.id))
    }

    const [deleteOptionModalShow, setDeleteOptionModalShow] = React.useState(false)
    const [deleteOptionId, setDeleteOptionId] = React.useState(null)


    /* END OF THINGS USED TO ADD, EDIT AND DELETE OPTIONS */

    if (ballotOverview === null || ballotOverview.questions.length === 0) {
        return (
            <div className="bg-light d-flex align-items-center justify-content-center">
                {/*ADD QUESTION FORM */}
                <Offcanvas show={addQuestionFormShow} onHide={() => setAddQuestionFormShow(false)} backdrop="static" placement="end">
                    <Offcanvas.Header closeButton className="bg-info">
                        <Offcanvas.Title className="text-white">Add Ballot Question</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Alert variant="danger" dismissible className="position-fixed fixed-top" onClose={() => dispatch(setQuestionErrorAlert(false))} show={questionErrorAlert}>
                            {questionErrorMessage}
                        </Alert>
                        <Form onSubmit={handleAddQuestionFormSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicTitle">
                                <Form.Label className="fw-bold">Title</Form.Label>
                                <Form.Control type="text" placeholder="Enter ballot question" name="questionTitle" required maxLength={100} onChange={handleQuestionFormInputChange} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicDesc">
                                <Form.Label className="fw-bold">Description</Form.Label>
                                <Form.Control as="textarea" rows={5} placeholder="Enter question description" name="questionDescription" required maxLength={300} onChange={handleQuestionFormInputChange} />
                            </Form.Group>

                            <Button variant="success" type="submit">
                                {
                                    questionLoading &&
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

                <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh", minWidth: "100vw" }}>

                    <div className="d-flex flex-column align-items-center justify-content-center">
                        <div className=" d-flex flex-row justify-content-start align-items-center fs-3">
                            <FaListAlt />
                            <span className="ms-2">
                                Build Your Ballot
                            </span>
                        </div>

                        <p className="text-muted mt-2 text-center">Get started by adding your first question.</p>
                        <Button variant="success" className="d-flex align-items-center justify-content-center" onClick={() => setAddQuestionFormShow(true)}>
                            <PlusCircleIcon /><span className="ms-1">Add Question</span>
                        </Button>
                    </div>
                </Container>

            </div>
        )
    }

    return (
        <div className="">

            {/*ADD QUESTION FORM */}
            <Offcanvas show={addQuestionFormShow} onHide={() => setAddQuestionFormShow(false)} backdrop="static" placement="end">
                <Offcanvas.Header closeButton className="bg-info">
                    <Offcanvas.Title className="text-white">Add Ballot Question</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Alert variant="danger" dismissible className="position-fixed fixed-top" onClose={() => dispatch(setQuestionErrorAlert(false))} show={questionErrorAlert}>
                        {questionErrorMessage}
                    </Alert>
                    <Form onSubmit={handleAddQuestionFormSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicTitle">
                            <Form.Label className="fw-bold">Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter ballot question" name="questionTitle" required maxLength={100} onChange={handleQuestionFormInputChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicDesc">
                            <Form.Label className="fw-bold">Description</Form.Label>
                            <Form.Control as="textarea" rows={5} placeholder="Enter question description" name="questionDescription" required maxLength={300} onChange={handleQuestionFormInputChange} />
                        </Form.Group>

                        <Button variant="success" type="submit">
                            {
                                questionLoading &&
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

            {/*EDIT QUESTION FORM */}
            <Offcanvas show={editQuestionFormShow} onHide={() => setEditQuestionFormShow(false)} backdrop="static" placement="end">
                <Offcanvas.Header closeButton className="bg-info">
                    <Offcanvas.Title className="text-white">Edit Question</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Alert variant="danger" dismissible className="position-fixed fixed-top" onClose={() => dispatch(setQuestionErrorAlert(false))} show={questionErrorAlert}>
                        {questionErrorMessage}
                    </Alert>
                    <Form onSubmit={handleEditQuestionFormSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicTitle">
                            <Form.Label className="fw-bold">Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter ballot question" name="questionTitle" required maxLength={100} onChange={handleQuestionFormInputChange} defaultValue={editQuestionObj.title} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicDesc">
                            <Form.Label className="fw-bold">Description</Form.Label>
                            <Form.Control as="textarea" rows={5} placeholder="Enter question description" name="questionDescription" required maxLength={300} onChange={handleQuestionFormInputChange} defaultValue={editQuestionObj.description} />
                        </Form.Group>

                        <Button variant="success" type="submit">
                            {
                                questionLoading &&
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


            {/*ADD OPTION FORM */}
            <Offcanvas show={addOptionFormShow} onHide={() => setAddOptionFormShow(false)} backdrop="static" placement="end">
                <Offcanvas.Header closeButton className="bg-info">
                    <Offcanvas.Title className="text-white">Add Option</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Alert variant="danger" dismissible className="position-fixed fixed-top" onClose={() => dispatch(setOptionErrorAlert(false))} show={optionErrorAlert}>
                        {optionErrorMessage}
                    </Alert>
                    <Form onSubmit={handleAddOptionFormSubmit}>
                        <Form.Group className="mb-3" controlId="formOptionTitle">
                            <Form.Label className="fw-bold">Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter option title" name="optionTitle" required maxLength={100} onChange={handleOptionFormInputChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formOptionImage">
                            <Form.Label className="fw-bold">Photo</Form.Label>
                            {
                                optionImage &&
                                <Form.Text className="d-flex flex-column align-items-start justify-content-center mb-2">
                                    <img src={optionImage} alt="" className="img img-thumbnail img-fluid mb-2" style={{ maxWidth: "100px" }} />
                                    <Button variant="danger" onClick={handleRemoveOptionImage}>Remove photo</Button>
                                </Form.Text>
                            }
                            <Form.Control type="file" name="optionImage" onChange={handleOptionFormInputChange} />
                            <Form.Text>Max file size: 2mb. Allowed formaats: .jpg, .png, .jpeg</Form.Text>
                        </Form.Group>

                        <Button variant="success" type="submit">
                            {
                                optionLoading &&
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



            {/*EDIT OPTION FORM */}
            <Offcanvas show={editOptionFormShow} onHide={() => {
                setEditOptionFormShow(false)
            }}
                backdrop="static" placement="end"
            >
                <Offcanvas.Header closeButton className="bg-info">
                    <Offcanvas.Title className="text-white">Edit Option</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Alert variant="danger" dismissible className="position-fixed fixed-top" onClose={() => dispatch(setOptionErrorAlert(false))} show={optionErrorAlert}>
                        {optionErrorMessage}
                    </Alert>
                    <Form onSubmit={handleEditOptionFormSubmit}>
                        <Form.Group className="mb-3" controlId="formOptionTitle">
                            <Form.Label className="fw-bold">Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter option title" name="optionTitle" required maxLength={100} onChange={handleOptionFormInputChange} defaultValue={editOptionObj.title} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formOptionImage">
                            <Form.Label className="fw-bold">Photo</Form.Label>

                            <Form.Text className="d-flex flex-column align-items-start justify-content-center mb-2">
                                {
                                    optionImage === "" &&
                                    <img src={editOptionObj.image} alt="" className="img img-thumbnail img-fluid mb-2" style={{ maxWidth: "100px" }} />
                                }
                                {
                                    optionImage &&
                                    <>
                                        <img src={optionImage} alt="" className="img img-thumbnail img-fluid mb-2" style={{ maxWidth: "100px" }} />
                                        <Button variant="danger" onClick={handleRemoveOptionImage}>Remove photo</Button>
                                    </>

                                }
                            </Form.Text>

                            <Form.Control type="file" name="optionImage" onChange={handleOptionFormInputChange} />
                            <Form.Text>Max file size: 2mb. Allowed formaats: .jpg, .png, .jpeg</Form.Text>
                        </Form.Group>

                        <Button variant="success" type="submit">
                            {
                                optionLoading &&
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

            <Nav className="pt-2 pb-2 bg-white border-bottom border-secondary border-opacity-25 dashboard-nav" >
                <Container className=" d-flex flex-row justify-content-between">
                    <Nav.Item className="d-flex flex-row align-items-center justify-content-between w-100">
                        <div className=" d-flex flex-row justify-content-start align-items-center fs-5">
                            <FaListAlt />
                            <span className="ms-2">
                                Ballot
                            </span>
                        </div>
                        {
                            ballotOverview !== null &&
                            ballotOverview.status === "building" &&
                            <Button variant="success" className="d-flex align-items-center justify-content-center" onClick={() => setAddQuestionFormShow(true)}>
                                <PlusCircleIcon /><span className="ms-1">Add Question</span>
                            </Button>
                        }
                    </Nav.Item>
                </Container>
            </Nav>

            <Container>
                {/*CONFIRM DELETE QUESTION MODAL */}
                <Modal
                    show={deleteQuestionModalShow}
                    onHide={() => setDeleteQuestionModalShow(false)}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                >

                    <Modal.Body className="d-flex flex-column align-items-center justify-content-center">
                        <ExclamationIcon />
                        <p className="h3 text-center fw-bold mt-3">Warning!</p>
                        <p className="text-muted text-center">
                            Are you sure you want to delete this question?
                        </p>
                        <div className="d-flex flex-row align-items-center justify-content-center">
                            <Button variant="primary" className="me-2 ps-4 pe-4" onClick={() => dispatch(deleteQuestion(deleteQuestionId))}>
                                {
                                    questionLoading &&
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
                                setDeleteQuestionId(null)
                                setDeleteQuestionModalShow(false)
                            }}>No</Button>
                        </div>
                    </Modal.Body>

                </Modal>


                {/*CONFIRM DELETE OPTION MODAL */}
                <Modal
                    show={deleteOptionModalShow}
                    onHide={() => setDeleteOptionModalShow(false)}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                >

                    <Modal.Body className="d-flex flex-column align-items-center justify-content-center">
                        <ExclamationIcon />
                        <p className="h3 text-center fw-bold mt-3">Warning!</p>
                        <p className="text-muted text-center">
                            Are you sure you want to delete this option?
                        </p>
                        <div className="d-flex flex-row align-items-center justify-content-center">
                            <Button variant="primary" className="me-2 ps-4 pe-4" onClick={() => {
                                dispatch(deleteOption(deleteOptionId))
                            }}>
                                {
                                    optionLoading &&
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
                                setDeleteOptionId(null)
                                setDeleteOptionModalShow(false)
                            }} className="ps-4 pe-4">No</Button>
                        </div>
                    </Modal.Body>

                </Modal>


                {
                    ballotOverview.questions.map((question, index) => (
                        <Card key={index} className="mt-4 w-100 mb-3" style={{ minWidth: "20rem", maxWidth: "50rem" }}>
                            <Card.Header className="d-flex flex-row justify-content-between align-items-center">
                                <div>
                                    <p className="h3 text-bold">{question.title}</p>
                                    <p className="text-muted">{question.description}</p>
                                </div>
                                {
                                    ballotOverview !== null &&
                                    ballotOverview.status === "building" &&
                                    <Dropdown className="ballot-dropdown">
                                        <Dropdown.Toggle variant="white" id="dropdown-basic" className="ellipsis">
                                            <FaEllipsisH />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => {
                                                setEditQuestionFormShow(true)
                                                setEditQuestionObj(question)
                                            }}>
                                                <span className="d-flex flex-row align-items-center justify-content-start">
                                                    <FaRegEdit />
                                                    <span className="ms-2">Edit</span>
                                                </span>
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={() => {
                                                setDeleteQuestionModalShow(true)
                                                setDeleteQuestionId(question.id)
                                            }}>
                                                <span className="d-flex flex-row align-items-center justify-content-start">
                                                    <ImBin />
                                                    <span className="ms-2">Delete</span>
                                                </span>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                }
                            </Card.Header>
                            <Card.Body>
                                {
                                    question.options.length === 0 ?
                                        <Alert variant="primary" className="text-secondary">Click the button below to add an option to the question.</Alert>
                                        :
                                        <>
                                            <p className="h5 text-secondary mb-3">Options</p>
                                            <ListGroup>
                                                {
                                                    question.options.map((option, index) => (
                                                        <ListGroupItem key={index} className="d-flex flex-row align-items-center justify-content-between">
                                                            <div className="d-flex flex-row align-items-center">
                                                                <img src={option.image} alt="" className="img img-thumbnail img-fluid " style={{ maxWidth: "100px" }} />
                                                                <p className="ms-3 text-secondary fs-5">{option.title}</p>
                                                            </div>
                                                            {
                                                                ballotOverview !== null &&
                                                                ballotOverview.status === "building" &&
                                                                <Dropdown className="ballot-dropdown">
                                                                    <Dropdown.Toggle variant="white" id="dropdown-basic" className="ellipsis">
                                                                        <FaEllipsisH />
                                                                    </Dropdown.Toggle>

                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item onClick={() => {
                                                                            setEditOptionObj(option)
                                                                            dispatch(setQuestionId(question.id))
                                                                            setEditOptionFormShow(true)
                                                                        }}>
                                                                            <span className="d-flex flex-row align-items-center justify-content-start">
                                                                                <FaRegEdit />
                                                                                <span className="ms-2">Edit</span>
                                                                            </span>
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Divider />
                                                                        <Dropdown.Item onClick={() => {
                                                                            setDeleteOptionModalShow(true)
                                                                            setDeleteOptionId(option.id)
                                                                        }}>
                                                                            <span className="d-flex flex-row align-items-center justify-content-start">
                                                                                <ImBin />
                                                                                <span className="ms-2">Delete</span>
                                                                            </span>
                                                                        </Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            }
                                                        </ListGroupItem>
                                                    ))
                                                }
                                            </ListGroup>
                                        </>
                                }

                            </Card.Body>
                            <Card.Footer>
                                {
                                    ballotOverview !== null &&
                                    ballotOverview.status === "building" &&
                                    <Button variant="warning" className="d-flex align-items-center justify-content-center text-light" onClick={() => {
                                        setAddOptionFormShow(true)
                                        dispatch(setQuestionId(question.id))
                                    }}>
                                        <PlusCircleIcon /><span className="ms-1">Add Option</span>
                                    </Button>
                                }
                            </Card.Footer>
                        </Card>
                    ))
                }
            </Container>
        </div>
    )
}