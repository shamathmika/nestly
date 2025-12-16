import { useNavigate } from "react-router-dom";
import "../styles/ListingCard.css";

export default function ListingCard({ listing }) {
    const navigate = useNavigate();

    return (
        <div
            className="listing-card"
            onClick={() => navigate(`/services/${listing.id}`)}
        >
            <img
                src={listing.image_url}
                alt={listing.title}
                className="listing-card-img"
            />

            <h3 className="listing-card-title">{listing.title}</h3>

            <p className="listing-card-desc">
                {listing.description?.substring(0, 80)}...
            </p>

            <span className="listing-card-link">View Details →</span>
        </div>
    );
}
