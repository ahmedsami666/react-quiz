const FinishedScreen = ({ points, maxPoints }) => {
    const percentage = (points / maxPoints) * 100
    return (
        <p className="result">
            You have scored <strong>{points}</strong> out of {maxPoints} ({Math.ceil(percentage)}%)
        </p>
    )
}
export default FinishedScreen