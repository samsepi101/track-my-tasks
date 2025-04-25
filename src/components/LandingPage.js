import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
    return (
        <div
            className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-cover bg-center"
            style={{
                backgroundImage:
                    'url("https://www.w3schools.com/w3images/forest.jpg")',
            }}
        >
            {/* Header */}
            <header className="w-100 d-flex justify-content-between align-items-center px-4 py-3 bg-black bg-opacity-50 text-white shadow-md">
                <h1 className="h3 font-weight-bold ml-4">TaskTracker</h1>
                <nav className="mr-4">
                    <Link to="/login" className="text-white mr-3">
                        Login
                    </Link>
                </nav>
            </header>

            {/* Main Content */}
            <main className="text-center text-white px-4 pt-5 pb-5">
                <motion.h2
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="display-4 font-weight-bold text-shadow"
                >
                    Organize Your Tasks Like Never Before
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-4 lead"
                >
                    Manage, track, and streamline your projects with ease. Sign in to get started or explore as an admin.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="mt-4"
                >
                    <Link
                        to="/login"
                        className="btn btn-light btn-lg mr-3"
                    >
                        Get Started
                    </Link>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="text-center text-white bg-black bg-opacity-50 py-4 w-100 mt-auto">
                <p>&copy; {new Date().getFullYear()} TaskTracker. All rights reserved.</p>
            </footer>
        </div>
    );
}
