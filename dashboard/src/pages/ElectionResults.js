import React from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import NetworkError from "./NetworkError"
import { PollerLogo } from "../components/icons"
import { Navbar, Container, Card, Table } from "react-bootstrap"
import { getBallotData } from "../features/election/electionSlice"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import autocolors from 'chartjs-plugin-autocolors'

ChartJS.register(ArcElement, Tooltip, Legend, autocolors);
export default function () {
    const { ballotId } = useParams()
    const dispatch = useDispatch()

    React.useEffect(function () {
        dispatch(getBallotData(ballotId))
    }, [])

    const { ballotData, ballotDataLoading, ballotDataLoadingFailed } = useSelector(store => store.election)

    function calculateOptionVotePercent(question, numberOfVotes) {
        if (ballotData === null) return 0

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

    if (ballotDataLoading) return (
        <section className="dashboard d-flex flex-row align-items-center justify-content-center">
            <div className="lds-hourglass"></div>
        </section>
    )

    if (ballotDataLoadingFailed) return (
        <NetworkError function={() => getBallotData(ballotId)} />
    )

    return (
        <div>
            <Navbar bg="info" className="d-flex align-items-center justify-content-center">
                <PollerLogo />
            </Navbar>
            <Container className="mb-3">
                <p className="h2 mt-4 text-center">{ballotData !== null && ballotData.title}</p>
                {
                    ballotData !== null &&
                    ballotData.questions.map((question, index) => (
                        <Card key={index} className="dashboard-nav mt-4">
                            <Card.Header className="bg-info text-white fw-bold fs-3 border border-info">{question.title}</Card.Header>
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
                                    <Doughnut data={generateOptionData(question)} options={options} />
                                </div>

                            </Card.Body>
                        </Card>
                    ))
                }
            </Container>
        </div>
    )
}