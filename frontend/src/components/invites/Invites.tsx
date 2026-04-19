import { Fragment, useEffect, useState } from "react";
import styles from "./invites.module.css";
import Button from "../button/Button";
import { useTeamContext } from "../../context/team/useTeamContext";
interface Invite {
    id: string;
    status: "pending" | "rejected" | "accepted";
    team: {
        name: string;
        description: string;
    };
}

interface InviteSuccessResponse<T> {
    data: {
        invites: T;
    };
}

interface InviteUpdateSuccessResponse {
    data: {
        invite: Invite;
    };
}

const Invites = () => {
    const [invites, setInvites] = useState<Invite[]>([]);
    const [showInvites, setShowInvites] = useState(false);
    const { addTeam } = useTeamContext();
    useEffect(() => {
        async function getInvites() {
            try {
                const response = await fetch(
                    "http://localhost:8080/api/teams/invites",
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    },
                );
                if (response.ok) {
                    const data =
                        (await response.json()) as InviteSuccessResponse<
                            Invite[]
                        >;
                    setInvites(data.data.invites);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getInvites();
    }, []);

    const activeInvites = invites.reduce((acc, inv) => {
        if (inv.status === "pending") acc += 1;
        return acc;
    }, 0);

    const inviteAction = async (
        status: "rejected" | "accepted",
        id: string,
    ) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/teams/invites/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ status }),
                },
            );
            if (response.ok) {
                const data =
                    (await response.json()) as InviteUpdateSuccessResponse;
                setInvites((prev) =>
                    prev.filter((inv) => inv.id !== data.data.invite.id),
                );
                const { description, name } = data.data.invite.team;
                if (status === "accepted") {
                    addTeam({
                        created_at: new Date().toISOString(),
                        data: null,
                        description,
                        name,
                        id: `${Date.now()}`,
                        updated_at: new Date().toISOString(),
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className={styles.notifications}>
            <button
                onClick={() => setShowInvites((prev) => !prev)}
                className={styles.notificationButton}
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
                    className="lucide lucide-bell-icon lucide-bell"
                >
                    <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                    <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
                </svg>
                <span className={styles.countInvites}>{activeInvites}</span>
            </button>
            {showInvites && (
                <div className={styles.notificationWrapper}>
                    {(activeInvites === 0 || invites.length === 0) && (
                        <p>Приглашений нет</p>
                    )}
                    {invites.length > 0 && (
                        <ul className={styles.notificationList}>
                            {invites.map((inv) => (
                                <Fragment key={inv.id}>
                                    {inv.status === "pending" && (
                                        <li>
                                            <h4>{inv.team.name}</h4>
                                            <p>{inv.team.description}</p>
                                            <div
                                                className={
                                                    styles.notificationActions
                                                }
                                            >
                                                <Button
                                                    onClick={() =>
                                                        inviteAction(
                                                            "accepted",
                                                            inv.id,
                                                        )
                                                    }
                                                    className={
                                                        styles.notificationAction
                                                    }
                                                    variant="outline"
                                                >
                                                    Принять
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        inviteAction(
                                                            "rejected",
                                                            inv.id,
                                                        )
                                                    }
                                                    className={
                                                        styles.notificationAction
                                                    }
                                                    variant="black"
                                                >
                                                    Отклонить
                                                </Button>
                                            </div>
                                        </li>
                                    )}
                                </Fragment>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default Invites;
