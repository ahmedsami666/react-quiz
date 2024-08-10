import Header from './Header'
import MainElement from './MainElement'
import "./index.css"
import { useEffect, useReducer } from 'react'
import Loader from "./Loader"
import Error from './Error'
import StartScreen from './StartScreen'

const initialState = {
    questions: [],
    // loading, error, ready, active, finished
    status: 'loading'
}
const reducer = (state, action) => {
    switch (action.type) {
        case 'dataReceived':
            return {...state, questions: action.payload, status: "ready"}
        case 'dataFaild':
            return {...state, status: 'error'}
        default:
            throw new Error("Unknown action")
    }
}
export default function App () {
    const [state, dispatch] = useReducer(reducer, initialState)
    const {questions, status} = state
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
                {status === 'ready' && <StartScreen numQuestions={numQuestions} />}
            </MainElement>
        </div>
    )
}