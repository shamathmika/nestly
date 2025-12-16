<?php
require_once __DIR__ . '/../cors.php';
header('Content-Type: application/json');

/* Load counts cookie */
$counts = [];

if (isset($_COOKIE['counts'])) {
    $rawCounts = json_decode($_COOKIE['counts'], true);

    if (is_array($rawCounts)) {
        foreach ($rawCounts as $k => $v) {
            if (preg_match('/^\d+$/', $k)) {
                $counts[$k] = (int) $v;
            }
        }
    }
}

/* Order by highest count first */
arsort($counts);

/* Limit to top 5 */
$top = array_slice($counts, 0, 5, true);

echo json_encode($top);
exit;
