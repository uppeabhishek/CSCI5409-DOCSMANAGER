import React from "react";
import {useParams} from "react-router-dom";
import {Accordion, Alert, Image, ListGroup, ListGroupItem, Spinner} from "react-bootstrap";
import Axios from "axios";
import AccordionItem from "react-bootstrap/esm/AccordionItem";
import AccordionHeader from "react-bootstrap/esm/AccordionHeader";
import AccordionBody from "react-bootstrap/esm/AccordionBody";

const FileAnalyze = () => {
    const params = useParams();

    const [isLoading, setIsLoading] = React.useState(true);
    const [loadingError, setLoadingError] = React.useState(false);
    const [analysisResponse, setAnalysisResponse] = React.useState({
        lines: [],
        words: []
    });

    React.useEffect(() => {
        // fetch the file text content from backend
        Axios.get(`/analyze/${params.groupId}/${params.fileId}`)
            .then((response) => {
                setIsLoading(false);
                setAnalysisResponse(response.data);
            })
            .catch((error) => {
                console.error(error.message);
                setIsLoading(false);
                setLoadingError(true);
            });
    }, [params]);

    if (isLoading) {
        return (
            <div
                className="container"
                style={{
                    height: "100vh",
                    width: "100vw",
                    display: "flex",
                    flexFlow: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>

                <h3>Analyzing...</h3>
            </div>
        )
    }

    if (loadingError) {
        return (
            <div
                className="container"
                style={{
                    height: "100vh",
                    width: "100vw",
                    display: "flex",
                    flexFlow: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Alert variant="danger">
                    <Alert.Heading>Failed to load data</Alert.Heading>
                    <p>The request failed while analyzing your file. You can <a
                        href={`/files/analyze/${params.fileId}`}>try again</a>.</p>
                </Alert>
            </div>
        )
    }

    return (
        <div style={{padding: "64px"}} className="container">
            <Image
                src={`${window.location.origin}/api/view/${params.groupId}/${params.fileId}`}
                style={{
                    display: "block",
                    maxHeight: "500px",
                    margin: "32px auto",
                    boxShadow: "4px 4px 10px rgba(0, 0, 0, .1)"
                }}
            />

            <Accordion defaultActiveKey="0">
                <AccordionItem eventKey="0">
                    <AccordionHeader>Lines &middot;&nbsp; <b>{analysisResponse.lines.length}</b></AccordionHeader>
                    <AccordionBody>
                        <ListGroup>
                            {analysisResponse?.lines && Array.isArray(analysisResponse
                                .lines) ? analysisResponse.lines.map((line) => {
                                return (
                                    <ListGroupItem>
                                        {line.text}
                                    </ListGroupItem>
                                )
                            }) : null}
                        </ListGroup>
                    </AccordionBody>
                </AccordionItem>

                <AccordionItem eventKey="1">
                    <AccordionHeader>Words &middot;&nbsp; <b>{analysisResponse.words.length}</b></AccordionHeader>
                    <AccordionBody>
                        <ListGroup>
                            {analysisResponse?.words && Array.isArray(analysisResponse.words) ? analysisResponse.words.map((word) => {
                                return (
                                    <ListGroupItem>
                                        {word.text}
                                    </ListGroupItem>
                                )
                            }) : null}
                        </ListGroup>
                    </AccordionBody>
                </AccordionItem>
            </Accordion>
        </div>
    )
};

export default FileAnalyze;