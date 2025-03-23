import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import Cookies from "universal-cookie"
import { getBallotOverview } from "../overview/overviewSlice"

const cookies = new Cookies()

export const addOption = createAsyncThunk("dashboard/add-option", async function (_, thunkAPI) {
    const { optionTitle, questionId } = thunkAPI.getState().options
    const { ballotOverview } = thunkAPI.getState().overview
    const image = document.getElementById("formOptionImage").files[0]
    const formData = new FormData()
    formData.append("title", optionTitle)
    formData.append("question", questionId)
    image && formData.append("image", image, image.name)
    try 
    {
        const response = await axios.post("/dashboard/api/add-option/", formData, {
            headers: {
                'content-type': 'multipart/form-data',
                "X-CSRFToken": cookies.get('csrftoken')
            }
        })
        thunkAPI.dispatch(getBallotOverview(ballotOverview.id))
        console.log('add option', response)
        return response.data
    }
    catch (error) 
    {
        console.log('add option error', error)
        return thunkAPI.rejectWithValue("Something went wrong")
    }
})

export const deleteOption = createAsyncThunk("dashboard/delete-option", async function(optionId, thunkAPI) {
    const { ballotOverview } = thunkAPI.getState().overview
    try 
    {
        const response = await axios.delete(`/dashboard/api/delete-option/${optionId}`, {
            headers: {
                'content-type': 'multipart/form-data',
                "X-CSRFToken": cookies.get('csrftoken')
            }
        })
        thunkAPI.dispatch(getBallotOverview(ballotOverview.id))
        console.log("delete option", response)
        return response.data
    }
    catch (error) 
    {
        console.log("delete option error", error)
        return thunkAPI.rejectWithValue("Something went wrong")
    }
})

export const editOption = createAsyncThunk("dashboard/edit-option", async function(optionId, thunkAPI) {
    const { ballotOverview } = thunkAPI.getState().overview
    const { optionTitle, questionId } = thunkAPI.getState().options
    const image = document.getElementById("formOptionImage").files[0]
    const formData = new FormData()
    formData.append("question", questionId)
    optionTitle && formData.append("title", optionTitle)
    image && formData.append("image", image, image.name)
    try 
    {
        let userData = {}
        formData.forEach(function(value, key){
            userData[key] = value;
        });
        const response = await axios.patch(`/dashboard/api/edit-option/${optionId}`, formData, {
            headers: {
                "X-CSRFToken": cookies.get('csrftoken')
            }
        })
        thunkAPI.dispatch(getBallotOverview(ballotOverview.id))
        console.log("edit-option", response)
        return response.data
    }
    catch (error) 
    {
        console.log("edit option error", error)
        return thunkAPI.rejectWithValue("Something went wrong")
    }
})

const initialState = {
    optionTitle: "",
    optionImage: "",
    optionLoading: false,
    optionErrorAlert: false,
    optionErrorMessage: "Something went wrong",
    questionId: null,
}

const optionsSlice = createSlice({
    name: "options",
    initialState,
    reducers: {
        optionFormInputChange: function (state, action) {
            const { name, value } = action.payload
            state[name] = value
        },

        setOptionErrorAlert: function (state, action) {
            state.optionErrorAlert = action.payload
        },

        removeOptionImage: function (state, action) {
            state.optionImage = ""
        },

        setOptionErrorMessage: function (state, action) {
            state.optionErrorMessage = action.payload
        },

        setQuestionId: function (state, action) {
            console.log(action.payload)
            state.questionId = action.payload
        }
    },
    extraReducers: {
        [addOption.pending]: function (state, action) {
            state.optionLoading = true
        },

        
        [addOption.rejected]: function (state, action) {
            state.optionLoading = false
            state.optionErrorMessage = "Something went wrong"
            state.optionErrorlert = true
        },
        
        [addOption.fulfilled]: function (state, action) {
            state.optionLoading = false
            state.optionImage = ""
            state.optionTitle = ""
            state.optionErrorAlert = false
        },

        [editOption.pending]: function(state, action) {
            state.optionLoading = true
        },

        [editOption.rejected]: function (state, action) {
            state.optionLoading = false
            state.optionErrorMessage = "Something went wrong"
            state.optionErrorlert = true
        },

        [editOption.fulfilled]: function(state, action) {
            state.optionLoading = false
            state.optionImage = ""
            state.optionTitle = ""
            state.optionErrorAlert = false
        },

        [deleteOption.pending]: function(state, action){
            state.optionLoading = true
        },

        [deleteOption.rejected]: function(state, action){
            state.optionLoading = false
        },

        [deleteOption.fulfilled]: function(state, action){
            state.optionLoading = false
        }
    }
})

export const { optionFormInputChange, setOptionErrorAlert, removeOptionImage, setOptionErrorMessage, setQuestionId } = optionsSlice.actions
export default optionsSlice.reducer