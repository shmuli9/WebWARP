import React from "react";
import Image from "react-bootstrap/Image";

const Morphed = (props) => {
    const {generated} = props;

    return <div>
        {generated && <Image style={{width: "100%", height: "512px"}} src={generated} alt="generated"></Image>}
    </div>
}
export default Morphed;