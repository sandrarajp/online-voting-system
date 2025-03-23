import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import Cookies from "universal-cookie"

const cookies = new Cookies()

export const getBallotData = createAsyncThunk("election/getBallotData", async function (id, thunkAPI) 
{
    try 
    {
        const response = await axios.get(`/dashboard/api/ballot-data/${id}`)
        console.log("ballot data", response)
        return response.data
    }
    catch (error) 
    {
        console.log("ballot data error", error)
        return thunkAPI.rejectWithValue("Something went wrong")
    }
})

export const loginVoter = createAsyncThunk("election/login-voter", async function (ballot_id, thunkAPI) 
{
    const { voterId } = thunkAPI.getState().election
    try {
        const response = await axios.post(`/dashboard/api/login-voter/${ballot_id}`, {
            "voter_id": voterId
        },
            {
                headers: {
                    "X-CSRFToken": cookies.get('csrftoken')
                }
            }
        )
        console.log("login voter", response)
        return response.data
    }
    catch (error) {
        console.log("login voter data error", error)
        if (error.response.status === 404) return thunkAPI.rejectWithValue("Invalid Voter Id")
        if (error.response.status === 400) return thunkAPI.rejectWithValue(`${error.response.data}`)
        return thunkAPI.rejectWithValue("Something went wrong")
    }
})

export const vote = createAsyncThunk("election/vote", async function (ballot_id, thunkAPI) 
{
    const { voterId, choices } = thunkAPI.getState().election
    const votes = Object.values(choices)
    try 
    {
        const response = await axios.post(`/dashboard/api/vote/${ballot_id}`, {
                "voter_id": voterId,
                "votes": [
                    ...votes
                ]
            }, 
            {
                headers: {
                    "X-CSRFToken": cookies.get("csrftoken")
                }
            }
        )
        console.log("vote success", response)
    }
    catch (error) 
    {
        console.log("vote error", error)
        if (error.response.status === 404) return thunkAPI.rejectWithValue("Ballot does not exist")
        if (error.response.status === 400) return thunkAPI.rejectWithValue(`${error.response.data}`)
        return thunkAPI.rejectWithValue("Something went wrong")
    }
})

const initialState = {
    idValid: false,
    loginVoterLoading: false,
    loginVoterError: false,
    loginVoterErrorMessage: "",
    ballotData: null,
    ballotDataLoading: false,
    ballotDataLoadingFailed: false,
    voterId: "",
    choices: {},
    voteLoading: false,
    voteSuccess: false,
    voteErrorAlert: false,
    voteErrorMessage: "Something went wrong",
}

const electionSlice = createSlice({
    name: "election",
    initialState,
    reducers: {
        formInputChange: function (state, action) {
            const { name, value } = action.payload
            state[name] = value
        },

        setLoginVoterError: function (state, action) {
            state.loginVoterError = action.payload
        },

        selectOption: function (state, action) {
            const { name, value } = action.payload
            state.choices[name] = { "option_id": value }
        },

        setVoteErrorAlert: function (state, action) {
            state.voteErrorAlert = action.payload
        }
    },
    extraReducers: {
        [getBallotData.pending]: function (state, action) {
            state.ballotDataLoading = true
        },

        [getBallotData.fulfilled]: function (state, action) {
            state.ballotDataLoading = false
            state.ballotDataLoadingFailed = false
            state.ballotData = action.payload
        },

        [getBallotData.rejected]: function (state, action) {
            state.ballotDataLoading = false
            state.ballotDataLoadingFailed = true
        },

        [loginVoter.pending]: function (state, action) {
            state.loginVoterLoading = true
            state.loginVoterError = false
        },

        [loginVoter.rejected]: function (state, action) {
            state.loginVoterLoading = false
            state.loginVoterErrorMessage = action.payload
            state.loginVoterError = true
        },

        [loginVoter.fulfilled]: function (state, action) {
            state.loginVoterError = false
            state.loginVoterLoading = false
            state.idValid = true
        },

        [vote.pending]: function (state, action) {
            state.voteLoading = true
            state.voteErrorAlert = false
        },

        [vote.fulfilled]: function (state, action) {
            state.voteLoading = false
            state.voteErrorAlert = false
            state.voteSuccess = true
            state.choices = {}
        },

        [vote.rejected]: function (state, action) {
            state.voteLoading = false
            state.voteErrorMessage = action.payload
            state.voteSuccess = false
            state.voteErrorAlert = true
        }
    }
})

export const { formInputChange, setLoginVoterError, selectOption, setVoteErrorAlert } = electionSlice.actions
export default electionSlice.reducer