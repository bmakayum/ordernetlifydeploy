import React from "react";
import "./Loader.css"

export default function Loader() {
    return (
        <React.Fragment>
            {/*SVG Loader*/}
            <div id="preLoader">
                <div className="circle-loader"/>
            </div>
        </React.Fragment>
    );
}
