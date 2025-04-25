import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
} from "firebase/firestore";
import Loading from "./Loading"; // Import the Loading component

function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                navigate("/");
                return;
            }
            const tokenResult = await user.getIdTokenResult();
            const isAdmin = tokenResult.claims.admin;
            if (!isAdmin) {
                alert("Access denied. Admins only.");
                navigate("/dashboard");
                return;
            }
            fetchUsersAndTasks();
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchUsersAndTasks = async () => {
        setIsLoading(true);
        const usersSnapshot = await getDocs(collection(db, "users"));
        const tasksSnapshot = await getDocs(collection(db, "tasks"));
        setUsers(usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setTasks(tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setIsLoading(false);
    };

    const confirmDeleteUser = (user) => {
        setSelectedUser(user);
        setShowDeleteUserModal(true);
    };

    const handleDeleteUser = async () => {
        setIsLoading(true); // Show loading spinner during delete
        if (!selectedUser) return;
        const userTasks = tasks.filter((task) => task.userId === selectedUser.id);
        for (const task of userTasks) {
            await deleteDoc(doc(db, "tasks", task.id));
        }
        await deleteDoc(doc(db, "users", selectedUser.id));
        setShowDeleteUserModal(false);
        setSelectedUser(null);
        fetchUsersAndTasks(); // Re-fetch data after deletion
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        setIsLoading(true); // Show loading spinner during delete task
        await deleteDoc(doc(db, "tasks", taskId));
        fetchUsersAndTasks(); // Re-fetch data after task deletion
    };

    const openEditModal = (user) => {
        setEditUser({ ...user });
        setShowEditModal(true);
    };

    const handleEditUserSave = async () => {
        setIsLoading(true); // Show loading spinner during user edit
        const userRef = doc(db, "users", editUser.id);
        await updateDoc(userRef, {
            name: editUser.name,
            email: editUser.email,
        });
        setShowEditModal(false);
        fetchUsersAndTasks(); // Re-fetch data after editing user
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    return (
        <div className="container py-5">
            <h1 className="display-4 mb-4">Admin Panel</h1>
            <input
                type="text"
                placeholder="Search users by name"
                value={searchQuery}
                onChange={handleSearchChange}
                className="form-control mb-4 w-50"
            />
            {isLoading ? (
                <Loading fullScreen={false} /> // Show loading component while fetching
            ) : (
                <div className="row g-4">
                    {users
                        .filter((user) => user.name?.toLowerCase().startsWith(searchQuery)) // Match users whose name starts with the search query
                        .map((user) => (
                            <div key={user.id} className="col-12 col-md-6">
                                <div className="card shadow">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <h5 className="card-title">{user.name || "No Name"}</h5>
                                            <button onClick={() => openEditModal(user)} className="btn btn-link btn-sm">Edit</button>
                                        </div>
                                        <p>Email: {user.email}</p>
                                        <p>UID: {user.id}</p>
                                        <div>
                                            <p className="fw-bold">Tasks:</p>
                                            <ul className="list-unstyled">
                                                {tasks.filter((t) => t.userId === user.id).map((task) => (
                                                    <li key={task.id} className="d-flex justify-content-between text-sm">
                                                        <span>{task.title || "(No Title)"}</span>
                                                        <button onClick={() => handleDeleteTask(task.id)} className="btn btn-danger btn-sm">Delete</button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <button onClick={() => confirmDeleteUser(user)} className="btn btn-danger mt-4">
                                            {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "Delete User & Tasks"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteUserModal && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete <strong>{selectedUser?.name}</strong> and all their tasks?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteUserModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={handleDeleteUser}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="editModalLabel">Edit User</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        value={editUser.name}
                                        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        value={editUser.email}
                                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleEditUserSave}>
                                    {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPanel;
