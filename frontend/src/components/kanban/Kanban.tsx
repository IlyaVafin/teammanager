import { useParams } from "react-router";
import Button from "../button/Button";
import styles from "./kanban.module.css";
import {
    Dispatch,
    FormEvent,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import Card from "../card/Card";
import Field from "../field/Field";
import Input from "../input/Input";
import { createPortal } from "react-dom";

export interface Task {
    id: string;
    title: string;
    position: number;
    column_id: string;
    deadline: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Column {
    id: string;
    title: string;
    team_id: string;
    created_at: string;
    updated_at: string;
    tasks: Task[];
}

interface ColumnSuccessResponse {
    data: {
        team_title: string;
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
    const [teamTitle, setTeamTitle] = useState("");
    const [isEditColumn, setIsEditColumn] = useState(false);
    const [currentId, setCurrentId] = useState("");
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [currentColumnId, setCurrentColumnId] = useState("");

    const [draggableId, setDraggableId] = useState("");
    const [draggablePosition, setDraggablePosition] = useState<number>();

    const [fromColumnIdState, setFromColumnIdState] = useState<string>("");

    const [editTaskId, setEditTaskId] = useState<string>("");
    const [showUpdateTask, setShowUpdateTask] = useState(false);
    async function changePositions(
        dragIndex: number,
        dropIndex: number,
        columnId: string,
    ) {
        const column = columns.find((c) => c.id === columnId);
        const newTasks = [...(column?.tasks ?? [])];
        const [movedItem] = newTasks.splice(dragIndex, 1);

        newTasks.splice(dropIndex, 0, movedItem);

        setColumns((prev) =>
            prev.map((c) =>
                c.id === columnId ? { ...c, tasks: newTasks } : c,
            ),
        );

        await updatePositions(dropIndex);
    }

    function changeTaskColumn(
        fromColumnId: string,
        taskId: string,
        toColumnId: string,
    ) {
        const fromColumn = columns.find((c) => c.id === fromColumnId);
        if (!fromColumn) return;
        const task = fromColumn.tasks.find((t) => t.id === taskId);
        if (!task) return;
        const newTasks = fromColumn.tasks.filter((t) => t.id !== taskId);
        setColumns((prev) =>
            prev.map((col) =>
                col.id === fromColumnId ? { ...col, tasks: newTasks } : col,
            ),
        );
        setColumns((prev) =>
            prev.map((col) =>
                col.id === toColumnId
                    ? { ...col, tasks: [...col.tasks, task] }
                    : col,
            ),
        );
    }

    async function updatePositions(dropIndex: number) {
        try {
            await fetch("http://localhost:8080/api/task/position", {
                method: "PATCH",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    id: draggableId,
                    new_position: dropIndex,
                }),
            });
        } catch (error) {
            console.error(error);
        }
    }

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
                    setTeamTitle(data.data.team_title);
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

    async function deleteTask(taskId: string, columnId: string) {
        try {
            const response = await fetch(
                `http://localhost:8080/api/task/${taskId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                },
            );
            if (response.ok) {
                setColumns((prev) =>
                    prev.map((c) =>
                        c.id === columnId
                            ? {
                                  ...c,
                                  tasks: c.tasks.filter((t) => t.id !== taskId),
                              }
                            : c,
                    ),
                );
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className={styles.columns}>
            <ul className={styles.columnsList}>
                {columns.map((col) => (
                    <li key={col.id} className={styles.column}>
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
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
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
                                    <button onClick={cancelEdit} type="button">
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
                        <div className={styles.taskList}>
                            {col?.tasks &&
                                col.tasks.map((t, i) => (
                                    <Card
                                        draggable
                                        onDragStart={() => {
                                            setDraggableId(t.id);
                                            setDraggablePosition(i);
                                            setFromColumnIdState(col.id);
                                        }}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            if (
                                                draggablePosition !== undefined
                                            ) {
                                                changePositions(
                                                    draggablePosition,
                                                    i,
                                                    col.id,
                                                );
                                            }
                                        }}
                                        key={t.id}
                                        className={styles.task}
                                        tag="div"
                                    >
                                        <div className="">
                                            <h4>{t.title}</h4>
                                            <p>{teamTitle}</p>
                                            <span>
                                                {`${new Date(t.deadline).toDateString().slice(4)} ${new Date(t.deadline).toTimeString().slice(0, 5)}`}
                                            </span>
                                        </div>
                                        <div className={styles.taskActions}>
                                            <button
                                                onClick={() =>
                                                    deleteTask(t.id, col.id)
                                                }
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-trash-icon lucide-trash"
                                                >
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                                    <path d="M3 6h18" />
                                                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditTaskId(t.id);
                                                    setShowUpdateTask(true);
                                                    setCurrentColumnId(col.id);
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
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
                                            {showUpdateTask && (
                                                <>
                                                    {createPortal(
                                                        <TaskModal
                                                            currentColumnId={
                                                                currentColumnId
                                                            }
                                                            editTaskId={
                                                                editTaskId
                                                            }
                                                            setColumns={
                                                                setColumns
                                                            }
                                                            setShowCreateTask={
                                                                setShowUpdateTask
                                                            }
                                                            type="update"
                                                        />,
                                                        document.body,
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                        </div>
                        <Button
                            onClick={() => {
                                setShowCreateTask(true);
                                setCurrentColumnId(col.id);
                            }}
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
                        {showCreateTask && (
                            <>
                                {createPortal(
                                    <TaskModal
                                        editTaskId={editTaskId}
                                        type="create"
                                        setColumns={setColumns}
                                        currentColumnId={currentColumnId}
                                        setShowCreateTask={setShowCreateTask}
                                    />,
                                    document.body,
                                )}
                            </>
                        )}
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
        </div>
    );
};
interface TaskCreateSuccessResponse {
    data: {
        task: Task;
    };
}
function TaskModal({
    setShowCreateTask,
    currentColumnId,
    setColumns,
    type,
    editTaskId,
}: {
    setShowCreateTask: (val: boolean) => void;
    currentColumnId: string;
    setColumns: Dispatch<SetStateAction<Column[]>>;
    type: "create" | "update";
    editTaskId: string;
}) {
    const [task, setTask] = useState({
        title: "",
        description: "",
        deadline: "",
    });

    const changeField = (key: string, value: string) =>
        setTask((prev) => ({ ...prev, [key]: value }));

    const createTask = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { deadline, description, title } = task;
            const response = await fetch(
                `http://localhost:8080/api/task/column/${currentColumnId}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        deadline: new Date(deadline).toISOString(),
                    }),
                },
            );
            if (response.ok) {
                const data =
                    (await response.json()) as TaskCreateSuccessResponse;
                setColumns((prev) =>
                    prev.map((c) =>
                        c.id === currentColumnId
                            ? {
                                  ...c,
                                  tasks: c.tasks
                                      ? [...c.tasks, data.data.task]
                                      : [data.data.task],
                              }
                            : c,
                    ),
                );
                setShowCreateTask(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const updateTask = async (
        e: FormEvent<HTMLFormElement>,
        taskId: string,
    ) => {
        e.preventDefault();
        try {
            const { deadline, description, title } = task;
            const response = await fetch(
                `http://localhost:8080/api/task/${taskId}`,
                {
                    method: "PATCH",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        deadline: new Date(deadline).toISOString(),
                    }),
                },
            );
            if (response.ok) {
                const data =
                    (await response.json()) as TaskCreateSuccessResponse;
                setColumns((prev) =>
                    prev.map((c) =>
                        c.id === currentColumnId
                            ? {
                                  ...c,
                                  tasks: c.tasks.map((t) =>
                                      t.id === taskId
                                          ? { ...data.data.task }
                                          : t,
                                  ),
                              }
                            : c,
                    ),
                );
                setShowCreateTask(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div
                onClick={() => setShowCreateTask(false)}
                className="overlay"
            ></div>
            <Card
                onSubmit={(e) => {
                    if (type === "create") {
                        createTask(e);
                    } else {
                        updateTask(e, editTaskId);
                    }
                }}
                className={styles.createTaskModal}
                tag="form"
            >
                <Field className={styles.fieldTask} gap={8} direction="column">
                    <label htmlFor="task-title">Название задачи</label>
                    <Input
                        onChange={(e) => changeField("title", e.target.value)}
                        value={task.title}
                        type="text"
                        id="task-title"
                    />
                </Field>
                <Field className={styles.fieldTask} gap={8} direction="column">
                    <label htmlFor="task-description">Описание задачи</label>
                    <Input
                        onChange={(e) =>
                            changeField("description", e.target.value)
                        }
                        value={task.description}
                        type="text"
                        id="task-description"
                    />
                </Field>
                <Field className={styles.fieldTask} gap={8} direction="column">
                    <label htmlFor="">Срок завершения</label>
                    <Input
                        onChange={(e) =>
                            changeField("deadline", e.target.value)
                        }
                        value={task.deadline}
                        type="datetime-local"
                    />
                </Field>
                <Button className={styles.submitCreateTask} value="black">
                    Создать задачу
                </Button>
            </Card>
        </>
    );
}

export default Kanban;
