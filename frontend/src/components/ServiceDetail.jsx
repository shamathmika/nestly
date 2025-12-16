import { useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../context/UserContext";
import "../styles/ServiceDetail.css";

const apiBase = import.meta.env.VITE_API_BASE ?? "/api";

export default function ServiceDetail() {
    const { id } = useParams();
    const { user, openAuthModal } = useUser();
    const reviewsRef = useRef(null);

    const [listing, setListing] = useState(null);
    const [error, setError] = useState("");

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [userHasReview, setUserHasReview] = useState(false);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const scrollToReviews = () => {
        reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    /* -------------------------------------------------------------
       LOAD LISTING + TRACK VISIT  (THIS IS WHAT WAS MISSING!)
    ------------------------------------------------------------- */
    useEffect(() => {
        if (!id) return;

        fetch(`${apiBase}/listings/get-listings.php`)
            .then(res => res.json())
            .then(data => {
                const found = data.find(p => String(p.id) === String(id));
                setListing(found || null);
            })
            .catch(() => setError("Failed to load listing details."));

        // *** RESTORED VISIT TRACKING ***
        fetch(`${apiBase}/listings/set-visit.php?id=${id}`, {
            credentials: "include",
        }).catch((err) =>
            console.warn("Visit tracking failed:", err)
        );
    }, [id]);

    /* -------------------------------------------------------------
       LOAD REVIEWS
    ------------------------------------------------------------- */
    useEffect(() => {
        if (!id) return;

        fetch(`${apiBase}/reviews/get-reviews.php?rental_id=${id}`)
            .then(res => res.json())
            .then(data => {
                const sorted = [...data].sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );
                setReviews(sorted);

                if (user) {
                    const mine = sorted.find(r => r.user_id === user.id);
                    if (mine) {
                        setUserHasReview(true);
                        setRating(mine.rating);
                        setComment(mine.comment);
                    } else {
                        setUserHasReview(false);
                        setRating(0);
                        setComment("");
                    }
                }
            });
    }, [id, user]);

    const myReview = reviews.find(r => user && r.user_id === user.id);

    /* -------------------------------------------------------------
       SUBMIT REVIEW (CREATE/UPDATE)
    ------------------------------------------------------------- */
    const submitReview = async () => {
        const res = await fetch(`${apiBase}/reviews/add-or-update-review.php`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rental_id: id, rating, comment }),
        });

        const data = await res.json();
        if (data.success) {
            const updated = await fetch(
                `${apiBase}/reviews/get-reviews.php?rental_id=${id}`
            ).then(r => r.json());

            const sorted = [...updated].sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );

            setReviews(sorted);
            setEditMode(false);
            setUserHasReview(true);
        }
    };

    /* -------------------------------------------------------------
       DELETE REVIEW
    ------------------------------------------------------------- */
    const deleteReview = async () => {
        const res = await fetch(`${apiBase}/reviews/delete-review.php`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rental_id: id }),
        });

        const data = await res.json();
        if (data.success) {
            const updated = await fetch(
                `${apiBase}/reviews/get-reviews.php?rental_id=${id}`
            ).then(r => r.json());

            const sorted = [...updated].sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );

            setReviews(sorted);
            setUserHasReview(false);
            setRating(0);
            setComment("");
            setEditMode(false);
        }
    };

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!listing) return <p>Loading...</p>;

    const avg =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

    const avgStars =
        "★".repeat(Math.round(avg)) +
        "☆".repeat(5 - Math.round(avg));

    const orderedReviews = myReview
        ? [myReview, ...reviews.filter(r => r.user_id !== user?.id)]
        : reviews;

    return (
        <div className="sd-wrapper">
            <h2>{listing.title}</h2>

            {reviews.length > 0 && (
                <div className="avg-rating-container avg-rating-clickable"
                     onClick={scrollToReviews}
                >
                    <span className="avg-stars">{avgStars}</span>
                    <span className="avg-rating-text">
                        {avg.toFixed(1)} · {reviews.length}{" "}
                        review{reviews.length > 1 ? "s" : ""}
                    </span>
                </div>
            )}

            <img src={listing.image_url} alt={listing.title} className="sd-image" />

            <p><strong>Address:</strong> {listing.address}</p>
            <p><strong>Rent:</strong> ${listing.rent} / month</p>
            <p><strong>Beds/Baths:</strong> {listing.bedrooms} bd / {listing.bathrooms} ba</p>

            <p className="sd-description">{listing.description}</p>

            <h4>Amenities</h4>
            <ul>{listing.amenities.map((a, i) => <li key={i}>{a}</li>)}</ul>

            <hr className="sd-divider" />

            {/* REVIEWS SECTION */}
            <h3 ref={reviewsRef}>Reviews</h3>

            {orderedReviews.map((r) => {
                const isMine = user && r.user_id === user.id;

                return (
                    <div key={r.id} className="review-box">
                        <div className="review-header-top">
                            <div className="review-header-left">
                                <strong>{r.user_name}</strong>
                                <span className="review-date">{formatDate(r.created_at)}</span>
                            </div>

                            {isMine && !editMode && (
                                <div className="review-actions">
                                    <button
                                        className="review-edit-link"
                                        onClick={() => {
                                            setEditMode(true);
                                            setRating(r.rating);
                                            setComment(r.comment);
                                        }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="review-delete-btn"
                                        onClick={deleteReview}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="20"
                                            width="20"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M9 3v1H4v2h1v13c0 1.1.9 2 
                                            2 2h10c1.1 0 2-.9 2-2V6h1V4h-5V3H9zm8 
                                            4v13H7V7h10zM9 9h2v9H9V9zm4 
                                            0h2v9h-2V9z"/>
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="review-stars-inline">
                            {"★".repeat(r.rating)}
                            {"☆".repeat(5 - r.rating)}
                        </div>

                        <p className="review-comment">{r.comment}</p>
                    </div>
                );
            })}

            {/* Write new review */}
            {user && !userHasReview && !editMode && (
                <div className="review-form">
                    <h4>Write a review</h4>

                    <div className="rating-stars">
                        {[1,2,3,4,5].map(n => (
                            <span
                                key={n}
                                onClick={() => setRating(n)}
                                className={n <= rating ? "star selected" : "star"}
                            >
                                ★
                            </span>
                        ))}
                    </div>

                    <textarea
                        className="review-textarea"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <button className="review-submit-btn" onClick={submitReview}>
                        Submit Review
                    </button>
                </div>
            )}

            {/* Edit mode */}
            {user && editMode && (
                <div className="review-form">
                    <h4>Edit your review</h4>

                    <div className="rating-stars">
                        {[1,2,3,4,5].map(n => (
                            <span
                                key={n}
                                onClick={() => setRating(n)}
                                className={n <= rating ? "star selected" : "star"}
                            >
                                ★
                            </span>
                        ))}
                    </div>

                    <textarea
                        className="review-textarea"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <button className="review-submit-btn" onClick={submitReview}>
                        Save Changes
                    </button>

                    <button
                        className="review-cancel-btn"
                        onClick={() => setEditMode(false)}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {!user && (
                <p className="sd-login-hint">
                    Please{" "}
                    <span onClick={openAuthModal} className="sd-login-link">
                        log in
                    </span>{" "}
                    to write a review.
                </p>
            )}

            <div className="sd-links">
                <Link to="/services">← Back to Listings</Link> |{" "}
                <Link to="/services/recent">Last 5 Visited</Link> |{" "}
                <Link to="/services/top">Most Visited</Link>
            </div>
        </div>
    );
}
