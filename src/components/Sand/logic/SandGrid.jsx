import React from 'react';
import SandGrain from './SandGrain';

function SandGrid(props) {
    const width = props.width;
    const height = props.height;


    const board = new Array(width).fill(0);
    for (var i = 0; i < board.length; i++) {
        board[i] = new Array(height).fill(0);
      }

    return (
        <div classname="grid" style={{ display: "flex", flexDirection: "row" }}>
            {board.map((row, i) => (
                <div key={i} className='row'>
                    {row.map((_, j) => (
                        <SandGrain className="cell" key={j}> </SandGrain>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default SandGrid;