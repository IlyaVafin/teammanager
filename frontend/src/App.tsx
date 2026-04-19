import { Route, Routes } from "react-router";
import Lobby from "./pages/lobby/Lobby";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Team from "./pages/team/Team";
import Auth from "./Auth";

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Routes>
            <Routes>
                <Route
                    path="/lobby"
                    element={
                        <Auth>
                            <Lobby />
                        </Auth>
                    }
                />
                <Route
                    path="/team/:teamId"
                    element={
                        <Auth>
                            <Team />
                        </Auth>
                    }
                />
            </Routes>
        </>
    );
};

export default App;
