import { useContext } from "react";
import { ModeContext } from "./ModeContext";

export const useModeContext = () => {
    const ctx = useContext(ModeContext);
    if (!ctx) throw new Error("Mode context must be use with provider");
    return ctx;
};
