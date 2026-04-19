import { FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useParams } from "react-router";
import { useModeContext } from "../../context/mode/useModeContext";
import { useTeamContext } from "../../context/team/useTeamContext";
import Button from "../button/Button";
import Card from "../card/Card";
import Field from "../field/Field";
import Input from "../input/Input";
import styles from "./sidebar.module.css";

export interface Team {
    id: string;
    name: string;
    data: null;
    description: string;
    created_at: string;
    updated_at: string;
}

interface TeamSuccessResponse {
    data: {
        teams: Team[];
    };
}

interface TeamCreateSuccessResponse {
    data: {
        team: Team;
    };
}
const Sidebar = () => {
    const { changeMode, mode } = useModeContext();
    const { teams, addTeams, addTeam, deleteTeam } = useTeamContext();
    const [loading, setLoading] = useState(false);
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [currentClickedOption, setCurrentClickedOption] =
        useState<string>("");
    const location = useLocation();
    const params = useParams();
    console.log(teams);
    useEffect(() => {
        async function getTeams() {
            try {
                setLoading(true);
                const response = await fetch(
                    "http://localhost:8080/api/teams",
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
                        },
                    },
                );
                if (response.ok) {
                    const data = (await response.json()) as TeamSuccessResponse;
                    addTeams(data.data.teams);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        getTeams();
    }, [addTeams]);

    async function deleteTeamRequest(id: string) {
        try {
            const response = await fetch(
                `http://localhost:8080/api/teams/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
                    },
                },
            );
            if (response.ok) {
                deleteTeam(id);
            }
        } catch (error) {
            console.error(error);
        }
    }
    const isLobby = location.pathname === "/lobby";
    return (
        <aside className={styles.sidebar}>
            <div className="">
                {!isLobby && (
                    <div className={styles.sidebarAction}>
                        <button
                            onClick={() => changeMode("kanban")}
                            className={`${styles.action} ${mode === "kanban" ? styles.active : ""}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-kanban-icon lucide-kanban"
                            >
                                <path d="M5 3v14" />
                                <path d="M12 3v8" />
                                <path d="M19 3v18" />
                            </svg>
                            Канбан
                        </button>
                        <button
                            onClick={() => changeMode("calendar")}
                            className={`${styles.action} ${mode === "calendar" ? styles.active : ""}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-calendar-icon lucide-calendar"
                            >
                                <path d="M8 2v4" />
                                <path d="M16 2v4" />
                                <rect
                                    width="18"
                                    height="18"
                                    x="3"
                                    y="4"
                                    rx="2"
                                />
                                <path d="M3 10h18" />
                            </svg>
                            Календарь
                        </button>
                        <Link to="/lobby" className={styles.action}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-arrow-big-left-icon lucide-arrow-big-left"
                            >
                                <path d="M10.793 19.793a.707.707 0 0 0 1.207-.5V16a1 1 0 0 1 1-1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-6a1 1 0 0 1-1-1V4.707a.707.707 0 0 0-1.207-.5l-6.94 6.94a1.207 1.207 0 0 0 0 1.707z" />
                            </svg>
                            Лобби
                        </Link>
                    </div>
                )}
                <div className="">
                    <h3>Команды</h3>
                    {loading && <p>Загрузка...</p>}
                    {!loading && teams.length === 0 && (
                        <span>Нет активных команд</span>
                    )}
                    {teams.length > 0 && (
                        <ul className={styles.teams}>
                            {teams.map((t) => (
                                <li
                                    title={t.description}
                                    className={`${styles.teamItem} ${params.teamId === t.id ? styles.active : ""}`}
                                    key={t.id}
                                >
                                    <Link
                                        className={styles.teamLink}
                                        to={`/team/${t.id}`}
                                    >
                                        {t.name}
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setShowOptions((prev) => !prev);
                                            setCurrentClickedOption(t.id);
                                        }}
                                        className={`${styles.teamOption} ${params.teamId === t.id ? styles.active : ""}`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill=""
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-ellipsis-icon lucide-ellipsis"
                                        >
                                            <circle cx="12" cy="12" r="1" />
                                            <circle cx="19" cy="12" r="1" />
                                            <circle cx="5" cy="12" r="1" />
                                        </svg>
                                    </button>
                                    {showOptions &&
                                        currentClickedOption === t.id && (
                                            <div className={styles.options}>
                                                <button
                                                    onClick={() => {
                                                        deleteTeamRequest(t.id);
                                                    }}
                                                >
                                                    Удалить
                                                </button>
                                                <button>Редактировать</button>
                                            </div>
                                        )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className={styles.teamActionsSidebar}>
                <Button
                    onClick={() => setShowTeamModal(true)}
                    className={styles.createCommand}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-plus-icon lucide-plus"
                    >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                    </svg>
                    Создать команду
                </Button>
                {!isLobby && (
                    <Button
                        onClick={() => setShowInviteModal(true)}
                        className={styles.inviteButton}
                        variant="outline"
                    >
                        Пригласить в команду
                    </Button>
                )}
                {showTeamModal &&
                    createPortal(
                        <CreateTeamModal
                            addTeam={addTeam}
                            setShowTeamModal={setShowTeamModal}
                        />,
                        document.body,
                    )}
                {showInviteModal &&
                    createPortal(
                        <InviteToTeamModal
                            setShowInviteModal={setShowInviteModal}
                        />,
                        document.body,
                    )}
            </div>
        </aside>
    );
};

function CreateTeamModal({
    setShowTeamModal,
    addTeam,
}: {
    setShowTeamModal: (val: boolean) => void;
    addTeam: (team: Team) => void;
}) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputRef]);
    const submitTeam = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/teams", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ name, description }),
            });
            if (response.ok) {
                const data =
                    (await response.json()) as TeamCreateSuccessResponse;
                addTeam(data.data.team);
                setShowTeamModal(false);
                setName("");
                setDescription("");
            }
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <>
            <div
                onClick={() => setShowTeamModal(false)}
                className={styles.overlay}
            ></div>
            <Card onSubmit={submitTeam} className={styles.teamModal} tag="form">
                <button
                    onClick={() => setShowTeamModal(false)}
                    className={styles.close}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-x-icon lucide-x"
                    >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
                <Field direction="column" gap={8}>
                    <label>Название команды</label>
                    <Input
                        ref={inputRef}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="Команда 1"
                    />
                </Field>
                <Field direction="column" gap={8}>
                    <label>Описание команды</label>
                    <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        type="text"
                        placeholder="Описание..."
                    />
                </Field>
                <Button className={styles.submitTeamModal}>
                    Создать команду
                </Button>
            </Card>
        </>
    );
}

function InviteToTeamModal({
    setShowInviteModal,
}: {
    setShowInviteModal: (val: boolean) => void;
}) {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [email, setEmail] = useState("");
    const params = useParams<{ teamId: string }>();
    const teamId = params.teamId;
    const [inviteError, setInviteError] = useState("");
    const submitInvite = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsSubmitted(true);
            setInviteError("");
            const response = await fetch(
                `http://localhost:8080/api/teams/${teamId}/invite`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ email }),
                },
            );
            if (response.ok) {
                setShowInviteModal(false);
                setEmail("");
            } else if (response.status === 409) {
                setInviteError(
                    "Такого пользователя уже приглашали в эту команду",
                );
            } else if (response.status === 422) {
                setInviteError("Неккоректная почта");
            } else if (response.status === 404) {
                setInviteError("Пользователь с такой почтой не найден");
            } else if (response.status === 403) {
                setInviteError(
                    "Только владелец команды может приглашать других пользователей",
                );
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitted(false);
        }
    };

    return (
        <>
            <div
                onClick={() => setShowInviteModal(false)}
                className="overlay"
            ></div>
            <Card
                onSubmit={submitInvite}
                className={styles.inviteModal}
                tag="form"
            >
                <button
                    onClick={() => setShowInviteModal(false)}
                    type="button"
                    className={styles.close}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-x-icon lucide-x"
                    >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
                <Field gap={8} direction="column">
                    <label htmlFor="email-invite">Почта нового участника</label>
                    <Input
                        type="email"
                        autoComplete="email"
                        id="email-invite"
                        placeholder="example@mail.ru"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {inviteError && <span>{inviteError}</span>}
                </Field>
                <Button
                    disabled={isSubmitted}
                    className={`${styles.submitInvite} ${isSubmitted ? "disabled" : "active"}`}
                >
                    Пригласить в команду
                </Button>
            </Card>
        </>
    );
}

export default Sidebar;
