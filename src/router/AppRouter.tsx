import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";

/* Pages */
import {
    About,
    Dash,
    Date_lisson,
    Home,
    Login,
    Questions,
    Articles,
    Level_division,
    Register,
    Teachers,
    Study_materials,
    More_services,
    Support,
    Fees,
    Login_users,
    Register_accounts,
    Dash_users,
    Privacy,
    CommetS,
    Term,
    Dash_Teachers,
    Reset_Password,
} from "../pages/index";

import { LevelTest } from "../sections";
import ProtectedRoute from "../components/ProtectedRoute";
import UserLayout from "../Layout/UserLayout";


/* =========================
   Helpers
========================= */

const isAuth = () => localStorage.getItem("token") !== null;
const hasAccess = () =>
    !!(localStorage.getItem("token"));

/* =========================
   Router
========================= */

const router = createBrowserRouter([
    /* ================= PUBLIC ================= */
    {
        path: "/", element: <UserLayout />, children: [{
            index: true,
            element: <Home />
        },
        { path: "About", element: <About /> },
        { path: "Date", element: <Date_lisson /> },
        { path: "Articles", element: <Articles /> },
        { path: "Level_division", element: <Level_division /> },
        { path: "Teachers", element: <Teachers /> },
        { path: "Study_materials", element: <Study_materials /> },
        { path: "More_services", element: <More_services /> },
        { path: "Support", element: <Support /> },
        { path: "Fees", element: <Fees /> },
        { path: "Comments", element: <CommetS /> },
        { path: "Questions", element: <Questions /> },
        { path: "Privacy", element: <Privacy /> },
        { path: "Terms", element: <Term /> },
        { path: "Level-test", element: <LevelTest /> },
        { path: "Reset_Password", element: <Reset_Password /> },

        /* ================= AUTH ================= */
        {
            path: "Login",
            element: hasAccess() ? <Navigate to="/" /> : <Login />,
        },
        {
            path: "Register",
            element: hasAccess() ? <Navigate to="/" /> : <Register />,
        },
        {
            path: "Login_users",
            element: hasAccess() ? <Navigate to="/" /> : <Login_users />,
        },
        {
            path: "Register_account",
            element: hasAccess() ? <Navigate to="/" /> : <Register_accounts />,
        },

        ]
    },

    /* ================= DASHBOARD ================= */
    {
        path: "/Dash",
        element: (
            <ProtectedRoute isAuthenticated={isAuth()}>
                <Dash />
            </ProtectedRoute>
        ),
    },
    {
        path: "/Dash_Teachers",
        element: (
            <ProtectedRoute isAuthenticated={isAuth()}>
                <Dash_Teachers />
            </ProtectedRoute>
        ),
    },
    {
        path: "/Dash_users/:userId",
        element: (
            <ProtectedRoute isAuthenticated={isAuth()}>
                <Dash_users />
            </ProtectedRoute>
        ),
    },

    /* ================= FALLBACK ================= */
    {
        path: "*",
        element: <Navigate to="/" />,
    },
]);

/* =========================
   App Router Component
========================= */

export default function AppRouter() {
    return <RouterProvider router={router} />;
}