import React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Select from "react-select";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const RemoveMember = () => {
  let history = useHistory();
  const param = useParams();

  const currentUser = useSelector((state) => state.auth.currentUserData);
  console.log("user:", currentUser);

  const [users, setUsers] = useState([]);
  const [userIds, setUserIds] = useState();
  const [userNames, setUserNames] = useState();
  const [groupUsers, setGroupUsers] = useState([]);
  const [groupMembers, setGroupMembers] = useState();
  const [groupName, setGroupName] = useState();
  const [groupDetails, setGroupDetails] = useState({});


  const getUsersAPI = "/getuserlist";
  const getNonGroupUsersAPI = `/getnongroupusers/${param.id}`;
  const getGroupUsersAPI = `/getgroupusers/${param.id}`;
  const updateGroupUsersAPI = `/updategroupusers/${param.id}`;

  let userId = [];
  let userName = [];
  let updatedUsers = [];
  let updatedUsersString = "";

  const removeMembers = (selectedOption) => {
    // console.log("helo 1");
    const userName = [];
    for (let i = 0; i < selectedOption.length; i++) {
      //   console.log("hello ");
      //   console.log(selectedOption[i].value);
      userId[i] = selectedOption[i].value;
      userName[i] = selectedOption[i].label;
    }
    console.log(userId);
    setUserIds(userId);
    setUserNames(userName);
    // console.log(userName);
    setGroupMembers({ user_id: userId, user_name: userName });
    //setGroupMembers(event.target.value);
  };

  const RemoveNow = async (event) => {
    event.preventDefault();
    console.log("Users: ", userIds);
    // console.log(JSON.parse(groupMembers));
    event.preventDefault();
    for (let j = 0; j < userIds.length; j++) {
      for (let i = 0; i < users.length; i++) {
        if (users[i].value === userIds[j]) {
          users.splice(i, 1);
        }
      }
    }

    for (let i = 0; i < users.length; i++) {
      updatedUsers[i] = { user_id: users[i].value, user_name: users[i].label };
    }

    console.log("FU:", updatedUsers);

    // await axios
    //   .get(getGroupUsersAPI, {
    //     headers: {},
    //   })
    //   .then((res) => {
    //     setGroupUsers(res.data);
    //     console.log("Group users: ", res.data);

    //     for (let i = 0; i < userIds.length; i++) {
    //       updatedUsers[i] = { user_id: userIds[i], user_name: userNames[i] };
    //     }

    //     console.log("Updated users: 1: ", updatedUsers);

    //     let len = updatedUsers.length;
    //     console.log("GU: ", groupUsers);
    //     for (let i = 0; i < res.data.length; i++) {
    //       updatedUsers[len + i] = { user_id: res.data[i].user_id, user_name: res.data[i].user_name };
    //     }

    //     console.log("Updated users: ", updatedUsers);

    //     // for (let i = 0; i < updatedUsers.length; i++) {
    //     //   updatedUsersString += updatedUsers[i];
    //     //   updatedUsersString += ",";
    //     // }
    //     // updatedUsersString = updatedUsersString.substring(0, updatedUsersString.length - 1);
    //     // console.log("Updated users String: ", updatedUsersString);
    //   })
    //   .catch((err) => {
    //     console.log("Err", err);
    //   });

    axios
      .post(
        updateGroupUsersAPI,
        { updatedUsers: updatedUsers },
        {
          headers: {},
        }
      )
      .then((res) => {
        console.log("output: ", res);
        ///setUsers(res.data);
        //setUsers(res.data.map((ele) => ({ value: ele.id.S, label: ele.first_name.S + " " + ele.last_name.S })));
        //console.log(users);
        Swal.fire({
            icon: "success",
            title: "Members removed successfully",
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
      .get(getGroupUsersAPI, {
        headers: {},
      })
      .then((res) => {
        console.log("Users: ", res.data);
        //setUsers(res.data);
        setUsers(res.data.map((ele) => ({ value: ele.user_id, label: ele.user_name })));
        //console.log(res.data.map((ele) => ({ value: ele.user_id, label: ele.user_name })));
      })
      .catch((err) => {
        console.log("Err", err);
      });
  }, []);

  return (
    <div>
      <Container fluid={true} className="blue-main-gradient py-5 p-2">
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", marginBottom: "20px", fontFamily: "initial" }}>
          <h1>Remove members!</h1>
        </div>
        <Form onSubmit={RemoveNow}>
          <div style={{ marginTop: "20px", width: "50%" }}>
            <div style={{ fontWeight: "bold" }}>
              <label>Please select group members to remove</label>
            </div>
            <Select isMulti className="basic-multi-select" classNamePrefix="select" options={users} name="users" onChange={removeMembers} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <Button type="submit">Proceed</Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default RemoveMember;
