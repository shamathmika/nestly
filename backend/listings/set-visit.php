<?php
require_once __DIR__ . '/../cors.php';
header('Content-Type: application/json');

/* ---------------------------------------------------
   VALIDATE ID — ONLY NUMERIC IDS ARE ALLOWED
--------------------------------------------------- */
$id = $_GET['id'] ?? '';

if (!preg_match('/^\d+$/', $id)) {
    // Ignore invalid IDs like "p1", "x22", null, ""
    echo json_encode([
        'ok' => false,
        'error' => 'Invalid listing id format',
        'received' => $id
    ]);
    exit;
}

/* ---------------------------------------------------
   LOAD RECENT COOKIE & CLEAN INVALID VALUES
--------------------------------------------------- */
$recent = [];

if (isset($_COOKIE['recent']) && $_COOKIE['recent'] !== '') {
    $recent = explode(',', $_COOKIE['recent']);
}

/* remove non-numeric legacy values (ex: "p1") */
$recent = array_filter($recent, fn($x) => preg_match('/^\d+$/', $x));

/* remove duplicates of this id */
$recent = array_filter($recent, fn($x) => $x !== $id);

/* put current id at front */
array_unshift($recent, $id);

/* keep max 5 */
$recent = array_slice(array_values($recent), 0, 5);

/* ---------------------------------------------------
   LOAD COUNTS COOKIE & CLEAN INVALID VALUES
--------------------------------------------------- */
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

/* increment count for this listing */
$counts[$id] = ($counts[$id] ?? 0) + 1;

/* ---------------------------------------------------
   SAVE CLEANED COOKIES
--------------------------------------------------- */
$secure = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on';

setcookie(
    'recent',
    implode(',', $recent),
    time() + 60 * 60 * 24 * 30,
    '/',
    '',
    $secure,
    true
);

setcookie(
    'counts',
    json_encode($counts),
    time() + 60 * 60 * 24 * 30,
    '/',
    '',
    $secure,
    true
);

/* ---------------------------------------------------
   RESPONSE
--------------------------------------------------- */
echo json_encode([
    'ok' => true,
    'recent' => $recent,
    'counts' => $counts
]);
exit;
