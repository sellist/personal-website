import React from 'react';
import Clock from '../Clock/Clock';
import "./styles.css"

const Cube = () => {
    return (
    <div class="container">
        <div class="cube cube1">
            <div class="cube-face cube-face--front"><Clock /></div>
            <div class="cube-face cube-face--back"><Clock /></div>
            <div class="cube-face cube-face--left"><Clock /></div>
            <div class="cube-face cube-face--right"><Clock /></div>
            <div class="cube-face cube-face--top"><Clock /></div>
            <div class="cube-face cube-face--bottom"><Clock /></div>
        </div>
    </div>
    )
}

export default Cube;