<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');

// 1. Fetch all rental rows
$sql = "SELECT 
            id, 
            title, 
            description,
            address,
            rent,
            bedrooms,
            bathrooms,
            image_url,
            created_at
        FROM rentals";

$stmt = $pdo->prepare($sql);
$stmt->execute();
$listings = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 2. Fetch amenities grouped by rental_id
$sqlAmenities = "
    SELECT ra.rental_id, a.name
    FROM rental_amenities ra
    JOIN amenities a ON ra.amenity_id = a.id
    ORDER BY a.name;
";

$stmt2 = $pdo->prepare($sqlAmenities);
$stmt2->execute();
$amenitiesRows = $stmt2->fetchAll(PDO::FETCH_ASSOC);

// Build amenities list for each rental
$amenitiesMap = [];
foreach ($amenitiesRows as $row) {
    $amenitiesMap[$row['rental_id']][] = $row['name'];
}

// 3. Merge amenities into each listing
foreach ($listings as &$listing) {
    $rid = $listing['id'];
    $listing['amenities'] = $amenitiesMap[$rid] ?? [];
}

echo json_encode($listings);
