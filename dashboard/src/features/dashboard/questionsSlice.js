import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import Cookies from "universal-cookie"
import { getBallotOverview } from "../overview/overviewSlice"

const cookies = new Cookies()

export const addQuestion = createAsyncThunk("dashboard/add-question", async function(_, thunkAPI){
    const { questionTitle, questionDescription } = thunkAPI.getState().questions
    const { ballotOverview } = thunkAPI.getState().overview
    const formData = new FormData()
    formData.append("title", questionTitle)
    formData.append("description", questionDescription)
    formData.append("ballot", ballotOverview.id)
    try
    {
        const response = await axios.post("/dashboard/api/add-question/", formData, { headers: {
            "X-CSRFToken": cookies.get('csrftoken')
        }})
        thunkAPI.dispatch(getBallotOverview(ballotOverview.id))
        console.log('add question', response)
        return response.data
    }
    catch(error)
    {
        console.log('add question error', error)
        return thunkAPI.rejectWithValue("Something went wrong")
    }
})

export const deleteQuestion = createAsyncThunk("dashboard/delete-question", async function(questionId, thunkAPI) {
    const { ballotOverview } = thunkAPI.getState().overview
    try 
    {
        const response = await axios.delete(`/dashboard/api/delete-question/${questionId}`, {
            headers: {
                'content-type': 'multipart/form-data',
                "X-CSRFToken": cookies.get('csrftoken')
            }
        })
        thunkAPI.dispatch(getBallotOverview(ballotOverview.id))
        console.log("delete-question", response)
        return response.data
    }
    catch (error) 
    {
        console.log("delete question error", error)
        return thunkAPI.rejectWithValue("Something went wrong")
    }
})

export const editQuestion = createAsyncThunk("dashboard/edit-question", async function(questionId, thunkAPI) {
    const { ballotOverview } = thunkAPI.getState().overview
    const { questionTitle, questionDescription } = thunkAPI.getState().questions
    const formData = new FormData()
    formData.append("ballot", ballotOverview.id)
    questionTitle && formData.append("title", questionTitle)
    questionDescription && formData.append("description", questionDescription)
    try 
    {
        const response = await axios.patch(`/dashboard/api/edit-question/${questionId}`, formData, {
            headers: {
                'content-type': 'multipart/form-data',
                "X-CSRFToken": cookies.get('csrftoken')
            }
        })
        thunkAPI.dispatch(getBallotOverview(ballotOverview.id))
        console.log("eidt-question", response)
        return response.data
    }
    catch (error) 
    {
        console.log("edit question error", error)
        return thunkAPI.rejectWithValue("Something went wrong")
    }
})

const initialState = {
    questionLoading: false,
    questionTitle: "",
    questionDescription: "",
    questionErrorMessage: "",
    questionErrorAlert: false
}

const questionsSlice = createSlice({
    name: "questions",
    initialState,
    reducers: {
        questionFormInputChange: function(state, action) {
            const { name, value } = action.payload
            state[name] = value
        },

        setQuestionErrorAlert: function(state, action){
            state.questionErrorAlert = action.payload
        }
    },
    extraReducers: {
        [addQuestion.pending]: function(state, action){
            state.questionLoading = true
        },

        [addQuestion.fulfilled]: function(state, action){
            state.questionLoading = false
            state.questionTitle = ""
            state.questionDescription = ""
            state.questionErrorAlert = false
        },

        [addQuestion.rejected]: function(state, action){
            state.questionLoading = false
            state.questionErrorMessage = "Something went wrong"
            state.questionErrorAlert = true
        },

        [editQuestion.pending]: function(state, action){
            state.questionLoading = true
        },

        [editQuestion.rejected]: function(state, action){
            state.questionLoading = false
            state.questionErrorMessage = "Something went wrong"
            state.questionErrorAlert = true
        },    

        [editQuestion.fulfilled]: function(state, action){
            state.questionLoading = false
            state.questionTitle = ""
            state.questionDescription = ""
            state.questionErrorAlert = false
        },

        [deleteQuestion.pending]: function(state, action){
            state.questionLoading = true
        },

        [deleteQuestion.rejected]: function(state, action){
            state.questionLoading = false
        },

        [deleteQuestion.fulfilled]: function(state, action){
            state.questionLoading = false
        }
    }
})

export const { questionFormInputChange, setQuestionErrorAlert } = questionsSlice.actions
export default questionsSlice.reducer