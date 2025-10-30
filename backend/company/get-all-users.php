<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/db.php';
header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT name FROM users");
    $local = [];
    while ($row = $stmt->fetch()) {
        $local[] = $row['name'];
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Local DB query failed']);
    exit;
}

$partnerUrls = [
    // Wendy (Whisk)
    'https://wendynttn.com/api/users.php',
    // Anandita (example placeholder)
    // 'https://anandita.app/api/company/get-users.php',
];

function fetchUsersViaCurl(string $url): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 5,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_HTTPHEADER => ['Accept: application/json'],
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($code === 200 && $resp) {
        $data = json_decode($resp, true);
        if (isset($data['users']) && is_array($data['users'])) {
            return ['company' => $data['company'] ?? 'Unknown', 'users' => $data['users']];
        }
        if (is_array($data)) {
            return ['company' => parse_url($url, PHP_URL_HOST), 'users' => $data];
        }
    }
    return ['company' => parse_url($url, PHP_URL_HOST), 'users' => []];
}

$allCompanies = [];

$allCompanies[] = [
    'company' => 'Nestly',
    'users' => $local
];

foreach ($partnerUrls as $u) {
    $allCompanies[] = fetchUsersViaCurl($u);
}

echo json_encode($allCompanies, JSON_PRETTY_PRINT);
