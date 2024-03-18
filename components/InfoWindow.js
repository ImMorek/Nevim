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
            <button onClick={() => props.setOpen(false)}>
            <Link href={`/Level/${parseInt(props.levelNumber) + 1}`} className="nextLvl">Next: Lvl {parseInt(props.levelNumber) + 1}</Link>
            </button>
            <br/>
            <Link href={`/`} className="homeLink">Domů</Link>
            <button onClick={() => props.setOpen(false)} className="info-button">
              close
            </button>
        </Popup>
        </div>
    )
}

export default InfoWindow;