import React from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {Figure} from "react-bootstrap";
import Paper from '@material-ui/core/Paper';

const CropImage = (props) => {
    const {setCropper, image, enabled} = props

    return (
        <div className={"row"}>
            <div className={`col-12 mr-0 `}>
                <Paper elevation={3}>
                    {enabled ? <Cropper
                        style={{height: 512, width: "100%"}}
                        src={image}
                        autoCrop={true}
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
                    /> : <Figure className="mb-0">
                        <Figure.Image className="mb-0" src={image} alt="image" style={{height: 512}} fluid/>
                    </Figure>}
                </Paper>
            </div>
            <br style={{clear: "both"}}/>
        </div>
    );
};

export default CropImage;
