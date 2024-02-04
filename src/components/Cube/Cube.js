import React from 'react';
import "./styles.css"

const Cube = () => {
    return (
    <div class="container">
        <div class="cube cube1">
            <div class="cube-face cube-face--front"></div>
            <div class="cube-face cube-face--back"></div>
            <div class="cube-face cube-face--left"></div>
            <div class="cube-face cube-face--right"></div>
            <div class="cube-face cube-face--top"></div>
            <div class="cube-face cube-face--bottom"></div>
        </div>
    </div>
    )
}

export default Cube;