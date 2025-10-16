<?php
require_once __DIR__ . '/../cors.php';  
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$file = __DIR__ . '/../data/users.txt';

$users = [];
if (file_exists($file)) {
    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $users = array_map('trim', $lines);
}

echo json_encode($users);
