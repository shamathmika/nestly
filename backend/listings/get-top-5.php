<?php
// api/listings/get-top5.php
//
// Returns top 5 rentals by avg_rating (desc)
// with basic info, avg_rating, review_count and amenities.

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json; charset=utf-8');

ini_set('display_errors', 0);
error_reporting(0);

try {
    // 1. Top 5 by avg_rating (fallback to 0)
    $sqlTop = "
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
            COALESCE(avg_rating, 0) AS avg_rating
        FROM rentals
        ORDER BY avg_rating DESC, created_at DESC
        LIMIT 5
    ";
    $stmt = $pdo->prepare($sqlTop);
    $stmt->execute();
    $topRentals = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$topRentals) {
        echo json_encode([]);
        exit;
    }

    $rentalIds = array_column($topRentals, 'id');

    // 2. Review counts per rental
    $reviewCountMap = [];
    if (!empty($rentalIds)) {
        $inPlaceholders = implode(',', array_fill(0, count($rentalIds), '?'));
        $sqlCounts = "
            SELECT rental_id, COUNT(*) AS review_count
            FROM reviews
            WHERE rental_id IN ($inPlaceholders)
            GROUP BY rental_id
        ";
        $stmtC = $pdo->prepare($sqlCounts);
        $stmtC->execute($rentalIds);

        while ($row = $stmtC->fetch(PDO::FETCH_ASSOC)) {
            $reviewCountMap[(int) $row['rental_id']] = (int) $row['review_count'];
        }
    }

    // 3. Amenities per rental (optional but nice)
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

    // 4. Build response
    $result = [];
    foreach ($topRentals as $row) {
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
            'avg_rating' => (float) $row['avg_rating'],
            'review_count' => $reviewCountMap[$rid] ?? 0,
            'amenities' => $amenitiesMap[$rid] ?? [],
        ];
    }

    echo json_encode($result);
    exit;

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error fetching top rentals']);
    exit;
}
