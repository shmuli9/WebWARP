import React from "react";
import Image from "react-bootstrap/Image";

const Morphed = (props) => {
    const {generated} = props;

    return <div>
        {generated && <Image style={{width: 512}} src={generated} alt="generate"></Image>}
    </div>
}
export default Morphed;