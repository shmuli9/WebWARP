import React, {useState} from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

export const Demo: React.FC = () => {
    const [image, setImage] = useState("");
    const [filename, setFilename] = useState();
    const [generated, setGenerated] = useState();
    const [cropData, setCropData] = useState("");
    const [cropper, setCropper] = useState();
    const onChange = (e: any) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
        setFilename(files[0].name)
    };

    const getCropData = () => {
        if (typeof cropper !== "undefined") {
            setCropData(cropper.getCroppedCanvas({width: 1024, height: 1024}).toDataURL());
        }
    };

    const getMorphed = () => {
        cropper.getCroppedCanvas({width: 256, height: 256}).toBlob((b) => {
            const form = new FormData();
            form.append("file", b, filename);

            fetch(`/api/upload`, {
                method: "POST",
                body: form
            })
                .then(res => res.json())
                .then(json => setGenerated(json.image[0]));
        })
    };

    return (
        <div className={"row"}>
            <div className={"col-6 mr-0"}>
                <input type="file" onChange={onChange}/>
                <Cropper
                    style={{height: 800, width: "100%"}}
                    src={image}
                    autoCrop={true}
                    aspectRatio={1}
                    viewMode={0}
                    minCropBoxHeight={128}
                    minCropBoxWidth={128}
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
            <div className={"col-6"}>
                <div className="box" style={{width: "50%", float: "right", height: "300px"}}>
                    <h1>
                        <span>Crop</span>
                        <button style={{float: "right"}} onClick={getCropData}>
                            Crop Image
                        </button>
                        {cropData && <button onClick={getMorphed}>
                            Generate
                        </button>}
                    </h1>
                    <img style={{width: "100%"}} src={cropData} alt="cropped"/>
                    {generated && <img style={{width: "100%"}} src={generated} alt="generate"/>}
                </div>
            </div>
            <br style={{clear: "both"}}/>
        </div>
    );
};

export default Demo;
