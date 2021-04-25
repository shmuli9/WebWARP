import React, {useEffect, useState} from "react";
import Col from "react-bootstrap/Col";
import {Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import bsCustomFileInput from 'bs-custom-file-input';

const UploadForm = (props) => {
    const {setFilename, filename, setGenerated, cropper, setImage, image, setAligned, aligned, setEnabled} = props;
    const [scale, setScale] = useState(1.0);
    const [numStyles, setNumStyles] = useState(1);
    const imageLoaded = image && image.search("placeholder") === -1

    useEffect(() => {
        bsCustomFileInput.init()
    })

    useEffect(() => {
        if (cropper === undefined) {
            console.log("Cropper not initialised")
        } else {
            if (aligned && imageLoaded) {
                setEnabled(true)
            } else {
                setEnabled(false)
            }
        }
    }, [image, aligned, cropper, imageLoaded, setEnabled])

    const getMorphed = () => {
        const cropOptions = {
            width: 256,
            height: 256
        }

        if (aligned) {
            cropper.getCroppedCanvas(cropOptions).toBlob((croppedImage) => {
                upload(croppedImage);
            })
        } else {
            fetch(image)
                .then(res => res.blob())
                .then((imageBlob) => {
                    upload(imageBlob)
                })
        }

        const upload = (imageToUpload) => {
            const form = new FormData();
            form.append("file", imageToUpload, filename);
            form.append("scale", scale);
            form.append("num_styles", numStyles);
            form.append("aligned", aligned);

            fetch(`/api/upload`, {
                method: "POST",
                body: form
            })
                .then(res => res.json())
                .then(json => setGenerated(json.image))
                .catch(err => console.log(err));
        }
    };

    const chooseFile = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }

        if (files.length > 0) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(files[0]);
            setFilename(files[0].name)
        }
    };

    return <>
        <Col className={"my-auto"} md={6}>
            <Form>
                <Form.File
                    id="source-file"
                    label="Choose a picture"
                    accept="image/*"
                    onChange={chooseFile}
                    custom
                />
                <Form.Check type="checkbox"
                            id={"check-aligned"}
                            checked={aligned}
                            onChange={(e) => {
                                setAligned(e.target.checked);
                                cropper.reset();
                            }}
                            disabled={!imageLoaded}
                            className={"mt-3"}
                            label="Customise image?"/>

            </Form>
        </Col>
        <Col className={imageLoaded ? "visible" : "invisible"}>
            <Form.Group controlId="styles">
                <Form.Label>Number of styles ({numStyles})</Form.Label>
                <Form.Control type="range"
                              value={numStyles}
                              onChange={(e) => setNumStyles(e.target.value)}
                              min={1}
                              max={5}/>
            </Form.Group>
            <Form.Group controlId="scale">
                <Form.Label>Scale factor ({scale})</Form.Label>
                <Form.Control type="range"
                              value={scale}
                              onChange={(e) => setScale(e.target.value)}
                              step={0.10}
                              min={0.50}
                              max={10.00}/>
            </Form.Group>

            <Button onClick={getMorphed}>
                Generate
            </Button>
        </Col>
    </>
}
export default UploadForm;


