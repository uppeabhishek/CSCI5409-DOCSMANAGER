import {Controller, useForm} from "react-hook-form";
import {Button, Form} from "react-bootstrap";
import * as yup from "yup";
import {isError, validateYupSchema} from "../../../commonUtils";
import {yupResolver} from "@hookform/resolvers/yup";
import {loginUser} from "../../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {Link} from "react-router-dom";

function Login() {
    const schema = yup
        .object({
            email: validateYupSchema("email", "email"),
            password: validateYupSchema("password", "password"),
        })
        .required();

    const {
        handleSubmit,
        control,
        formState: {errors},
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const dispatch = useDispatch();

    const onSubmit = (values) => {
        dispatch(loginUser(values));
    };

    const isUserLoginDone = useSelector((state) => state.auth.isUserLoginDone);

    const userLoginData = useSelector((state) => state.auth.userLoginData);

    useEffect(() => {
        if (isUserLoginDone && !isError(userLoginData)) {
            window.location.reload();
        }
    }, [isUserLoginDone]);

    return (
        <div className="m-5">
            <div className="h2">Login</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                    <Form.Label>Email Id</Form.Label>
                    <Controller defaultValue="" name="email" control={control}
                                render={({field}) => <Form.Control type="email" placeholder="Email" {...field} />}/>
                </Form.Group>
                <p className="errors">{errors.email?.message}</p>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Controller defaultValue="" name="password" control={control}
                                render={({field}) => <Form.Control type="password"
                                                                   placeholder="Password" {...field} />}/>
                </Form.Group>

                <p className="errors">{errors?.password?.message}</p>
                <div>
                    <Button variant="primary" type="submit" className="mt-2">
                        Login
                    </Button>
                </div>
                <div>
                    <Button variant="primary" type="submit" className="mt-2">
                        <Link to="/register" className="btn btn-primary">
                            Register
                        </Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default Login;
