import { ReactNode, useState } from "react";
import { Mode, ModeContext } from "./ModeContext";

export const ModeContextProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<Mode>("kanban");
    const changeMode = (val: Mode) => {
        setMode(val);
    };
    return (
        <ModeContext.Provider value={{ changeMode, mode }}>
            {children}
        </ModeContext.Provider>
    );
};
