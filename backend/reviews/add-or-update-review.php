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
$rating = $data['rating'] ?? null;
$comment = trim($data['comment'] ?? "");
$userId = $_SESSION['user_id'];

if (!$rentalId || !$rating) {
    echo json_encode(["error" => "Missing rental_id or rating"]);
    exit;
}

// Check if user already reviewed this rental
$stmt = $pdo->prepare("SELECT id FROM reviews WHERE rental_id = ? AND user_id = ?");
$stmt->execute([$rentalId, $userId]);
$existing = $stmt->fetch();

if ($existing) {
    // Update existing review
    $stmt = $pdo->prepare("
        UPDATE reviews
        SET rating = ?, comment = ?, created_at = NOW()
        WHERE id = ?
    ");
    $stmt->execute([$rating, $comment, $existing['id']]);

    // Update avg rating
    updateAverageRating($rentalId, $pdo);

    echo json_encode(["success" => true, "updated" => true]);
    exit;

} else {
    // Insert new review
    $stmt = $pdo->prepare("
        INSERT INTO reviews (rental_id, user_id, rating, comment, created_at)
        VALUES (?, ?, ?, ?, NOW())
    ");
    $stmt->execute([$rentalId, $userId, $rating, $comment]);

    // Update avg rating
    updateAverageRating($rentalId, $pdo);

    echo json_encode(["success" => true, "created" => true]);
    exit;
}
?>