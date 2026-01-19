<?php
error_reporting(0);
ini_set('display_errors', 0);

session_start();
header('Content-Type: application/json');

try {
    // Check if logged in as admin or staff
    if (!isset($_SESSION['is_logged_in']) || ($_SESSION['user_role'] !== 'admin' && $_SESSION['user_role'] !== 'staff')) {
        echo json_encode(['success' => false, 'message' => 'Not authorized']);
        exit;
    }

    $host = 'localhost';
    $dbname = 'salon_db';
    $username = 'root';
    $password = '';
    
    $conn = new mysqli($host, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
        exit;
    }
    
    $conn->set_charset("utf8mb4");

    // Get all staff and admin users
    $sql = "SELECT id, name, email, phone, address, role, created_at 
            FROM users 
            WHERE role IN ('staff', 'admin') 
            ORDER BY role DESC, created_at DESC";
    $result = $conn->query($sql);

    $staff = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $staff[] = $row;
        }
    }

    echo json_encode([
        'success' => true,
        'staff' => $staff
    ]);

    $conn->close();
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error']);
}
?>