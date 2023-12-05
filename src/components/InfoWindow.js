import React from "react";
import Popup from "reactjs-popup";
import './InfoWindow.css'
import { Link } from "react-router-dom";

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
            {props.alertMessage}
            </div>
            <button onClick={() => props.setOpen(false)} className="info-button">
              close
            </button>
            <Link to={`/level/${props.levelNumber}`}>Next: Lvl {props.levelNumber + 1}</Link>
        </Popup>
        </div>
    )
}

export default InfoWindow;