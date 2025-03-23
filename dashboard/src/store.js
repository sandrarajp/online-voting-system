import { configureStore } from "@reduxjs/toolkit"
import ballotsReducer from "./features/ballots/ballotsSlice"
import overviewReducer from "./features/overview/overviewSlice"
import questionsReducer from "./features/dashboard/questionsSlice"
import optionsReducer from "./features/dashboard/optionsSlice"
import votersReducer from "./features/dashboard/votersSlice"
import electionReducer from "./features/election/electionSlice"

export const store = configureStore({
    reducer: {
        ballots : ballotsReducer,
        overview : overviewReducer,
        questions : questionsReducer,
        options: optionsReducer,
        voters: votersReducer,
        election: electionReducer
    }
})