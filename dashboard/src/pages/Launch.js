import React from "react"
import { Nav, Container, Button, Card, Spinner, Alert } from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import { launchBallot, setShowAlert } from "../features/ballots/ballotsSlice"
import { Navigate, useParams } from "react-router-dom"
import { RiRocketFill } from "react-icons/ri"

export default function Launch() {
    const { ballotId } = useParams()
    const dispatch = useDispatch()
    const { ballotOverview } = useSelector(store => store.overview)
    const { createBallotLoading, errorMessage, showAlert } = useSelector(store => store.ballots)
    const [errorsList, setErrorsList] = React.useState([])

    function checkBallotValidity() {
        let noOptionsFlag = false

        if (ballotOverview === null) return

        if (ballotOverview.questions.length === 0) {
            console.log("ballot has no questions")
            setErrorsList(oldValue => [...oldValue, "There are no questions in your ballot"])
        }
        if (ballotOverview.voters.length === 0) {
            console.log("ballot has no voters")
            setErrorsList(oldValue => [...oldValue, "There are no voters in your ballot"])
        }

        for (let question of ballotOverview.questions) {
            if (question.options.length === 0) noOptionsFlag = true
        }

        if (noOptionsFlag) {
            console.log("Some questions have no options")
            setErrorsList(oldValue => [...oldValue, "Some questions in your ballot have no options."])
        }
    }

    React.useEffect(function () {
        checkBallotValidity()
        console.log(errorsList)
    }, [])

    if (ballotOverview !== null && ballotOverview.status !== "building") return <Navigate to={`/dashboard/overview/${ballotId}/results`} />

    return (
        <div>
            <Nav className="pt-2 pb-2 bg-white border-bottom border-secondary border-opacity-25 dashboard-nav" >
                <Container className=" d-flex flex-row justify-content-between">
                    <Nav.Item className="d-flex flex-row align-items-center justify-content-between w-100">
                        <div className=" d-flex flex-row justify-content-start align-items-center fs-5">
                            <RiRocketFill />
                            <span className="ms-2">
                                Launch
                            </span>
                        </div>
                    </Nav.Item>
                </Container>
            </Nav>

            <div className="d-flex flex-column align-items-center justify-content-center p-2 dashboard-nav">
                <Alert variant="danger" dismissible className="position-fixed fixed-top" onClose={() => dispatch(setShowAlert(false))} show={showAlert}>
                    {errorMessage}
                </Alert>
                <Card className="mt-4" style={{ minWidth: "20rem" }}>
                    <Card.Header className="fw-bold bg-light fs-5">
                        Note
                    </Card.Header>
                    <Card.Body>
                        You <span className="text-danger">will not be allowed</span> to do the following after your election launches:
                        <ul>
                            <li>Add, Edit or Delete Questions</li>
                            <li>Add, Edit or Delete Question Options</li>
                            <li>Add, Edit and Delete Voters</li>
                        </ul>
                        {
                            errorsList.length === 0 ?
                                <>
                                    <Button variant="success" onClick={() => {
                                        dispatch(launchBallot())
                                    }}>
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
                                        <span className="text-white">Launch</span>
                                    </Button>
                                </>
                                :
                                <>
                                    <p className="text-danger">The following errors were found in your ballot:</p>
                                    <ul>
                                        {
                                            errorsList.map((error, index) => (
                                                <li key={index}>
                                                    {error}
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    <Button variant="success" disabled>
                                        Launch Election
                                    </Button>
                                </>
                        }
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}