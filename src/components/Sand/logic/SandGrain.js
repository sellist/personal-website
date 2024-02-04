import React from 'react';

function SandGrain(props) {

    const on = props.val
    return (
        <div style={on ? {color:"green"} : {color:"black"}}>a</div>
    )

}

export default SandGrain;