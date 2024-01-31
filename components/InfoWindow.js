import React from "react";
import Popup from "reactjs-popup";
import Link from "next/link";
const InfoWindow = (props) => {
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
            Gratuluju!
            <div className="message">
            {props.alertMessage} {props.time}
            </div>
            <br/>
            <Link href={`/Level/${parseInt(props.levelNumber) + 1}`}>Next: Lvl {parseInt(props.levelNumber) + 1}</Link>
            <br/>
            <Link href={`/`}>Domů</Link>
            <button onClick={() => props.setOpen(false)} className="info-button">
              close
            </button>
        </Popup>
        </div>
    )
}

export default InfoWindow;