import {useEffect, useState} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import {Link, useHistory, useParams} from "react-router-dom";

function Main() {
    const [board, setBoard] = useState()
    const history = useHistory()


    const newBoard = (gameId = "") => {
        // fetch(`/api/generate_board/${gameId}`, {method: "POST"})
        //     .then(res => res.json())
        //     .then(data => {
        //     });
    }


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
                <Col></Col>
            </Row>

            <Row className="mt-5">
                <Col sm={4} className={"mb-auto"}>
                </Col>

                <Col sm={4} className={"mb-auto"}>
                </Col>

                <Col sm={4} className={"mb-auto"}>
                </Col>
            </Row>


        </>
    )
}

export default Main;