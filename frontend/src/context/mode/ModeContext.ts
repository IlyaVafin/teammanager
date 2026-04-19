import { createContext } from "react";
export type Mode = "kanban" | "calendar";
export interface IModeContext {
    changeMode: (val: Mode) => void;
    mode: Mode;
}
export const ModeContext = createContext<IModeContext | null>(null);
