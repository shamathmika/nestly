<?php
require_once __DIR__ . '/../cors.php';
session_start();
header("Content-Type: application/json");

require_once __DIR__ . "/../config/db.php";

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Not authenticated"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$role = $data['role'] ?? null;
$interests = $data['interests'] ?? [];

// Validate role
$validRoles = ['student', 'professor', 'software_developer', 'other', 'admin'];
if (!$role || !in_array($role, $validRoles, true)) {
    echo json_encode(["error" => "Invalid role"]);
    exit;
}

// We store interests as JSON
$interestsJson = json_encode($interests);

$stmt = $pdo->prepare("
    UPDATE users
    SET role = ?, interests = ?
    WHERE id = ?
");

$stmt->execute([$role, $interestsJson, $_SESSION['user_id']]);

// Update session
$_SESSION['role'] = $role;

echo json_encode([
    "success" => true,
    "user" => [
        "id" => $_SESSION['user_id'],
        "name" => $_SESSION['name'],
        "role" => $role,
        "interests" => $interests
    ]
]);
