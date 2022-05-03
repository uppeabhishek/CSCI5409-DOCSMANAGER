// Main entry after redux and router are loaded

import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getCurrentUser} from "../../redux/actions";
import AppRouter from "../../router";

function Main() {
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.auth.currentUserData);

    useEffect(() => {
        dispatch(getCurrentUser());
    }, []);

    useEffect(() => {
        if (Object.keys(currentUser).length) {
            setLoading(false);
        }
    }, [currentUser])

    return (
        loading ? <div>Loading</div> : <AppRouter/>
    )
}

export {Main}