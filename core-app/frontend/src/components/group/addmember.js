import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Select from "react-select";
import {Form} from "react-bootstrap";
import {useHistory, useParams} from "react-router-dom";
import Swal from "sweetalert2";

const AddMember = () => {
    let history = useHistory();
    const param = useParams();

    const [users, setUsers] = useState([]);
    const [userIds, setUserIds] = useState();
    const [userNames, setUserNames] = useState();
    const [groupUsers, setGroupUsers] = useState([]);
    const [groupMembers, setGroupMembers] = useState({});


    const getNonGroupUsersAPI = `/getnongroupusers/${param.id}`;
    const getGroupUsersAPI = `/getgroupusers/${param.id}`;
    const updateGroupUsersAPI = `/updategroupusers/${param.id}`;

    let userId = [];
    let updatedUsers = [];

    const addMembers = (selectedOption) => {
        const userName = [];
        for (let i = 0; i < selectedOption.length; i++) {
            userId[i] = selectedOption[i].value;
            userName[i] = selectedOption[i].label;
        }
        setUserIds(userId);
        setUserNames(userName);
        setGroupMembers({user_id: userId, user_name: userName});
    };

    const AddNow = async (event) => {
        event.preventDefault();
        await axios
            .get(getGroupUsersAPI, {
                headers: {},
            })
            .then((res) => {
                setGroupUsers(res.data);
                for (let i = 0; i < userIds.length; i++) {
                    updatedUsers[i] = {user_id: userIds[i], user_name: userNames[i]};
                }

                let len = updatedUsers.length;
                for (let i = 0; i < res.data.length; i++) {
                    updatedUsers[len + i] = {user_id: res.data[i].user_id, user_name: res.data[i].user_name};
                }
            })
            .catch((err) => {
                console.log("Err", err);
            });

        axios
            .post(
                updateGroupUsersAPI,
                {updatedUsers: updatedUsers}
            )
            .then((res) => {
                Swal.fire({
                    icon: "success",
                    title: "Members added successfully",
                    text: res.data.message,
                });
                history.push(`/viewgroup/${param.id}`);
            })
            .catch((err) => {
                console.log("Err", err);
            });
    };

    useEffect(() => {
        axios
            .get(getNonGroupUsersAPI)
            .then((res) => {
                setUsers(res.data.map((ele) => ({value: ele.id.S, label: ele.first_name.S + " " + ele.last_name.S})));
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
                    <h1>Add your friends!</h1>
                </div>
                <Form onSubmit={AddNow}>
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

export default AddMember;
