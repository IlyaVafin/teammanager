import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router";
import Loader from "./components/loader/Loader";

const Auth = ({ children }: { children: ReactNode }) => {
    const [isAuth, setIsAuth] = useState(true);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsAuth(false);
            return;
        }
        async function getTeams() {
            try {
                setLoading(true);
                const response = await fetch(
                    "http://localhost:8080/api/teams",
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                if (response.status === 401) setIsAuth(false);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        getTeams();
    }, []);

    if (loading) return <Loader width={64} height={64}/>;

    if (!isAuth) return <Navigate to="/login" />;
    return children;
};

export default Auth;
