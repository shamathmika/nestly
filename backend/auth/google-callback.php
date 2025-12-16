<?php
require_once __DIR__ . '/../cors.php';
session_start();
header("Content-Type: text/html; charset=utf-8");

require_once __DIR__ . "/../config/db.php";

// Load ENV vars
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
$clientSecret = $_ENV['GOOGLE_CLIENT_SECRET'] ?? null;
$redirectUri = $_ENV['GOOGLE_REDIRECT_URI'] ?? null;

if (!$clientId || !$clientSecret || !$redirectUri) {
    echo "Google OAuth not configured.";
    exit;
}

if (!isset($_GET['code'])) {
    echo "Missing authorization code.";
    exit;
}

$code = $_GET['code'];

// Exchange code for token
$tokenEndpoint = 'https://oauth2.googleapis.com/token';

$postFields = [
    'code' => $code,
    'client_id' => $clientId,
    'client_secret' => $clientSecret,
    'redirect_uri' => $redirectUri,
    'grant_type' => 'authorization_code'
];

$ch = curl_init($tokenEndpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postFields));
$response = curl_exec($ch);

if ($response === false) {
    echo "Failed to contact Google.";
    exit;
}

$tokenData = json_decode($response, true);
curl_close($ch);

if (!isset($tokenData['access_token'])) {
    echo "Failed to get access token.";
    exit;
}

$accessToken = $tokenData['access_token'];

// Fetch user info
$ch = curl_init('https://www.googleapis.com/oauth2/v3/userinfo');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $accessToken
]);
$userInfoResponse = curl_exec($ch);
curl_close($ch);

$userInfo = json_decode($userInfoResponse, true);

$email = $userInfo['email'] ?? null;
$name = $userInfo['name'] ?? null;

if (!$email) {
    echo "Could not retrieve email.";
    exit;
}

// Check if user exists
$stmt = $pdo->prepare("SELECT id, name, email, role, interests FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user) {
    $userId = $user['id'];
    $role = $user['role'];
} else {
    // Create user with empty password (Google users don't need it)
    $role = "student";
    $stmt = $pdo->prepare("
        INSERT INTO users (name, email, password_hash, role, interests, created_at)
        VALUES (?, ?, '', ?, '[]', NOW())
    ");
    $stmt->execute([$name ?? $email, $email, $role]);
    $userId = $pdo->lastInsertId();
}

// Login via session
$_SESSION['user_id'] = $userId;
$_SESSION['name'] = $name ?? $email;
$_SESSION['role'] = $role;

// Redirect back to frontend
header("Location: /");
exit;
