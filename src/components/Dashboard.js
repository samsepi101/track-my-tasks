import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    query,
    where,
    onSnapshot,
    getDoc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Loading from './Loading';
import './Dashboard.css';

export default function Dashboard() {
    const [task, setTask] = useState({ title: "", description: "", deadline: "" });
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [editTask, setEditTask] = useState(null);
    const [editedData, setEditedData] = useState({ title: "", description: "", deadline: "" });

    const navigate = useNavigate();

    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    console.log("Notification permission granted!");
                }
            });
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                navigate("/");
            } else {
                setUser(currentUser);
                await fetchUserName(currentUser.uid);

                const q = query(collection(db, "tasks"), where("userId", "==", currentUser.uid));
                const unsubscribeTasks = onSnapshot(q, (querySnapshot) => {
                    const data = querySnapshot.docs.map((doc) => {
                        const taskData = doc.data();
                        const currentDate = new Date();
                        const taskDeadline = new Date(taskData.deadline);

                        if (
                            taskDeadline.getDate() === currentDate.getDate() &&
                            taskDeadline.getMonth() === currentDate.getMonth() &&
                            taskDeadline.getFullYear() === currentDate.getFullYear() &&
                            !taskData.completed
                        ) {
                            showDeadlineNotification(taskData.title);
                        }

                        return {
                            id: doc.id,
                            ...taskData,
                        };
                    });
                    setTasks(data);
                    setIsLoading(false);
                });

                checkIfAdmin(currentUser.uid);

                return () => unsubscribeTasks();
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const fetchUserName = async (uid) => {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            setUserName(userSnap.data().name || "");
        }
    };

    const checkIfAdmin = async (uid) => {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            setIsAdmin(userSnap.data().role === "admin");
        }
    };

    const showDeadlineNotification = (taskTitle) => {
        if (Notification.permission === "granted") {
            const notification = new Notification("Task Deadline Today!", {
                body: `Your task "${taskTitle}" is due today.`,
                icon: "/path/to/your/icon.png",
            });

            setTimeout(() => {
                notification.close();
            }, 5000);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!user) return;

        await addDoc(collection(db, "tasks"), {
            ...task,
            completed: false,
            userId: user.uid,
        });

        setTask({ title: "", description: "", deadline: "" });
    };

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "tasks", id));
    };

    const toggleComplete = async (taskId, currentStatus) => {
        await updateDoc(doc(db, "tasks", taskId), {
            completed: !currentStatus,
        });
    };

    const openEditModal = (task) => {
        setEditTask(task);
        setEditedData({
            title: task.title,
            description: task.description,
            deadline: task.deadline,
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prev) => ({ ...prev, [name]: value }));
    };

    const saveEdit = async () => {
        await updateDoc(doc(db, "tasks", editTask.id), {
            ...editedData,
        });
        setEditTask(null);
    };

    const isTaskOverdue = (task) => {
        const today = new Date();
        const deadline = new Date(task.deadline);
        return !task.completed && deadline < today;
    };

    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="container-fluid bg-light p-0 m-0">
            <h2 className="text-center main-heading text-white header-background m-0">Task Tracker</h2>

            <div className="scroll-text-container">
                <div className="scroll-text">
                    "The future depends on what we do in the present." – Mahatma Gandhi
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center flex-wrap px-4 mt-4">
    {isAdmin && (
        <button
            onClick={() => navigate("/admin")}
            className="btn btn-secondary"
        >
            Admin Panel
        </button>
    )}

    <div className="d-flex align-items-center gap-3">
        {/* Account Name */}
        <div
            className="text-primary text-decoration-underline"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/account")}
        >
            {userName}
        </div>

        {/* Logout */}
        <button
            onClick={() => signOut(auth)}
            className="btn btn-danger"
        >
            Logout
        </button>
    </div>
</div>


            {/* Add Task Form */}
            <h3 className="text-center mb-4">Add a Task</h3>
            <div className="d-flex justify-content-center">
                <form onSubmit={handleAddTask} className="mb-4" style={{ maxWidth: '400px', width: '100%' }}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={task.title}
                        required
                        onChange={(e) => setTask({ ...task, title: e.target.value })}
                        className="form-control mb-3"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={task.description}
                        required
                        onChange={(e) => setTask({ ...task, description: e.target.value })}
                        className="form-control mb-3"
                    />
                    <input
                        type="date"
                        value={task.deadline}
                        required
                        onChange={(e) => setTask({ ...task, deadline: e.target.value })}
                        className="form-control mb-3"
                    />
                    <div className="d-flex justify-content-center mt-2">
                        <button type="submit" className="btn btn-primary">
                            Add Task
                        </button>
                    </div>
                </form>
            </div>

            <div className="container-fluid px-5">
                <h3>Your Tasks</h3>

                {/* Search */}
                <input
                    type="text"
                    className="form-control mb-4"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Task List */}
                <div className="row">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => (
                            <div key={task.id} className="col-sm-12 col-md-6 col-lg-4 mb-4 task-card">
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">{task.title}</h5>
                                        <p><strong>Description:</strong> {task.description}</p>
                                        <p><strong>Deadline:</strong> {task.deadline}</p>
                                        <p>
                                            <strong>Status:</strong>{" "}
                                            <span
                                                className={
                                                    task.completed
                                                        ? "text-success"
                                                        : isTaskOverdue(task)
                                                            ? "text-danger"
                                                            : "text-warning"
                                                }
                                            >
                                                {task.completed
                                                    ? "✅ Completed"
                                                    : isTaskOverdue(task)
                                                        ? "❗ Overdue"
                                                        : "⏳ Incomplete"}
                                            </span>
                                        </p>
                                        <div className="d-flex justify-content-end mt-3">
                                            <button
                                                className="btn btn-outline-success btn-sm"
                                                onClick={() => toggleComplete(task.id, task.completed)}
                                            >
                                                {task.completed ? "Undo" : "Complete"}
                                            </button>
                                            <button
                                                className="btn btn-outline-info btn-sm ms-2"
                                                onClick={() => openEditModal(task)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-outline-danger btn-sm ms-2"
                                                onClick={() => handleDelete(task.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center text-muted">
                            <h5>🔍 No tasks match your search.</h5>
                        </div>
                    )}
                </div>

                {editTask && (
                    <>
                        {/* Modal */}
                        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit Task</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setEditTask(null)}
                                        />
                                    </div>
                                    <div className="modal-body">
                                        <input
                                            type="text"
                                            name="title"
                                            value={editedData.title}
                                            onChange={handleEditChange}
                                            placeholder="Title"
                                            className="form-control mb-3"
                                        />
                                        <textarea
                                            name="description"
                                            value={editedData.description}
                                            onChange={handleEditChange}
                                            placeholder="Description"
                                            className="form-control mb-3"
                                        />
                                        <input
                                            type="date"
                                            name="deadline"
                                            value={editedData.deadline}
                                            onChange={handleEditChange}
                                            className="form-control mb-3"
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setEditTask(null)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={saveEdit}
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-backdrop fade show" onClick={() => setEditTask(null)}></div>
                    </>
                )}
            </div>
        </div>
    );
}
