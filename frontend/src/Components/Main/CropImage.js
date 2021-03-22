import React, {useEffect, useState} from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const CropImage = (props) => {
    const {setCropper, image, enabled} = props

    return (
        <div className={"row"}>
            <div className={"col-12 mr-0"}>
                <Cropper
                    style={{height: 512, width: "100%"}}
                    src={image}
                    autoCrop={true}
                    enable={enabled}
                    aspectRatio={1}
                    viewMode={0}
                    minCropBoxHeight={256}
                    minCropBoxWidth={256}
                    cropBoxResizable={false}
                    background={true}
                    responsive={true}
                    autoCropArea={1}
                    checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                    onInitialized={(instance) => {
                        setCropper(instance);
                    }}
                />
            </div>
            <br style={{clear: "both"}}/>
        </div>
    );
};

export default CropImage;
