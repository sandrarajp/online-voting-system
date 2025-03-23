import React from "react"
import { Navigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { Nav, Container, Button, Card, Table, Tooltip as BootstrapTooltip, Overlay, Form } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { getBallotOverview } from "../features/overview/overviewSlice"
import { FaChartPie } from "react-icons/fa"
import { TbRefresh } from "react-icons/tb"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import autocolors from 'chartjs-plugin-autocolors'

ChartJS.register(ArcElement, Tooltip, Legend, autocolors);

export default function Results() {
    const dispatch = useDispatch()
    const { ballotId } = useParams()
    const { ballotOverview } = useSelector(store => store.overview)

    const [showTooltip, setShowTooltip] = React.useState(false)
    const target = React.useRef(null)

    function calculateOptionVotePercent(question, numberOfVotes) {
        if (ballotOverview === null) return 0

        const totalNumberOfVotes = question.options.reduce(function (previousValue, currentObj) {
            return previousValue + currentObj.number_of_votes
        }, 0)

        if (totalNumberOfVotes === 0) return 0

        return Math.round((numberOfVotes / totalNumberOfVotes) * 100)
    }

    function generateOptionData(question) {
        const data = {
            labels: question.options.map(option => option.title),
            datasets: [
                {
                    label: '# of Votes',
                    data: question.options.map(option => option.number_of_votes),
                    borderWidth: 1,
                },
            ],
        }

        return data
    }

    const options = {
        plugins: {
            autocolors: {
                mode: 'data',
                offset: 1,
            }
        }
    }

    if (ballotOverview !== null && ballotOverview.status === "building") return <Navigate to={`/dashboard/overview/${ballotId}/launch`} />

    return (
        <div>
            <Nav className="pt-2 pb-2 bg-white border-bottom border-secondary border-opacity-25 dashboard-nav" >
                <Container className=" d-flex flex-row justify-content-between">
                    <Nav.Item className="d-flex flex-row align-items-center justify-content-between w-100">
                        <div className=" d-flex flex-row justify-content-start align-items-center fs-5">
                            <FaChartPie />
                            <span className="ms-2">
                                Results
                            </span>
                        </div>

                        <Button
                            variant="light"
                            type="button"
                            onClick={() => dispatch(getBallotOverview(ballotId))}
                            className="text-dark d-flex flex-row justify-content-start align-items-center border border-opacity-25"
                            size="md"
                        >
                            <TbRefresh />
                        </Button>
                    </Nav.Item>
                </Container>
            </Nav>

            <Container className="mb-3">
                <section className="mt-4 dashboard-nav">
                    <Card className="p-0">
                        <Card.Body>
                            <Form.Group className="mb-3 w-100 " controlId="formBasicEmail">
                                <Form.Label className="fw-bold">Results URL</Form.Label>
                                <div className="d-flex flex-row">
                                    <Form.Control
                                        size="sm"
                                        type="text"
                                        name="voterId"
                                        required
                                        placeholder={`${location.origin}/election/${ballotId}/results`}
                                        disabled
                                        className="bg-white"
                                    />
                                    <Button
                                        variant="light"
                                        className="border border-secondary border-opacity-25"
                                        ref={target}
                                        onClick={() => {
                                            setShowTooltip(true)
                                            navigator.clipboard.writeText(`${location.origin}/election/${ballotId}/results`)
                                        }}
                                        onMouseOut={() => setShowTooltip(false)}
                                    >
                                        Copy
                                    </Button>
                                    <Overlay target={target.current} show={showTooltip} placement="top-start">
                                        {
                                            (props) => (
                                                <BootstrapTooltip id="overlay-example" {...props}>Copied</BootstrapTooltip>
                                            )
                                        }
                                    </Overlay>
                                </div>
                                <Form.Text className="text-info">
                                    When the election is completed, voters can view results by visiting this url.
                                </Form.Text>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </section>

                {
                    ballotOverview !== null &&
                    ballotOverview.questions.map((question, index) => (
                        <Card key={index} className="dashboard-nav mt-3">
                            <Card.Header className="bg-white fw-bold">{question.title}</Card.Header>
                            <Card.Body className="row align-items-center">
                                <div className="col-lg-8 col-12">

                                    <Table striped bordered hover responsive="lg">
                                        <thead>
                                            <tr>
                                                <th>Option</th>
                                                <th colSpan={2} width="20%">Votes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                question.options.map((option, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <img src={option.image} alt="" className="img img-thumbnail ms-2 me-2 img-fluid" style={{ maxWidth: "100px" }} />
                                                            {option.title}
                                                        </td>
                                                        <td className="text-center">{calculateOptionVotePercent(question, option.number_of_votes)}%</td>
                                                        <td className="text-center"><span className="badge bg-secondary ps-3 pe-3 pt-2 pb-2">{option.number_of_votes}</span></td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                                <div className="col-lg-4 col-12">
                                    <Pie data={generateOptionData(question)} options={options} />
                                </div>

                            </Card.Body>
                        </Card>
                    ))
                }
            </Container>
        </div>
    )
}