import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import Cookies from "universal-cookie"
import { getBallotOverview } from "../overview/overviewSlice"

const cookies = new Cookies()

export const addVoter = createAsyncThunk("dashboard/add-voter", async function (_, thunkAPI) {
    const { voterFullname, voterEmail } = thunkAPI.getState().voters
    const { ballotOverview } = thunkAPI.getState().overview
    const formData = new FormData()
    formData.append("fullname", voterFullname)
    formData.append("email", voterEmail)
    formData.append("ballot", ballotOverview.id)
    try {
        const response = await axios.post("/dashboard/api/add-voter/", formData, {
            headers: {
                "X-CSRFToken": cookies.get('csrftoken')
            }
        })
        thunkAPI.dispatch(getBallotOverview(ballotOverview.id))
        console.log('add voter', response)
        return response.data
    }
    catch (error) {
        console.log('add voter error', error)
        return thunkAPI.rejectWithValue("Something went wrong")
    }
})

export const importVoters = createAsyncThunk("dashboard/import-voters", async function (_, thunkAPI) {
    const { ballotOverview } = thunkAPI.getState().overview
    const csvFile = document.getElementById("csvFile").files[0]
    const formData = new FormData()
    formData.append("csv_file", csvFile)
    formData.append("ballot_id", ballotOverview.id)
    try {
        const response = await axios.post(`/dashboard/api/import-voters/`, formData, {
            headers: {
                'content-type': 'multipart/form-data',
                "X-CSRFToken": cookies.get('csrftoken')
            }
        })
        thunkAPI.dispatch(getBallotOverview(ballotOverview.id))
        console.log("import voters", response)
        return response.data
    }
    catch (error) {
        console.log("import voters error", error)
        if (error.response.status === 400) return thunkAPI.rejectWithValue(`${error.response.data}`)
        return thunkAPI.rejectWithValue("Something went wrong")
    }
})

export const deleteVoter = createAsyncThunk("dashboard/delete-voter", async function (voterId, thunkAPI) {
    const { ballotOverview } = thunkAPI.getState().overview
    try {
        const response = await axios.delete(`/dashboard/api/delete-voter/${voterId}`, {
            headers: {
                'content-type': 'multipart/form-data',
                "X-CSRFToken": cookies.get('csrftoken')
            }
        })
        thunkAPI.dispatch(getBallotOverview(ballotOverview.id))
        console.log("delete voter", response)
        return response.data
    }
    catch (error) {
        console.log("delete voter error", error)
        return thunkAPI.rejectWithValue("Something went wrong")
    }
})

export const deleteAllVoters = createAsyncThunk("dashboard/delete-all-voters", async function (_, thunkAPI) {
    const { ballotOverview } = thunkAPI.getState().overview
    try {
        const response = await axios.delete(`/dashboard/api/delete-all-voters/${ballotOverview.id}`, {
            headers: {
                'content-type': 'multipart/form-data',
                "X-CSRFToken": cookies.get('csrftoken')
            }
        })
        thunkAPI.dispatch(getBallotOverview(ballotOverview.id))
        console.log("delete all voters", response)
        return response.data
    }
    catch (error) {
        console.log("delete all voters error", error)
        return thunkAPI.rejectWithValue("Something went wrong")
    }
})

const initialState = {
    voterLoading: false,
    voterFullname: "",
    voterEmail: "",
    voterErrorAlert: false,
    voterErrorMessage: ""
}

const votersSlice = createSlice({
    name: "voters",
    initialState,
    reducers: {
        setVoterErrorAlert: function (state, action) {
            state.voterErrorAlert = action.payload
        },

        voterFormInputChange: function (state, action) {
            const { name, value } = action.payload
            state[name] = value
        }
    },
    extraReducers: {
        [addVoter.pending]: function (state, action) {
            state.voterLoading = true
            state.voterErrorAlert = false
        },

        [addVoter.rejected]: function (state, action) {
            state.voterLoading = false
            state.voterErrorMessage = "A probelm occured. Check your internet connection and try again."
            state.voterErrorAlert = true
        },

        [addVoter.fulfilled]: function (state, action) {
            state.voterLoading = false
            state.voterErrorAlert = false
            state.voterFullname = ""
            state.voterEmail = ""
        },

        [deleteAllVoters.pending]: function (state, action) {
            state.voterLoading = true
            state.voterErrorAlert = false
        },

        [deleteAllVoters.rejected]: function (state, action) {
            state.voterLoading = false
            state.voterErrorMessage = "A probelm occured. Check your internet connection and try again."
            state.voterErrorAlert = true
        },

        [deleteAllVoters.fulfilled]: function (state, action) {
            state.voterLoading = false
            state.voterErrorAlert = false

        },

        [importVoters.pending]: function (state, action) {
            state.voterLoading = true
            state.voterErrorAlert = false
        },

        [importVoters.rejected]: function (state, action) {
            state.voterLoading = false
            state.voterErrorMessage = action.payload
            state.voterErrorAlert = true
        },

        [importVoters.fulfilled]: function (state, action) {
            state.voterLoading = false
            state.voterErrorAlert = false
        },
    }
})

export const { setVoterErrorAlert, voterFormInputChange } = votersSlice.actions
export default votersSlice.reducer