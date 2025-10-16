<?php
$contactsFile = __DIR__ . "/data/contacts.txt";
require_once __DIR__ . '/cors.php';

// Set header to return JSON
header('Content-Type: application/json');


$contacts = [];
if (file_exists($contactsFile)) {
    $lines = file($contactsFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        // Example line format:
        // Name: a b, Role: xyz, Email: a.b@nestly.com
        $parts = explode(',', $line);
        $contact = [];

        foreach ($parts as $part) {
            [$key, $value] = explode(':', $part, 2);
            $contact[trim(strtolower($key))] = trim($value);
        }

        $contacts[] = $contact;
    }
}

// Output JSON
echo json_encode($contacts);
?>