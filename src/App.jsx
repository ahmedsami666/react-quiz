import Header from './components/Header'
import MainElement from './components/MainElement'
import "./index.css"
import { useEffect, useReducer } from 'react'
import Loader from "./components/Loader"
import Error from './components/Error'
import StartScreen from './components/StartScreen'
import Question from './components/Question'
import NextButton from './components/NextButton'
import Progress from './components/Progress'
import FinishedScreen from './components/FinishedScreen'
import Timer from './components/Timer'
import Footer from './components/Footer'

const initialState = {
    questions: [],
    // loading, error, ready, active, finished
    status: 'loading',
    index: 0,
    answer: null,
    points: 0,
    secondsRemaining: null
}
const reducer = (state, action) => {
    switch (action.type) {
        case 'dataReceived':
            return { ...state, questions: action.payload, status: "ready" }
        case 'dataFaild':
            return { ...state, status: 'error' }
        case 'start':
            return { ...state, status: 'active', secondsRemaining: state.questions.length * 10 }
        case 'newAnswer':
            const question = state.questions.at(state.index)
            return {
                ...state,
                answer: action.payload,
                points: action.payload === question.correctOption ? state.points + question.points : state.points
            }
        case 'nextQuestion':
            return { ...state, index: state.index + 1, answer: null }
        case 'finish':
            return {...state, status: 'finished'}
        case 'restart':
            return {...initialState, questions: state.questions, status: 'ready'}
        case 'tick': 
            
            return {...state, secondsRemaining: state.secondsRemaining - 1, status: state.secondsRemaining === 0 ? 'finished' : state.status}
        default:
            throw new Error("Unknown action")
    }
}
export default function App() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { questions, status, index, answer, points, secondsRemaining } = state

    const numQuestions = questions.length
    const maxPoints = questions.reduce((prev, curr) => prev + curr.points, 0)

    useEffect(() => {
        fetch("http://localhost:8000/questions")
            .then(res => res.json())
            .then(data => dispatch({ type: 'dataReceived', payload: data }))
            .catch((err) => dispatch({ type: 'dataFaild' }))
    }, [])
    return (
        <div className="app">
            <Header />
            <MainElement>
                {status === 'loading' && <Loader />}
                {status === 'error' && <Error />}
                {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
                {status === 'active' &&
                    <>
                        <Progress index={index} numQuestions={numQuestions} points={points} maxPoints={maxPoints} />
                        <Question question={questions[index]} dispatch={dispatch} answer={answer} />
                        <Footer>
                            <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
                            <NextButton dispatch={dispatch} answer={answer} numQuestions={numQuestions} index={index} />
                        </Footer>
                    </>}
                {status === 'finished' && <FinishedScreen points={points} maxPoints={maxPoints} dispatch={dispatch} />}
            </MainElement>
        </div>
    )
}