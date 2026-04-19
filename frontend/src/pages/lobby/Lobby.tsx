import Invites from "../../components/invites/Invites";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "./lobby.module.css";
const Lobby = () => {
    return (
        <section className={styles.lobby}>
            <Sidebar />
            <Invites />
            <h1 className={styles.head}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-users-round-icon lucide-users-round"
                >
                    <path d="M18 21a8 8 0 0 0-16 0" />
                    <circle cx="10" cy="8" r="5" />
                    <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
                </svg>
                Выберите команду :)
            </h1>
        </section>
    );
};

export default Lobby;
