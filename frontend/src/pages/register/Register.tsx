import { FormEvent, useEffect, useState } from "react";
import Button from "../../components/button/Button";
import Card from "../../components/card/Card";
import Field from "../../components/field/Field";
import Input from "../../components/input/Input";
import styles from "./register.module.css";
import { useNavigate } from "react-router";
export interface ErrorResponse {
    message: string;
    errors: Record<string, string[]>;
}
const Register = () => {
    const [registerData, setRegisterData] = useState({
        email: "",
        name: "",
        password: "",
    });
    const [registerErrors, setRegisterErrors] = useState({
        email: "",
        name: "",
        password: "",
    });
    const [disabled, setDisabled] = useState(true);
    const navigate = useNavigate();
    const changeField = (key: string, value: string) => {
        setRegisterData((prev) => ({ ...prev, [key]: value }));
    };
    useEffect(() => {
        if (
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email) &&
            registerData.name.length > 2 &&
            registerData.password.length >= 8
        ) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [registerData]);

    const submitRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/register", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registerData),
            });
            let data;
            if (response.status >= 400) {
                data = (await response.json()) as ErrorResponse;
                const errors = Object.values(data)[1];
                for (const key in errors) {
                    setRegisterErrors((prev) => ({
                        ...prev,
                        [key]: errors[key][0],
                    }));
                }
            }

            else if (response.status === 201) {
                navigate("/login");
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className={styles.registerPage}>
            <Card
                onSubmit={submitRegister}
                className={styles.registerForm}
                tag="form"
            >
                <Field direction="column" gap={8}>
                    <label htmlFor="email">Почта</label>
                    <Input
                        value={registerData.email}
                        onChange={(e) => changeField("email", e.target.value)}
                        autoComplete="email"
                        id="email"
                        placeholder="example@mail.ru"
                    />
                    {registerErrors.email && (
                        <span>{registerErrors.email}</span>
                    )}
                </Field>
                <Field direction="column" gap={8}>
                    <label htmlFor="name">Имя</label>
                    <Input
                        value={registerData.name}
                        onChange={(e) => changeField("name", e.target.value)}
                        autoComplete="name"
                        id="name"
                        placeholder="Иван"
                    />
                    {registerErrors.name && <span>{registerErrors.name}</span>}
                </Field>
                <Field direction="column" gap={8}>
                    <label htmlFor="password">Пароль</label>
                    <Input
                        value={registerData.password}
                        onChange={(e) =>
                            changeField("password", e.target.value)
                        }
                        autoComplete="current-password"
                        id="password"
                        placeholder="*********"
                    />
                    {registerErrors.password && (
                        <span>{registerErrors.password}</span>
                    )}
                </Field>
                <Button
                    type="submit"
                    disabled={disabled}
                    className={`${styles.submitButton} ${disabled ? "disabled" : "active"}`}
                >
                    Зарегистрироваться
                </Button>
            </Card>
        </section>
    );
};

export default Register;
