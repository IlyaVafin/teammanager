import { useParams } from "react-router";
import Button from "../button/Button";
import styles from "./kanban.module.css";
import { useEffect, useState } from "react";
export interface Column {
    id: string;
    title: string;
    team_id: string;
    created_at: string;
    updated_at: string;
}

interface ColumnSuccessResponse {
    data: {
        columns: Column[];
    };
}

interface ColumnCreateSuccessResponse {
    data: Column;
}
const Kanban = () => {
    const params = useParams<{ teamId: string }>();
    const [columns, setColumns] = useState<Column[]>([]);
    const [editValue, setEditValue] = useState("");
    const [isEditColumn, setIsEditColumn] = useState(false);
    const [currentId, setCurrentId] = useState("");
    const addColumn = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/column/${params.teamId}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ title: "New column" }),
                },
            );
            if (response.ok) {
                const data =
                    (await response.json()) as ColumnCreateSuccessResponse;
                setColumns((prev) => [...prev, data.data]);
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        async function getColumns() {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/columns/${params.teamId}`,
                    {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    },
                );
                if (response.ok) {
                    const data =
                        (await response.json()) as ColumnSuccessResponse;
                    setColumns(data.data.columns);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getColumns();
    }, [params.teamId]);

    async function editColumn(id: string) {
        try {
            const response = await fetch(
                `http://localhost:8080/api/column/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ title: editValue }),
                },
            );
            if (response.ok) {
                setColumns((prev) =>
                    prev.map((col) =>
                        col.id === id ? { ...col, title: editValue } : col,
                    ),
                );
            }
        } catch (error) {
            console.error(error);
        } finally {
            cancelEdit();
        }
    }

    function cancelEdit() {
        setEditValue("");
        setCurrentId("");
        setIsEditColumn(false);
    }

    async function deleteColumn(id: string) {
        try {
            const response = await fetch(
                `http://localhost:8080/api/column/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                },
            );
            if (response.ok) {
                setColumns((prev) => prev.filter((col) => col.id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className={styles.columns}>
            {columns.length > 0 && (
                <ul className={styles.columnsList}>
                    {columns.map((col) => (
                        <li className={styles.column}>
                            <span className={styles.columnTitle}>
                                {col.title}
                                <div className={styles.columnActions}>
                                    <button
                                        onClick={() => {
                                            setIsEditColumn(true);
                                            setCurrentId(col.id);
                                            setEditValue(col.title);
                                        }}
                                        className={`${styles.columnAction} ${isEditColumn && currentId === col.id ? styles.active : ""}`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-pencil-icon lucide-pencil"
                                        >
                                            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                            <path d="m15 5 4 4" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => deleteColumn(col.id)}
                                        className={styles.columnAction}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            className="lucide lucide-trash-icon lucide-trash"
                                        >
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                            <path d="M3 6h18" />
                                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </button>
                                </div>
                            </span>
                            {isEditColumn && col.id === currentId && (
                                <form className={styles.editForm}>
                                    <input
                                        onChange={(e) =>
                                            setEditValue(e.target.value)
                                        }
                                        value={editValue}
                                        className={styles.columnTitle}
                                    />
                                    <div className={styles.editButtons}>
                                        <button
                                            type="button"
                                            onClick={() => editColumn(col.id)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-check-icon lucide-check"
                                            >
                                                <path d="M20 6 9 17l-5-5" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            type="button"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
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
                                    </div>
                                </form>
                            )}
                            <Button
                                className={styles.createTaskButton}
                                variant="outline"
                            >
                                {" "}
                                <svg
                                    xmlns="http://www.w3 .org/2000/svg"
                                    width="20"
                                    height="20"
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
                                Добавить задачу
                            </Button>
                        </li>
                    ))}
                    <li>
                        <Button
                            onClick={async () => await addColumn()}
                            className={styles.createColumn}
                            variant="ghost"
                        >
                            <svg
                                xmlns="http://www.w3 .org/2000/svg"
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
                            Добавить колонку
                        </Button>
                    </li>
                </ul>
            )}
        </div>
    );
};

export default Kanban;
