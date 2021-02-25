import {useState} from "react";
import {Form, FormControl, Nav, Navbar} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {Link, useHistory} from "react-router-dom";

function Header() {
    const [game, setGame] = useState("")
    const hist = useHistory()

    const joinGame = () => {
        if (game) {
            hist.push(`/join/${game}`)
            setGame("")
        }
    }

    const formSubmit = (e) => {
        e.preventDefault()
        joinGame()
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand as={Link} to="/">WebWARP</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/about">About</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header;