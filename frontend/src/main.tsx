import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { ModeContextProvider } from "./context/mode/ModeContextProvider.tsx";
import { TeamContextProvider } from "./context/team/TeamContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <ModeContextProvider>
                <TeamContextProvider>
                    <App />
                </TeamContextProvider>
            </ModeContextProvider>
        </BrowserRouter>
    </StrictMode>,
);
