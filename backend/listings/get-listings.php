<?php
require_once __DIR__ . '/../cors.php';
header('Content-Type: application/json');

$file = __DIR__ . '/../data/listings.json';

if (!file_exists($file)) {
    http_response_code(500);
    echo json_encode(['error' => 'listings.json not found']);
    exit;
}

$json = file_get_contents($file);
$data = json_decode($json, true);

if (!is_array($data)) {
    http_response_code(500);
    echo json_encode(['error' => 'invalid JSON']);
    exit;
}

echo json_encode($data);
