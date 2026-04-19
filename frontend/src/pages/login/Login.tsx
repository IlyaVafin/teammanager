import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../../components/button/Button";
import Card from "../../components/card/Card";
import Field from "../../components/field/Field";
import Input from "../../components/input/Input";
import { ErrorResponse } from "../register/Register";
import styles from "./login.module.css";
interface LoginSuccessResponse {
    message: string;
    data: {
        id: string;
        name: string;
        email: string;
    };
    credentials: {
        token: string;
    };
}
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginErrors, setLoginErrors] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState("");
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = password.length >= 8;
    const isFormInvalid = !isEmailValid || !isPasswordValid;

    const submitLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            let data;
            if (response.status === 422) {
                data = (await response.json()) as ErrorResponse;
                const errors = Object.values(data)[1];
                for (const key in errors) {
                    setLoginErrors((prev) => ({
                        ...prev,
                        [key]: errors[key][0],
                    }));
                }
            } else if (response.status === 401) {
                data = (await response.json()) as { message: "Unauthorized" };
                setLoginError(data.message);
            } else if (response.status === 200) {
                const data = (await response.json()) as LoginSuccessResponse;
                localStorage.setItem("token", data.credentials.token);
                navigate("/lobby");
            }
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <section className={styles.loginPage}>
            <Card onSubmit={submitLogin} className={styles.form} tag="form">
                <Field gap={8} direction="column">
                    <label htmlFor="email">Почта</label>
                    <Input
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);

                            if (loginErrors.email) {
                                setLoginErrors((prev) => ({
                                    ...prev,
                                    email: "",
                                }));
                            }
                        }}
                        placeholder="example@mail.ru"
                        type="email"
                        id="email"
                        autoComplete="email"
                    />
                    {loginErrors.email && <span>{loginErrors.email}</span>}
                </Field>
                <Field gap={8} direction="column">
                    <label htmlFor="password">Пароль</label>
                    <Input
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setLoginErrors((prev) => ({
                                ...prev,
                                password: "",
                            }));
                        }}
                        type="password"
                        id="password"
                        placeholder="********"
                        autoComplete="current-password"
                    />
                    {loginErrors.password && (
                        <span>{loginErrors.password}</span>
                    )}
                </Field>
                <Button
                    disabled={isFormInvalid}
                    className={`${styles.submitLogin} ${isFormInvalid ? "disabled" : "active"}`}
                >
                    Войти
                </Button>
                {loginError && <p>{loginError}</p>}
            </Card>
        </section>
    );
};

export default Login;
