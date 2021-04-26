import React from "react";
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
    </div>
}
export default Morphed;