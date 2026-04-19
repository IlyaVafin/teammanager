import { useContext } from "react";
import { TeamContext } from "./TeamContext";

export const useTeamContext = () => {
    const ctx = useContext(TeamContext);
    if (!ctx) throw new Error("TeamContext must be use with provider");
    return ctx;
};
