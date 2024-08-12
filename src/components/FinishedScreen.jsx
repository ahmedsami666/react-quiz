const FinishedScreen = ({ points, maxPoints, dispatch }) => {
    const percentage = (points / maxPoints) * 100
    return (
        <>
        <p className="result">
            You have scored <strong>{points}</strong> out of {maxPoints} ({Math.ceil(percentage)}%)
        </p>
        <button className="btn btn-ui" onClick={() => dispatch({ type: 'restart' })}>
                Restart
            </button>
        </>
    )
}
export default FinishedScreen