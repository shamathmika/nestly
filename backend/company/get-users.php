<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/db.php';
header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT name FROM users");
    $names = [];
    while ($row = $stmt->fetch()) {
        $names[] = $row['name'];
    }

    echo json_encode($names);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed']);
    exit;
}
