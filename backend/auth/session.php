<?php
require_once __DIR__ . '/../cors.php';
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["loggedIn" => false]);
    exit;
}

echo json_encode([
    "loggedIn" => true,
    "user" => [
        "id" => $_SESSION['user_id'],
        "name" => $_SESSION['name'],
        "role" => $_SESSION['role']
    ]
]);
exit;
