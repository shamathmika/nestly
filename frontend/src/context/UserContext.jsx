import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [isAdditionalModalOpen, setAdditionalModalOpen] = useState(false);

    const apiBase = import.meta.env.VITE_API_BASE || "/api";

    // Check session on initial load
    useEffect(() => {
        fetch(`${apiBase}/auth/session.php`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.loggedIn) {
                    setUser(data.user);
                }
            })
            .catch(() => {});
    }, []);

    const openAuthModal = () => setAuthModalOpen(true);
    const closeAuthModal = () => setAuthModalOpen(false);

    const openAdditionalModal = () => setAdditionalModalOpen(true);
    const closeAdditionalModal = () => setAdditionalModalOpen(false);

    // LOGIN
    const login = async (email, password) => {
        const res = await fetch(`${apiBase}/auth/login.php`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (data.error) return { error: data.error };

        setUser(data.user);
        closeAuthModal();
        return { success: true };
    };

    // SIGNUP
    const signup = async (name, email, password) => {
        const res = await fetch(`${apiBase}/auth/signup.php`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (data.error) return { error: data.error };

        setUser(data.user);
        closeAuthModal();
        openAdditionalModal();
        return { success: true };
    };

    // UPDATE ROLE + INTERESTS
    const updateProfileDetails = async (role, interests) => {
        const res = await fetch(`${apiBase}/users/update-profile.php`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role, interests }),
        });

        const data = await res.json();

        if (data.error) return { error: data.error };

        setUser(data.user);
        closeAdditionalModal();
        return { success: true };
    };

    // LOGOUT
    const logout = async () => {
        await fetch(`${apiBase}/auth/logout.php`, {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
    };

    return (
        <UserContext.Provider
            value={{
                user,
                login,
                signup,
                logout,
                updateProfileDetails,
                isAuthModalOpen,
                openAuthModal,
                closeAuthModal,
                isAdditionalModalOpen,
                openAdditionalModal,
                closeAdditionalModal,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
