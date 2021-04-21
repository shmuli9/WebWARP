import React, {useState} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import {Link} from "react-router-dom";
import ImageSelect from "./CropImage";
import Morphed from "./Morphed";
import UploadForm from "./UploadForm";

function Main() {
    const [generated, setGenerated] = useState("");
    const [cropper, setCropper] = useState();
    const [filename, setFilename] = useState("");
    const [aligned, setAligned] = useState(false);
    const [enabled, setEnabled] = useState(true);
    const [image, setImage] = useState("/image_placeholder.png");

    return (
        <>
            <Alert variant={"dark"} className={""}>
                <Link to={"/"} className="h2 alert-heading">WebWARP</Link>
                <hr/>
                <p className={"mb-0"}>
                    WebWARP
                </p>
            </Alert>

            <Row>
                <UploadForm
                    setGenerated={setGenerated}
                    setFilename={setFilename}
                    filename={filename}
                    setImage={setImage}
                    image={image}
                    cropper={cropper}
                    setAligned={setAligned}
                    aligned={aligned}
                    setEnabled={setEnabled}
                />
            </Row>

            <Row className="mt-5">
                <Col sm={6} className={"mb-5"}>
                    <ImageSelect setCropper={setCropper} image={image} aligned={aligned} enabled={enabled}/>
                </Col>
                <Col sm={6} className={"mb-auto"}>
                    <Morphed generated={generated}/>
                </Col>
            </Row>


        </>
    )
}

export default Main;