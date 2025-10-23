<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = ['localhost', '127.0.0.1', 'shamathmikacmpe272.app'];

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
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}