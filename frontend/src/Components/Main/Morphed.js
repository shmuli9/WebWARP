import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css"

const Morphed = (props) => {
    const {generated} = props;
    let processed;

    if (generated) {
        const url = process.env.REACT_APP_BACKEND_URL
        processed = generated.map(item => {
            return {'original': `${url ? url : ""}${item}`}
        })

    }

    return <div>
        {generated && <ImageGallery items={processed} showPlayButton={false}/>}
    </div>
}
export default Morphed;