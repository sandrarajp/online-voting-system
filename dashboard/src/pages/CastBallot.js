import React from "react"
import { Navbar, Container, Card, Form, Button, ListGroup, ListGroupItem, Spinner, Alert } from "react-bootstrap"
import { PollerLogo } from "../components/icons"
import { useSelector, useDispatch } from "react-redux"
import { selectOption, vote, setVoteErrorAlert } from "../features/election/electionSlice"
import { useParams } from "react-router-dom"

export default function CastBallot() {

    const { ballotId } = useParams()
    const { ballotData, voteLoading, voteSuccess, voteErrorAlert, voteErrorMessage } = useSelector(store => store.election)
    const dispatch = useDispatch()

    function handleSelectOption(event) {
        const { name, value } = event.target
        dispatch(selectOption({
            name: name,
            value: value
        }))
    }

    function submitBallot(event) {
        event.preventDefault()
        dispatch(vote(ballotId))
    }

    if (voteSuccess === true) return (
        <div>
            <Navbar bg="info" className="d-flex align-items-center justify-content-center">
                <PollerLogo />
            </Navbar>
            <Container className="mb-4">
                <p className="mt-4 h2 text-center">{ballotData.title}</p>
                <Card className="mt-4">
                    <Card.Body className="text-center fs-5">
                        Thank you for voting in this election!
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
            <Alert variant="danger" dismissible className="position-fixed fixed-top" onClose={() => dispatch(setVoteErrorAlert(false))} show={voteErrorAlert}>
                {voteErrorMessage}
            </Alert>
            <Container className="mb-4">
                <p className="mt-4 h2 text-center">{ballotData.title}</p>
                <Form onSubmit={submitBallot}>

                    {
                        ballotData.questions.map((question, index) => (
                            <Card className="mt-4" key={index}>
                                <Card.Title className="bg-info text-white p-3">{question.title}</Card.Title>
                                <Card.Subtitle className="text-secondary p-3 border-bottom border-opacity-25">{question.description}</Card.Subtitle>
                                <Card.Body>
                                    <ListGroup>
                                        {
                                            question.options.map((option, index) => (
                                                <ListGroupItem key={index}>
                                                    <Form.Check
                                                        type="radio"
                                                        id={`radio-${index}`}
                                                        label={
                                                            <div className="fw-bold">
                                                                <img src={option.image} alt="" className="img img-thumbnail ms-2 me-2 img-fluid" style={{ maxWidth: "100px" }} />
                                                                {option.title}
                                                            </div>
                                                        }
                                                        className="d-flex flex-row align-items-center justify-content-start pt-3 pb-3 "
                                                        name={question.id}
                                                        value={option.id}
                                                        onChange={handleSelectOption}
                                                        required
                                                    />
                                                </ListGroupItem>
                                            ))
                                        }
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        ))
                    }
                    <Button variant="info" type="submit" className="w-100 text-white mt-3 p-2">
                        {
                            voteLoading &&
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
                        <span>Submit Ballot</span>
                    </Button>
                </Form>

            </Container>
        </div>
    )
}