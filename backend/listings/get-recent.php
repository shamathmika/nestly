<?php
require_once __DIR__ . '/../cors.php';
header('Content-Type: application/json');

$recent = isset($_COOKIE['recent']) && $_COOKIE['recent'] !== ''
    ? explode(',', $_COOKIE['recent'])
    : [];

echo json_encode($recent);
