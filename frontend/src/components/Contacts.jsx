import { useEffect, useState } from "react";

function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const apiBase = import.meta.env.VITE_API_BASE || "/backend";

    useEffect(() => {
        fetch(`${apiBase}/get-contacts.php`)
            .then((res) => res.json())
            .then((data) => {
                setContacts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching contacts:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <h2>Company Contacts</h2>

            {loading ? (
                <p>Loading...</p>
            ) : contacts.length === 0 ? (
                <p>No contacts found.</p>
            ) : (
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                    {contacts.map((contact, index) => (
                        <li key={index}>
                            <strong>{contact.name}</strong> – {contact.role} –{" "}
                            <a href={`mailto:${contact.email}`}>
                                {contact.email}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Contacts;
