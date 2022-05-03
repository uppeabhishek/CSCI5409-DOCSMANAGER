import React from "react";
import Container from "react-bootstrap/Container";
import {Badge, Table} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Select from "react-select";
import {useEffect, useState} from "react";
import {Form} from "react-bootstrap";
import {useHistory, useParams} from "react-router-dom";
import Swal from "sweetalert2";
import {useSelector} from "react-redux";

const ViewGroup = () => {
    const currentUser = useSelector((state) => state.auth.currentUserData);

    const param = useParams();

    let history = useHistory();

    const getGroupFilesAPI = `/files`;
    const getGroupUsersAPI = `/getgroupusers/${param.id}`;
    const getGroupAdmin = `/getgroupadmin/${param.id}`;

    const [fileDetails, setFileDetails] = useState([]);
    const [groupUsers, setGroupUsers] = useState([]);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(true);

    //let isAdminLoggedIn = true;

    const addMemberHandler = (event) => {
        history.push(`/addmember/${param.id}`);
    };

    const removeMemberHandler = (event) => {
        history.push(`/removemember/${param.id}`);
    };

    const getUrl = async (event) => {
        const getFileUrl = `/geturl/${param.id}/${event.target.value}`;

        axios
            .get(getFileUrl, {
                headers: {},
            })
            .then((res) => {

                Swal.fire({
                    icon: "info",
                    title: "File URL is below:",
                    text: res.data.message,
                });
            })
            .catch((err) => {
                throw err;
            });
    };

    const shortenUrl = async (event) => {
        const getFileUrl = `/geturl/${param.id}/${event.target.value}`;

        const response = await axios.get(getFileUrl, {
            headers: {},
        });

        const fileUrl = response.data.message;

        console.log("url: ", fileUrl);

        axios
            .post(
                "http://cloud-crowd-url-shortener.us-east-1.elasticbeanstalk.com/shorten",
                {
                    url: fileUrl,
                }
            )
            .then((res) => {
                //console.log("Res: " + JSON.stringify(res));
                //console.log("Res: " + res.data);

                Swal.fire({
                    icon: "info",
                    title: "Your shortened URL is below:",
                    text: res.data,
                });
            })
            .catch((err) => {
                Swal.fire({
                    icon: "error",
                    title: "URL shortening service is down!",
                });
                console.log("Err", err);
            });
    };

    const uploadFile = async (e) => {
        e.preventDefault();
        try {
            console.log(param.id);
            const file = e.target.file.files[0];
            if (!file) {
                alert("Please select one file");
                return;
            }

            const formdata = new FormData();
            formdata.append("file", file);
            formdata.append("groupId", param.id);
            //console.log("file:", formdata.files);
            //console.log(formdata);
            const response = await axios.post("/upload", formdata, {
                headers: {},
            });

            if (response.status === 200) {
                //invokeLambda("sendEmail", '{"emails" : ["uppeabhishek97@gmail.com"], "message": "hello", "subject": "world"}');
                getUploadedFiles();
                console.log("success");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getUploadedFiles = () => {
        axios
            .post(getGroupFilesAPI, {
                groupId: param.id,
            })
            .then((res) => {
                console.log(res.data);
                setFileDetails(res.data.map((ele) => ({file_name: ele.fileName, file_id: ele.id})));
                console.log("FD: ", fileDetails);
            });

        axios.get(getGroupUsersAPI).then((res) => {
            console.log("GU:", res.data);
            setGroupUsers(res.data);
        });
    };

    useEffect(() => {
        getUploadedFiles();

        axios
            .get(getGroupAdmin, {
                headers: {},
            })
            .then((res) => {
                console.log("Users: ", res.data);
                console.log("Admin: ", res.data[0].admin_user_id.S);
                console.log("Current User: ", currentUser.id.S);
                if (res.data[0].admin_user_id.S === currentUser.id.S) {
                    console.log("equal");
                    setIsAdminLoggedIn(false);
                }
                //setUsers(res.data);
                //console.log(res.data.map((ele) => ({ value: ele.user_id, label: ele.user_name })));
            })
            .catch((err) => {
                console.log("Err", err);
            });
    }, []);

    return (
        <Container fluid={true}>
            <Row>
                <Col>
                    <h1 className="col-12 m-4">Workspace Files</h1>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>File name</th>
                            <th>View file</th>
                            <th>Download File</th>
                            <th>Extract Text</th>
                            <th>Translate Text</th>
                            <th>Share URL</th>
                            <th>Get Shorten URL</th>
                        </tr>
                        </thead>
                        <tbody>
                        {fileDetails.map((file) => {
                            return (
                                <tr>
                                    <td>{file.file_name}</td>
                                    <td>
                                        <a target="_blank" href={`/api/view/${param.id}/${file.file_id}`}
                                           rel="noreferrer">
                                            {" "}
                                            <Button variant="secondary">View</Button>{" "}
                                        </a>
                                    </td>
                                    <td>
                                        <a target="_blank" href={`/api/download/${param.id}/${file.file_id}`}
                                           rel="noreferrer">
                                            {" "}
                                            <Button variant="secondary">Download</Button>{" "}
                                        </a>
                                    </td>
                                    <td>
                                        <a href={`/analyze/${param.id}/${file.file_id}`}>
                                            <Button variant="secondary">Extract</Button>
                                        </a>
                                    </td>
                                    <td>
                                        <a href={`/translate/${param.id}/${file.file_id}`}>
                                            <Button variant="secondary">Translate</Button>
                                        </a>
                                    </td>
                                    <td>
                                        {/* <a target="_blank" href={`/geturl/${param.id}/${file.file_id}`} rel="noreferrer"> */}{" "}
                                        <Button variant="secondary" value={`${file.file_id}`} onClick={getUrl}>
                                            Share
                                        </Button>{" "}
                                        {/* </a> */}
                                    </td>
                                    <td>
                                        <Button variant="secondary" value={`${file.file_id}`} onClick={shortenUrl}>
                                            Shorten URL
                                        </Button>{" "}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </Table>
                    <Form onSubmit={uploadFile}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>File Upload</Form.Label>
                            <Form.Control type="file" id="file" name="file"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label></Form.Label>
                            <Form.Control type="submit" value="Submit"
                                          style={{backgroundColor: "blue", color: "white", maxWidth: "10%"}}/>
                        </Form.Group>
                    </Form>
                </Col>
                <Col
                    style={{
                        borderLeft: "2px solid navy",
                        marginLeft: "0px",
                    }}
                >
                    <h1 className="col-12 m-4">Workspace members</h1>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>User name</th>
                            <th>User id</th>
                        </tr>
                        </thead>
                        <tbody>
                        {groupUsers.map((user) => {
                            return (
                                <tr>
                                    <td>{user.user_name}</td>
                                    <td>{user.user_id}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </Table>
                    <Button style={{marginRight: "10px"}} onClick={addMemberHandler}>
                        Add member
                    </Button>
                    <Button onClick={removeMemberHandler} disabled={isAdminLoggedIn}>
                        Remove member
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default ViewGroup;
