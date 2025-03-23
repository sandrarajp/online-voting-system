import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import Cookies from "universal-cookie"
import { getBallotOverview } from "../overview/overviewSlice"

const cookies = new Cookies()

export const getBallotsList = createAsyncThunk("ballots/getBallots", async function(_, thunkAPI) {
    try
    {
        const response = await axios.get("/dashboard/api/list-ballots") //api call to get ballots
        console.log("get ballots", response)
        return response.data
    }
    catch (error)
    {
        console.log("get ballots error", error)
        return thunkAPI.rejectWithValue("Something went wrong")
    }
})

export const logout = createAsyncThunk("ballots/logout", async function(_, thunkAPI){
    try 
    {
        const response = await axios.get("/dashboard/api/logout/")
        console.log("response", response)
        return response.data
    }
    catch (error)
    {
        console.log("error", error)
        return thunkAPI.rejectWithValue("Something went wrong");
    }    
})

export const createBallot = createAsyncThunk("ballots/createBallots", async function(_, thunkAPI){
    const { ballotTitle } = thunkAPI.getState().ballots
    const formData = new FormData()
    formData.append("title", ballotTitle)
    try 
    {
        const response = await axios.post("/dashboard/api/create-ballot/", formData, { headers: {
            "X-CSRFToken": cookies.get("csrftoken")
        }})
        console.log("response", response)
        thunkAPI.dispatch(getBallotsList())
        return response.data
    }
    catch (error)
    {
        console.log("create ballot error", error)
        return thunkAPI.rejectWithValue("Something went wrong");
    }    
})

export const editBallot = createAsyncThunk("dashboard/edit-ballot", async function(ballotId, thunkAPI) {
    const { ballotOverview } = thunkAPI.getState().overview
    const { ballotTitle } = thunkAPI.getState().ballots
    const formData = new FormData()
    ballotTitle && formData.append("title", ballotTitle)
    try 
    {
        const response = await axios.patch(`/dashboard/api/edit-ballot/${ballotId}`, formData, {
            headers: {
                "X-CSRFToken": cookies.get('csrftoken')
            }
        })
        thunkAPI.dispatch(getBallotOverview(ballotOverview.id))
        console.log("edit ballot", response)
        return response.data
    }
    catch (error) 
    {
        console.log("edit ballot error", error)
        return thunkAPI.rejectWithValue("Something went wrong")
    }
})

export const deleteBallot = createAsyncThunk("dashboard/delete-ballot", async function(_, thunkAPI) {
    const { ballotOverview } = thunkAPI.getState().overview
    try 
    {
        const response = await axios.delete(`/dashboard/api/delete-ballot/${ballotOverview.id}`, {
            headers: {
                'content-type': 'multipart/form-data',
                "X-CSRFToken": cookies.get('csrftoken')
            }
        })
        console.log("delete ballot", response)
        return response.data
    }
    catch (error) 
    {
        console.log("delete ballot error", error)
        return thunkAPI.rejectWithValue("Something went wrong")
    }

})

export const launchBallot = createAsyncThunk("dashboard/launch-ballot", async function(_, thunkAPI) {
    const { ballotOverview } = thunkAPI.getState().overview
    try 
    {
        const response = await axios.get(`/dashboard/api/launch-ballot/${ballotOverview.id}`)
        console.log("launch ballot", response)
        thunkAPI.dispatch(getBallotOverview(ballotOverview.id))
        return response.data
    }
    catch (error) 
    {
        console.log("launch ballot error", error)
        return thunkAPI.rejectWithValue("Something went wrong")
    }

})

export const closeBallot = createAsyncThunk("dashboard/close-ballot", async function(_, thunkAPI) {
    const { ballotOverview } = thunkAPI.getState().overview
    try 
    {
        const response = await axios.get(`/dashboard/api/close-ballot/${ballotOverview.id}`)
        console.log("close ballot", response)
        thunkAPI.dispatch(getBallotOverview(ballotOverview.id))
        return response.data
    }
    catch (error) 
    {
        console.log("close ballot error", error)
        return thunkAPI.rejectWithValue("Something went wrong")
    }

})

const initialState = {
    isLoading : false,
    loadingFailed: false,
    ballotsList: [],
    user: cookies.get("User"),
    ballotTitle : "",
    createBallotLoading: false,
    errorMessage: "",
    showAlert: false,
}

const ballotsSlice = createSlice({
    name : "ballots",
    initialState,
    reducers: {
        formInputChange: function(state, action) {
            const { name, value } = action.payload
            state[name] = value
        },

        setShowAlert: function(state, action){
            state.showAlert = action.payload
        },
    },
    extraReducers: {
        [getBallotsList.pending]: function(state, action) {
            state.isLoading = true
        },

        [getBallotsList.fulfilled]: function(state, action) {
            state.isLoading = false
            state.loadingFailed = false
            state.ballotsList = action.payload
            state.user = cookies.get("User")
        },

        [getBallotsList.rejected]: function(state, action) {
            state.isLoading = false
            state.loadingFailed = true
        },

        [logout.fulfilled]: function(state, action){
            location.assign("/login")
        },

        [createBallot.pending]: function(state, action) {
            state.createBallotLoading = true
        },

        [createBallot.fulfilled]: function(state, action) {
            state.createBallotLoading = false
        },

        [createBallot.rejected]: function(state, action){
            state.createBallotLoading = false
            state.errorMessage = "Something went wrong. Check your internent connection and try again."
            state.showAlert = true
        },

        [editBallot.pending]: function(state, action) {
            state.createBallotLoading = true
        },

        [editBallot.fulfilled]: function(state, action) {
            state.createBallotLoading = false
        },

        [editBallot.rejected]: function(state, action){
            state.createBallotLoading = false
            state.errorMessage = "Something went wrong. Check your internent connection and try again."
            state.showAlert = true
        },

        [deleteBallot.pending]: function(state, action) {
            state.createBallotLoading = true
        },

        [deleteBallot.fulfilled]: function(state, action) {
            state.createBallotLoading = false
            location.assign("/dashboard")
        },

        [deleteBallot.rejected]: function(state, action){
            state.createBallotLoading = false
            state.errorMessage = "Something went wrong. Check your internent connection and try again."
            state.showAlert = true
        },

        [launchBallot.pending]: function(state, action) {
            state.createBallotLoading = true
        },

        [launchBallot.fulfilled]: function(state, action) {
            state.createBallotLoading = false
        },

        [launchBallot.rejected]: function(state, action){
            state.createBallotLoading = false
            state.errorMessage = "Something went wrong. Check your internent connection and try again."
            state.showAlert = true
        },

        [closeBallot.pending]: function(state, action) {
            state.createBallotLoading = true
        },

        [closeBallot.fulfilled]: function(state, action) {
            state.createBallotLoading = false
        },

        [closeBallot.rejected]: function(state, action){
            state.createBallotLoading = false
            state.errorMessage = "Something went wrong. Check your internent connection and try again."
            state.showAlert = true
        },

    }
})

export const { formInputChange, setShowAlert } = ballotsSlice.actions
export default ballotsSlice.reducer