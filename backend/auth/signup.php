<?php
require_once __DIR__ . '/../cors.php';
session_start();
header("Content-Type: application/json");

require_once __DIR__ . "/../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if ($name === '' || $email === '' || $password === '') {
    echo json_encode(["error" => "Name, email, and password are required"]);
    exit;
}

// Check if email already exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);

if ($stmt->fetch()) {
    echo json_encode(["error" => "An account with this email already exists"]);
    exit;
}

$hash = password_hash($password, PASSWORD_BCRYPT);
$defaultRole = 'student';

$stmt = $pdo->prepare("
    INSERT INTO users (name, email, password_hash, role, created_at)
    VALUES (?, ?, ?, ?, NOW())
");
$stmt->execute([$name, $email, $hash, $defaultRole]);

$newUserId = $pdo->lastInsertId();

// Auto login
$_SESSION['user_id'] = $newUserId;
$_SESSION['name'] = $name;
$_SESSION['role'] = $defaultRole;

echo json_encode([
    "success" => true,
    "user" => [
        "id" => $newUserId,
        "name" => $name,
        "email" => $email,
        "role" => $defaultRole,
        "interests" => []
    ]
]);
exit;
