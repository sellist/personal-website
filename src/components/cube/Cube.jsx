import './styles.css'

function Cube() {
    return (
    <div className="container">
        <div className="cube cube1">
            <div className="cube-face cube-face--front"></div>
            <div className="cube-face cube-face--back"></div>
            <div className="cube-face cube-face--left"></div>
            <div className="cube-face cube-face--right"></div>
            <div className="cube-face cube-face--top"></div>
            <div className="cube-face cube-face--bottom"></div>
        </div>
    </div>
    )
}

export default Cube
