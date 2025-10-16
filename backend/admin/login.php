<?php
require_once __DIR__ . '/../cors.php';  
session_start();
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);
$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

if ($username === 'admin' && $password === 'pass123') {
    $_SESSION['isAdmin'] = true;
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
}
