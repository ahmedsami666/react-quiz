import Option from "./Option"
const Question = ({question}) => {
    return (
        <div>
            <h4>{question.question}</h4>
            <Option question={question}/>
        </div>
    )
}
export default Question