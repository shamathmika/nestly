<?php
// Shared CORS logic - MUST be called before any other output
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

$allowedOrigins = ['localhost', 'shamathmikacmpe272.app'];
$isAllowed = false;

foreach ($allowedOrigins as $allowed) {
    if (str_contains($origin, $allowed)) {
        $isAllowed = true;
        break;
    }
}

if ($isAllowed && $origin) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
}

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}