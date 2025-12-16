<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/config/db.php';

header("Content-Type: application/json");

// Only return name + id for privacy
$sql = "SELECT id, name FROM users ORDER BY created_at DESC LIMIT 20";
$stmt = $pdo->prepare($sql);
$stmt->execute();
echo json_encode($stmt->fetchAll());
