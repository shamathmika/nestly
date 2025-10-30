<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/db.php';
header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT name FROM users");
    $users = [];
    while ($row = $stmt->fetch()) {
        $users[] = $row['name'];
    }

    $response = [
        "company" => "Nestly",
        "users" => $users
    ];

    echo json_encode($response, JSON_PRETTY_PRINT);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Query failed',
        'details' => $e->getMessage()
    ]);
    exit;
}
