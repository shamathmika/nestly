<?php
require_once __DIR__ . '/../cors.php';

session_start();

// Destroy session server side
$_SESSION = [];
session_destroy();

// Also destroy browser cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

header("Content-Type: application/json");
echo json_encode(["success" => true]);
exit;
