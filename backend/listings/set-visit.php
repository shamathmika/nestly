<?php
require_once __DIR__ . '/../cors.php';
header('Content-Type: application/json');

$id = $_GET['id'] ?? '';

if ($id === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Missing id']);
    exit;
}

/* ---- Recent ---- */
$recent = isset($_COOKIE['recent']) && $_COOKIE['recent'] !== ''
    ? explode(',', $_COOKIE['recent'])
    : [];

$recent = array_values(array_filter($recent, fn($x) => $x !== $id)); // remove duplicate
array_unshift($recent, $id);
$recent = array_slice($recent, 0, 5);

/* ---- Counts ---- */
$counts = isset($_COOKIE['counts']) ? json_decode($_COOKIE['counts'], true) : [];
if (!is_array($counts)) $counts = [];
$counts[$id] = ($counts[$id] ?? 0) + 1;

/* ---- Save cookies (30 days) ---- */
$secure = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on';
setcookie('recent', implode(',', $recent), time()+60*60*24*30, '/', '', $secure, true);
setcookie('counts', json_encode($counts), time()+60*60*24*30, '/', '', $secure, true);

echo json_encode(['ok' => true, 'recent' => $recent, 'count' => $counts[$id]]);
