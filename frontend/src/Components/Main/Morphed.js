import React from "react";
import Image from "react-bootstrap/Image";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css"

const Morphed = (props) => {
    const {generated} = props;
    let processed;

    if (generated) {
        processed = generated.map(item => {
            return {'original': `${item}`}
        })

    }

    return <div>
        {generated && <ImageGallery items={processed} showPlayButton={false}/>}
        {/*{generated && <Image style={{width: "100%", height: "512px"}} src={generated[0]} alt="generated"></Image>}*/}
    </div>
}
export default Morphed;