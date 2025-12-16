<?php
require_once __DIR__ . '/../cors.php';
header("Content-Type: application/json");

$envFile = __DIR__ . "/../.env";
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (strpos($line, '=') !== false) {
            [$k, $v] = explode('=', $line, 2);
            $_ENV[trim($k)] = trim($v);
        }
    }
}

$clientId = $_ENV['GOOGLE_CLIENT_ID'] ?? null;
$redirectUri = $_ENV['GOOGLE_REDIRECT_URI'] ?? null;

if (!$clientId || !$redirectUri) {
    echo json_encode(["error" => "Google OAuth not configured"]);
    exit;
}

$params = [
    'client_id' => $clientId,
    'redirect_uri' => $redirectUri,
    'response_type' => 'code',
    'scope' => 'openid email profile',
    'access_type' => 'online',
    'prompt' => 'select_account'
];

$url = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params);

echo json_encode(["authUrl" => $url]);
exit;
