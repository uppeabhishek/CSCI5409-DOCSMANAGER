import {Controller, useForm} from "react-hook-form";
import {Button, Form} from "react-bootstrap";
import * as yup from "yup";
import {isError, validateYupSchema} from "../../../commonUtils";
import {yupResolver} from "@hookform/resolvers/yup";
import {useDispatch, useSelector} from "react-redux";
import {registerUser} from "../../../redux/actions";
import {useEffect} from "react";
import {Link, useHistory} from "react-router-dom";

function Register() {
    const history = useHistory();

    const schema = yup
        .object({
            firstName: validateYupSchema("text", "firstName"),
            lastName: validateYupSchema("text", "lastName"),
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
        dispatch(registerUser(values));
    };

    const isUserRegistrationDone = useSelector((state) => state.auth.isUserRegistrationDone);

    const userRegistrationData = useSelector((state) => state.auth.userRegistrationData);

    useEffect(() => {
        if (isUserRegistrationDone) {
            if (!isError(userRegistrationData)) {
                reset();
                window.location.reload();
            }
        }
    }, [isUserRegistrationDone]);

    return (
        <div className="m-5">
            <div className="h2">Register</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Controller defaultValue="" name="firstName" control={control}
                                render={({field}) => <Form.Control type="text" placeholder="First Name" {...field} />}/>
                </Form.Group>
                <p className="errors">{errors.firstName?.message}</p>
                <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Controller defaultValue="" name="lastName" control={control}
                                render={({field}) => <Form.Control type="text" placeholder="Last Name" {...field} />}/>
                </Form.Group>
                <p className="errors">{errors.lastName?.message}</p>
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
                        Register
                    </Button>
                </div>
                <div>
                    <Button variant="primary" type="submit" className="mt-2">
                        <Link to="/login" className="btn btn-primary">
                            Login
                        </Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default Register;
