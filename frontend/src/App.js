import {lazy, Suspense} from 'react';
import Container from "react-bootstrap/Container"
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import LoadingScreen from "./Components/Loading";
import 'simplebar/dist/simplebar.min.css';
import SimpleBars from "simplebar-react";
import Main from "./Components/Main/Main";
import Status from "./Components/Status/Status";

function App() {
    const containerStyles = {
        minWidth: "300px",
        maxWidth: "1080px",
        minHeight: "100%"
    }

    const About = lazy(() => import("./Components/About/About"));

    return (
        <Router>
            <SimpleBars style={{minHeight: "100%"}}>

                <Header/>

                <Suspense fallback={LoadingScreen}>
                    <Container className="text-center mt-4" style={containerStyles}>
                        <Switch>
                            <Route exact path={"/about"}>
                                <About/>
                            </Route>
                            <Route exact path={"/"}>
                                <Main/>
                            </Route>
                            <Route exact path={"/status"}>
                                <Status/>
                            </Route>
                        </Switch>
                    </Container>
                </Suspense>

                <Footer/>

            </SimpleBars>
        </Router>
    );
}

export default App;
