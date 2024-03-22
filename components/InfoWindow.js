import React from "react";
import Popup from "reactjs-popup";
import Link from "next/link";
const InfoWindow = (props) => {
    console.log(props.lastLevel)
        if(props.alertPriority === "info") {
        props.setOpen(false)
        return (
            <div className="popup info">
            <Popup open={props.open} modal>
                <div className="message">
                {props.alertMessage}
                </div>
            </Popup>
            </div>
        )

    }
    return (
        <div className="popup">
        <Popup open={props.open} modal>
            Gratuluji!
            <div className="message">
            {props.alertMessage} {props.time}
            </div>
            <br/>
            <button onClick={() => props.setOpen(false)} className="nextLvlButton">
                {!props.lastLevel ? 
            <Link href={`/Level/${parseInt(props.levelNumber) + 1}`} className="nextLvl">Next: Lvl {parseInt(props.levelNumber) + 1}</Link> : ""
                }
            </button>
            <br/>
            <Link href={`/`} className="homeLink">Domů</Link>
            <button onClick={() => props.setOpen(false)} className="info-button">
              Close
            </button>
        </Popup>
        </div>
    )
}

export default InfoWindow;