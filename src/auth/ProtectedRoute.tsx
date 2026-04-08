import React, { useState, type ReactNode, } from "react";

type Props = {
    children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
    const [auth, setAuth] = useState<boolean>(() => {
        return sessionStorage.getItem("auth") === "true";
    });

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const login = () => {
        if (username === "Sawa" && password === "Sawa_2424") {
            sessionStorage.setItem("auth", "true");
            setAuth(true);
        } else {
            alert("Wrong credentials");
        }
    };

    // const logout = () => {
    //     sessionStorage.removeItem("auth");
    //     setAuth(false);
    // };

    if (!auth) {
        return (
            <div style={styles.container}>
                <div style={styles.box}>
                    <h2 style={{ direction: "ltr" }}> Restricted Area 🔐</h2>

                    <input
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        style={styles.input}
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button style={styles.button} onClick={login}>
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {children}
        </>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        height: "100vh",
        direction: "ltr",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#111",
        color: "#fff",
    },

    box: {
        padding: "30px",
        borderRadius: "10px",
        background: "#222",
        direction: "ltr",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "350px",
    },

    input: {
        direction: "ltr",
        padding: "10px",
        borderRadius: "5px",
        border: "none",
        outline: "none",
    },

    button: {
        direction: "ltr",
        padding: "10px",
        background: "#fff",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px",
    },

    logout: {
        direction: "ltr",
        position: "fixed",
        top: "10px",
        right: "10px",
        padding: "8px 12px",
        background: "red",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};