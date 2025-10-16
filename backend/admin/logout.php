<?php
require_once __DIR__ . '/../cors.php';
session_start();
header("Content-Type: application/json");

session_destroy();
echo json_encode(['success' => true]);
