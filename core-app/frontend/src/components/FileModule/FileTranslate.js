import React, {useState} from "react";
import {Alert, Card, FormSelect, ListGroup, ListGroupItem, Spinner} from "react-bootstrap";
import {useParams} from "react-router-dom";
import Axios from "axios";

const FileTranslate = () => {
    const params = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [languageCode, setLanguageCode] = useState(null);
    const [originalAndTranslatedText, setOriginalAndTranslatedText] = useState([]);

    // call the translate api when language code is updated
    const callTranslateAPI = (id, targetLanguageCode) => {
        setIsLoading(true);
        Axios.post(`/translate/${params.groupId}/${id}`, {
            targetLanguageCode
        })
            .then((response) => {
                setOriginalAndTranslatedText(response.data);
                setIsLoading(false);
                setError(false);
            })
            .catch((error) => {
                console.error(error);
                setError(true);
                setIsLoading(false);
            });
    };

    const updateLanguageCode = (e) => {
        setLanguageCode(e.target.value);
        callTranslateAPI(params.fileId, e.target.value);
    }

    // render state when selecting target language
    if (languageCode === null) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    width: "60%",
                    flexFlow: "column",
                    gap: "32px"
                }}
                className="container">
                <h1>Select the target language</h1>
                <FormSelect onChange={updateLanguageCode}>
                    <option value="0">Select a language</option>
                    <option value="sq"> Albanian</option>
                    <option value="am"> Amharic</option>
                    <option value="ar"> Arabic</option>
                    <option value="hy"> Armenian</option>
                    <option value="az"> Azerbaijani</option>
                    <option value="bn"> Bengali</option>
                    <option value="bs"> Bosnian</option>
                    <option value="bg"> Bulgarian</option>
                    <option value="ca"> Catalan</option>
                    <option value="hr"> Croatian</option>
                    <option value="cs"> Czech</option>
                    <option value="da"> Danish</option>
                    <option value="nl"> Dutch</option>
                    <option value="en"> English</option>
                    <option value="et"> Estonian</option>
                    <option value="fa"> Farsi</option>
                    <option value="fi"> Finnish</option>
                    <option value="fr"> French</option>
                    <option value="ka"> Georgian</option>
                    <option value="de"> German</option>
                    <option value="el"> Greek</option>
                    <option value="gu"> Gujarati</option>
                    <option value="ha"> Hausa</option>
                    <option value="he"> Hebrew</option>
                    <option value="hi"> Hindi</option>
                    <option value="hu"> Hungarian</option>
                    <option value="is"> Icelandic</option>
                    <option value="id"> Indonesian</option>
                    <option value="ga"> Irish</option>
                    <option value="it"> Italian</option>
                    <option value="ja"> Japanese</option>
                    <option value="kn"> Kannada</option>
                    <option value="kk"> Kazakh</option>
                    <option value="ko"> Korean</option>
                    <option value="lv"> Latvian</option>
                    <option value="lt"> Lithuanian</option>
                    <option value="mk"> Macedonian</option>
                    <option value="ms"> Malay</option>
                    <option value="ml"> Malayalam</option>
                </FormSelect>
            </div>
        )
    }

    // render state when loading
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

                <h3>Translating...</h3>
            </div>
        )
    }

    if (error) {
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
                    <p>The request failed while translating your file. You can <a
                        href={`/files/translate/${params.fileId}`}>try again</a>.</p>
                </Alert>
            </div>
        )
    }

    // render state when showing the translated content in file
    return (
        <div
            className="container"
            style={{
                display: "flex",
                alignItems: "center",
                flexFlow: "column",
                padding: "64px",
                gap: "32px"
            }}
        >
            <h1>Your translated data</h1>

            <Card
                className="original-list-group"
                style={{
                    display: "flex"
                }}
            >
                <ListGroup variant="flush">
                    {Array.isArray(originalAndTranslatedText) ? originalAndTranslatedText.map((listItem, index) => {
                        return (
                            <ListGroupItem key={index}>
                                <p style={{margin: "0px"}}><b>{listItem.text}</b></p>
                                <p style={{margin: "0px"}}>{listItem.translatedText}</p>
                            </ListGroupItem>
                        )
                    }): null}
                </ListGroup>
            </Card>
        </div>
    )
}

export default FileTranslate;
