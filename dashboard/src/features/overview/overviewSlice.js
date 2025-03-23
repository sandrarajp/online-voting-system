import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getBallotOverview = createAsyncThunk("overview/getBallotOverview", async function(id, thunkAPI) {
    try
    {
        const response = await axios.get(`/dashboard/api/view-ballot/${id}`) 
        console.log("ballot overview", response)
        return response.data
    }
    catch (error)
    {
        console.log("ballot overview error", error)
        return thunkAPI.rejectWithValue("Something went wrong")
    }
})

const initialState = {
    isLoading: false,
    loadingFailed: false,
    ballotOverview: null,
}

const overviewSlice = createSlice({
    name: "overview",
    initialState,
    extraReducers: {
        [getBallotOverview.pending]: function(state, action){
            state.isLoading = true
        },

        [getBallotOverview.fulfilled]: function(state, action){
            state.isLoading = false
            state.loadingFailed = false
            state.ballotOverview = action.payload
        },
        
        [getBallotOverview.rejected]: function(state, action){
            state.isLoading = false
            state.loadingFailed = true
        }
    }
})

export default overviewSlice.reducer