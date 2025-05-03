import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AccountPage() {
    const [userData, setUserData] = useState(null);
    const [editedData, setEditedData] = useState({ name: "", email: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (!user) {
                navigate("/");
                return;
            }

            const userRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                setUserData(docSnap.data());
                setEditedData({
                    name: docSnap.data().name || "",
                    email: docSnap.data().email || "",
                });
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleChange = (e) => {
        setEditedData({ ...editedData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            name: editedData.name,
            email: editedData.email,
        });

        alert("Profile updated!");
    };

    if (!userData) return <p>Loading...</p>;

    return (
        <div className="container mt-5">
            <h2>My Account</h2>
            <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={editedData.name}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={editedData.email}
                    onChange={handleChange}
                    readOnly
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Gender</label>
                <input
                    type="text"
                    className="form-control"
                    value={userData.gender}
                    readOnly
                />
            </div>
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
        </div>
    );
}
