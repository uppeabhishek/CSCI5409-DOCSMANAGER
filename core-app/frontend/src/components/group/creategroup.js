import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Select from "react-select";
import {Form} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import Swal from "sweetalert2";
import {useSelector} from "react-redux";

const CreateGroup = () => {
    let history = useHistory();

    const currentUser = useSelector((state) => state.auth.currentUserData);

    const [users, setUsers] = useState([]);
    const [groupMembers, setGroupMembers] = useState({});
    const [groupName, setGroupName] = useState();
    const [groupDetails, setGroupDetails] = useState({});

    const getUsersAPI = "/getuserlist";
    const createGroupAPI = "/creategroup";

    const addMembers = (selectedOption) => {
        const userId = [];
        const userName = [];
        for (let i = 0; i < selectedOption.length; i++) {
            userId[i] = selectedOption[i].value;
            userName[i] = selectedOption[i].label;
        }
        if (!userId.includes(currentUser.userId)) {
            userId[userId.length] = currentUser.id.S;
            userName[userName.length] = currentUser.first_name.S + " " + currentUser.last_name.S;
        }
        setGroupMembers({user_id: userId, user_name: userName});
    };

    const handleGroupName = (event) => {
        setGroupName(event.target.value);
    };

    const createGroup = (event) => {
        event.preventDefault();

        axios
            .post(
                createGroupAPI,
                {
                    name: groupName,
                    user_id: groupMembers.user_id,
                    user_name: groupMembers.user_name,
                    userId: currentUser.id.S,
                },
                {
                    headers: {},
                }
            )
            .then((res) => {
                Swal.fire({
                    icon: "success",
                    title: `${groupName} created successfully`,
                    text: res.data.message,
                });
                history.push(`/home`);
            })
            .catch((err) => {
                throw err;
            });
    };

    useEffect(() => {
        axios
            .get(getUsersAPI, {
                headers: {},
            })
            .then((res) => {
                let resUsers = [];
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].id.S !== currentUser.id.S) {
                        resUsers.push(res.data[i]);
                    }
                }
                setUsers(resUsers.map((ele) => ({value: ele.id.S, label: ele.first_name.S + " " + ele.last_name.S})));
            })
            .catch((err) => {
                console.log("Err", err);
            });
    }, []);

    return (
        <div>
            <Container fluid={true} className="blue-main-gradient py-5 p-2">
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                    marginBottom: "20px",
                    fontFamily: "initial"
                }}>
                    <h1>Get more out of you work by creating a group now!</h1>
                </div>
                <Form onSubmit={createGroup}>
                    <Form.Group>
                        <Form.Label style={{fontWeight: "bold"}}>Please enter your group name</Form.Label>
                        <Form.Control required style={{width: "30%"}} onChange={handleGroupName}></Form.Control>
                    </Form.Group>
                    <div style={{marginTop: "20px", width: "50%"}}>
                        <div style={{fontWeight: "bold"}}>
                            <label>Please select your workspace members</label>
                        </div>
                        <Select isMulti className="basic-multi-select" classNamePrefix="select" options={users}
                                name="users" onChange={addMembers}/>
                    </div>
                    <div style={{display: "flex", justifyContent: "center", marginTop: "20px"}}>
                        <Button type="submit">Proceed</Button>
                    </div>
                </Form>
            </Container>
        </div>
    );
};

export default CreateGroup;
