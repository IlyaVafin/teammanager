import { createContext } from "react";
import { Team } from "../../components/sidebar/Sidebar";

export interface ITeamContext {
    addTeam: (team: Team) => void;
    addTeams: (team: Team[]) => void;
    deleteTeam: (id: string) => void;
    teams: Team[];
}

export const TeamContext = createContext<ITeamContext | null>(null);
