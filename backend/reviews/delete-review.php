<?php
require_once __DIR__ . '/../cors.php';
session_start();
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/update-avg-rating.php';

header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "Not authenticated"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$rentalId = $data['rental_id'] ?? null;
$userId = $_SESSION['user_id'];

if (!$rentalId) {
    echo json_encode(["error" => "Missing rental_id"]);
    exit;
}

// Delete review
$stmt = $pdo->prepare("DELETE FROM reviews WHERE rental_id = ? AND user_id = ?");
$stmt->execute([$rentalId, $userId]);

// Recalculate avg_rating
updateAverageRating($rentalId, $pdo);

echo json_encode(["success" => true]);
exit;
?>