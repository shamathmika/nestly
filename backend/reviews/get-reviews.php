<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/db.php';

header("Content-Type: application/json");

$rentalId = $_GET['rental_id'] ?? null;

if (!$rentalId) {
    echo json_encode(["error" => "Missing rental_id"]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT r.id, r.rating, r.comment, r.created_at, 
           u.name AS user_name, u.id AS user_id
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.rental_id = ?
    ORDER BY r.created_at DESC
");
$stmt->execute([$rentalId]);
$reviews = $stmt->fetchAll();

echo json_encode($reviews);
exit;
