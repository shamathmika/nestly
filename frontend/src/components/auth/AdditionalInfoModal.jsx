import { useState } from "react";
import { useUser } from "../../context/UserContext";
import "../../styles/AdditionalModal.css";

export default function AdditionalInfoModal() {
    const { isAdditionalModalOpen, closeAdditionalModal, updateProfileDetails } =
        useUser();

    const [role, setRole] = useState("student");
    const [interests, setInterests] = useState([]);

    if (!isAdditionalModalOpen) return null;

    const toggleInterest = (val) => {
        setInterests((prev) =>
            prev.includes(val)
                ? prev.filter((i) => i !== val)
                : [...prev, val]
        );
    };

    const handleSave = async () => {
        const res = await updateProfileDetails(role, interests);
        if (!res.error) closeAdditionalModal();
    };

    return (
        <div className="auth-overlay">
            <div className="additional-modal">
                <h2>Tell us about yourself</h2>

                <label>Profession</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="student">Student</option>
                    <option value="professor">Professor</option>
                    <option value="software_developer">Software Developer</option>
                    <option value="other">Other</option>
                </select>

                <label style={{ marginTop: "1rem" }}>
                    What are you interested in?
                </label>

                <div className="interest-list">
                    {[
                        "rentals",
                        "roommate_matching",
                        "subleases",
                        "intern_housing",
                        "furniture_marketplace",
                        "student_services",
                        "bakery_whisk",
                    ].map((item) => (
                        <div
                            key={item}
                            className={`interest-item ${
                                interests.includes(item) ? "selected" : ""
                            }`}
                            onClick={() => toggleInterest(item)}
                        >
                            {item.replace(/_/g, " ")}
                        </div>
                    ))}
                </div>

                <button className="auth-submit" onClick={handleSave}>
                    Save and Continue
                </button>
            </div>
        </div>
    );
}
