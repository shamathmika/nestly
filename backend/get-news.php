<?php
$newsFile = __DIR__ . "/data/news.txt";

// Set header to return JSON
header('Content-Type: application/json');

$news = [];
if (file_exists($newsFile)) {
    $lines = file($newsFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $news = array_map('trim', $lines);
}

// Output JSON response
echo json_encode($news);
?>