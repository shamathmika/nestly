<?php
require_once __DIR__ . '/../config/db.php';

function updateAverageRating($rental_id, $pdo)
{
    // 1. Fetch all ratings for this rental
    $stmt = $pdo->prepare("SELECT rating FROM reviews WHERE rental_id = ?");
    $stmt->execute([$rental_id]);
    $ratings = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if (!$ratings || count($ratings) === 0) {
        // No reviews, reset avg_rating to 0
        $stmt2 = $pdo->prepare("UPDATE rentals SET avg_rating = 0 WHERE id = ?");
        $stmt2->execute([$rental_id]);
        return;
    }

    // 2. Compute average
    $avg = array_sum($ratings) / count($ratings);

    // 3. Update rentals table
    $stmt3 = $pdo->prepare("UPDATE rentals SET avg_rating = ? WHERE id = ?");
    $stmt3->execute([round($avg, 2), $rental_id]);
}
