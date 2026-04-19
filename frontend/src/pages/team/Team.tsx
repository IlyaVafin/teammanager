import Calendar from "../../components/calendar/Calendar";
import Invites from "../../components/invites/Invites";
import Kanban from "../../components/kanban/Kanban";
import Sidebar from "../../components/sidebar/Sidebar";
import { useModeContext } from "../../context/mode/useModeContext";
import styles from "./team.module.css";
const Team = () => {
    const { mode } = useModeContext();
    return (
        <section className={styles.teamPage}>
            <Sidebar />
            {mode === "calendar" && <Calendar />}
            {mode === "kanban" && <Kanban />}
            <Invites />
        </section>
    );
};

export default Team;
