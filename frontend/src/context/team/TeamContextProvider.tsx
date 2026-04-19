import { ReactNode, useCallback, useState } from "react";
import { TeamContext } from "./TeamContext";
import { Team } from "../../components/sidebar/Sidebar";

export const TeamContextProvider = ({ children }: { children: ReactNode }) => {
    const [teams, setTeams] = useState<Team[]>([]);

    const addTeam = useCallback((team: Team) => {
        setTeams((prev) => [...prev, team]);
    }, []);

    const addTeams = useCallback((teams: Team[]) => {
        setTeams(teams);
    }, []);

    const deleteTeam = useCallback((id: string) => {
        setTeams((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const updateTeam = (id: string, team: Team) => {
        setTeams((prev) => prev.map((t) => (t.id === id ? { ...team } : t)));
    };

    return (
        <TeamContext.Provider value={{ addTeam, deleteTeam, teams, addTeams, updateTeam }}>
            {children}
        </TeamContext.Provider>
    );
};
