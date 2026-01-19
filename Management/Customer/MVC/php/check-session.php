<?php
session_start();
header('Content-Type: application/json');

// Check if user is logged in and is customer
if (isset($_SESSION['is_logged_in']) && $_SESSION['is_logged_in'] === true) {
    if ($_SESSION['user_role'] === 'customer') {
        echo json_encode([
            'logged_in' => true,
            'user_id' => $_SESSION['user_id'],
            'user_name' => $_SESSION['user_name'],
            'user_email' => $_SESSION['user_email'],
            'user_phone' => $_SESSION['user_phone'] ?? '',
            'user_role' => $_SESSION['user_role'],
            'user_address' => $_SESSION['user_address'] ?? ''
        ]);
    } else {
        echo json_encode(['logged_in' => false, 'message' => 'Not a customer']);
    }
} else {
    echo json_encode(['logged_in' => false, 'message' => 'Not logged in']);
}
?>