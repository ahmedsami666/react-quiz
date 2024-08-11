import Header from './components/Header'
import MainElement from './components/MainElement'
import "./index.css"
import { useEffect, useReducer } from 'react'
import Loader from "./components/Loader"
import Error from './components/Error'
import StartScreen from './components/StartScreen'
import Question from './components/Question'

const initialState = {
    questions: [],
    // loading, error, ready, active, finished
    status: 'loading',
    index: 0
}
const reducer = (state, action) => {
    switch (action.type) {
        case 'dataReceived':
            return {...state, questions: action.payload, status: "ready"}
        case 'dataFaild':
            return {...state, status: 'error'}
        case 'start': 
            return {...state, status: 'active'}
        default:
            throw new Error("Unknown action")
    }
}
export default function App () {
    const [state, dispatch] = useReducer(reducer, initialState)
    const {questions, status, index} = state
    const numQuestions = questions.length
    useEffect(() => {
        fetch("http://localhost:8000/questions")
        .then(res => res.json())
        .then(data => dispatch({type: 'dataReceived', payload: data}))
        .catch((err) => dispatch({type: 'dataFaild'}))
    }, [])
    return (
        <div className="app">
            <Header />
            <MainElement>
                {status === 'loading' && <Loader />}
                {status === 'error' && <Error />}
                {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
                {status === 'active' && <Question question={questions[index]}/>}
            </MainElement>
        </div>
    )
}