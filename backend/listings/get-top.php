<?php
require_once __DIR__ . '/../cors.php';
header('Content-Type: application/json');

$counts = isset($_COOKIE['counts']) ? json_decode($_COOKIE['counts'], true) : [];
if (!is_array($counts)) $counts = [];

arsort($counts);
$top = array_slice($counts, 0, 5, true);

echo json_encode($top);
