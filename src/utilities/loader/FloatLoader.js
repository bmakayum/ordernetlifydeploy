import React from "react";
import "./Loader.css"

/**
 * @return {null}
 */
export default function FloatLoader(props) {
    if (!props.isLoading) {
        return null;
    }
    return (
        <React.Fragment>
            <div id="preFloatLoader">
                <div className="circle-loader"/>
            </div>
        </React.Fragment>
    );
}
