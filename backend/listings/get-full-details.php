<?php
// api/listings/get-full-details.php
//
// Returns all rentals with:
// - basic listing info
// - amenities[]
// - reviews[] (with user_name)
// - avg_rating and review_count

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json; charset=utf-8');

// Make sure random warnings don't pollute JSON
ini_set('display_errors', 0);
error_reporting(0);

try {
    // 1. Get all rentals
    $sqlRentals = "
        SELECT
            id,
            title,
            description,
            address,
            rent,
            bedrooms,
            bathrooms,
            image_url,
            created_at,
            avg_rating
        FROM rentals
        ORDER BY created_at DESC
    ";
    $stmt = $pdo->prepare($sqlRentals);
    $stmt->execute();
    $rentals = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$rentals) {
        echo json_encode([]);
        exit;
    }

    $rentalIds = array_column($rentals, 'id');

    // 2. Get amenities for all rentals
    $amenitiesMap = [];
    if (!empty($rentalIds)) {
        $inPlaceholders = implode(',', array_fill(0, count($rentalIds), '?'));

        $sqlAmenities = "
            SELECT ra.rental_id, a.name
            FROM rental_amenities ra
            JOIN amenities a ON ra.amenity_id = a.id
            WHERE ra.rental_id IN ($inPlaceholders)
            ORDER BY a.name
        ";
        $stmtA = $pdo->prepare($sqlAmenities);
        $stmtA->execute($rentalIds);

        while ($row = $stmtA->fetch(PDO::FETCH_ASSOC)) {
            $amenitiesMap[$row['rental_id']][] = $row['name'];
        }
    }

    // 3. Get reviews for all rentals (with user name)
    $reviewsMap = [];
    $reviewCountMap = [];
    if (!empty($rentalIds)) {
        $inPlaceholders = implode(',', array_fill(0, count($rentalIds), '?'));

        $sqlReviews = "
            SELECT 
                r.id,
                r.rental_id,
                r.user_id,
                u.name AS user_name,
                r.rating,
                r.comment,
                r.created_at
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.rental_id IN ($inPlaceholders)
            ORDER BY r.created_at DESC
        ";
        $stmtR = $pdo->prepare($sqlReviews);
        $stmtR->execute($rentalIds);

        while ($row = $stmtR->fetch(PDO::FETCH_ASSOC)) {
            $rid = $row['rental_id'];
            $reviewsMap[$rid][] = [
                'id' => (int) $row['id'],
                'user_id' => (int) $row['user_id'],
                'user_name' => $row['user_name'],
                'rating' => (float) $row['rating'],
                'comment' => $row['comment'],
                'created_at' => $row['created_at'],
            ];
            if (!isset($reviewCountMap[$rid])) {
                $reviewCountMap[$rid] = 0;
            }
            $reviewCountMap[$rid]++;
        }
    }

    // 4. Assemble final payload
    $result = [];
    foreach ($rentals as $row) {
        $rid = (int) $row['id'];

        $result[] = [
            'id' => $rid,
            'title' => $row['title'],
            'description' => $row['description'],
            'address' => $row['address'],
            'rent' => $row['rent'] !== null ? (float) $row['rent'] : null,
            'bedrooms' => $row['bedrooms'] !== null ? (int) $row['bedrooms'] : null,
            'bathrooms' => $row['bathrooms'] !== null ? (float) $row['bathrooms'] : null,
            'image_url' => $row['image_url'],
            'created_at' => $row['created_at'],
            'avg_rating' => $row['avg_rating'] !== null ? (float) $row['avg_rating'] : 0.0,
            'review_count' => $reviewCountMap[$rid] ?? 0,
            'amenities' => $amenitiesMap[$rid] ?? [],
            'reviews' => $reviewsMap[$rid] ?? [],
        ];
    }

    echo json_encode($result);
    exit;

} catch (Throwable $e) {
    // For production, keep it generic
    http_response_code(500);
    echo json_encode(['error' => 'Server error fetching listings']);
    exit;
}
