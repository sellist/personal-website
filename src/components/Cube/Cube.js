import React from 'react';
import Clock from '../Clock/Clock';
import "./styles.css"

const Cube = () => {
    return (
    <div className="container">
        <div className="cube cube1">
            <div className="cube-face cube-face--front"><Clock /></div>
            <div className="cube-face cube-face--back"><Clock /></div>
            <div className="cube-face cube-face--left"><Clock /></div>
            <div className="cube-face cube-face--right"><Clock /></div>
            <div className="cube-face cube-face--top"><Clock /></div>
            <div className="cube-face cube-face--bottom"><Clock /></div>
        </div>
    </div>
    )
}

export default Cube;