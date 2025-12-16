<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/db.php';

header("Content-Type: application/json");

$term = $_GET['term'] ?? '';
$lease = intval($_GET['lease'] ?? 0);

if (!$term || !$lease) {
    echo json_encode(["error" => "Missing term or lease"]);
    exit;
}

$sql = "
SELECT 
    r.*, 
    la.term, 
    la.lease_length, 
    la.allow_lesser_lease,
    la.start_date,
    la.end_date
FROM rentals r
JOIN listing_availability la 
    ON la.listing_id = r.id
WHERE la.term = ?
AND (
        la.lease_length = ? 
    OR 
        (la.allow_lesser_lease = 1 AND la.lease_length >= ?)
    )
";

$stmt = $pdo->prepare($sql);
$stmt->execute([$term, $lease, $lease]);
$listings = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($listings);
exit;
