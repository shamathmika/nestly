<?php
require_once __DIR__ . '/../cors.php';
header('Content-Type: application/json');

/* Load recent cookie */
$recent = [];
if (isset($_COOKIE['recent']) && $_COOKIE['recent'] !== '') {
    $recent = explode(',', $_COOKIE['recent']);
}

/* Clean invalid values */
$recent = array_values(
    array_filter($recent, fn($x) => preg_match('/^\d+$/', $x))
);

echo json_encode($recent);
exit;
