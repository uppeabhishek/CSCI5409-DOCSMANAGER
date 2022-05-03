import {Badge, Button, Form, Table} from "react-bootstrap";
import React, {useEffect, useState} from 'react'
import Axios from "axios";

const FileModule = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => {
        getUploadedFiles();
    }, []);

    const getUploadedFiles = async () => {
        try {
            const response = await Axios.get("/files", {
                headers: {
                    // "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmNjNzk2MTctNmM4MC00Y2JjLWI1MDctMzg5ZjhkNmFmZTA1MTY0ODMwNzQ2Mzc5MiIsImVtYWlsIjoidGVzdGVtYWlsQGdtYWlsLmNvbSIsImlhdCI6MTY0ODMwNzg3N30.em4F4DPLDxq18_CFLTDCK2Xln-mrwvlIMsYPtTQ-NQk"
                }
            });
            if (response.status === 200) {
                const data = response.data;
                setUploadedFiles(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const uploadFile = async (e) => {
        e.preventDefault();
        try {
            const file = e.target.file.files[0];
            if (!file) {
                alert("Please select one file");
                return;
            }

            const formdata = new FormData();
            formdata.append("file", file);

            const response = await Axios.post("/upload", formdata, {
                "headers": {
                    "Content-Type": "multipart/form-data",
                    // "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmNjNzk2MTctNmM4MC00Y2JjLWI1MDctMzg5ZjhkNmFmZTA1MTY0ODMwNzQ2Mzc5MiIsImVtYWlsIjoidGVzdGVtYWlsQGdtYWlsLmNvbSIsImlhdCI6MTY0ODMwNzg3N30.em4F4DPLDxq18_CFLTDCK2Xln-mrwvlIMsYPtTQ-NQk"
                }
            });

            if (response.status === 200) {
                getUploadedFiles();
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="container">
            <Form onSubmit={uploadFile}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>File Upload</Form.Label>
                    <Form.Control type="file" id="file" name="file"/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label></Form.Label>
                    <Form.Control type="submit" value="Submit"/>
                </Form.Group>
            </Form>
            <br></br>
            <h3>
                Uploaded Files <Badge bg="secondary"></Badge>
            </h3>


            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>File name</th>
                    <th>View file</th>
                    <th>Download File</th>
                </tr>
                </thead>
                <tbody>
                {uploadedFiles.map((file) => {
                    return (
                        <tr>
                            <td>{file.fileName}</td>
                            <td>
                                <a
                                    target="_blank"
                                    href={`/api/view/${file.id}`}
                                    rel="noreferrer"
                                > <Button variant="secondary">View</Button>{' '}</a>
                            </td>
                            <td><a
                                target="_blank"
                                href={`/api/download/${file.id}`}
                                rel="noreferrer"
                            > <Button variant="secondary">Download</Button>{' '}</a>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </Table>
        </div>
    );
}

export default FileModule
