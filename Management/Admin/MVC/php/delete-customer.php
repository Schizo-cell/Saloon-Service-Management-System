<?php
error_reporting(0);
ini_set('display_errors', 0);

session_start();
header('Content-Type: application/json');

try {
    // Check if logged in as admin
    if (!isset($_SESSION['is_logged_in']) || $_SESSION['user_role'] !== 'admin') {
        echo json_encode(['success' => false, 'message' => 'Not authorized']);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'message' => 'Invalid request']);
        exit;
    }

    $customerId = isset($_POST['customer_id']) ? (int)$_POST['customer_id'] : 0;
    
    if ($customerId === 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid customer ID']);
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

    // Check if customer exists
    $checkSql = "SELECT id, role FROM users WHERE id = ?";
    $stmt = $conn->prepare($checkSql);
    $stmt->bind_param("i", $customerId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Customer not found']);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    $user = $result->fetch_assoc();
    
    // Ensure we're only deleting customers
    if ($user['role'] !== 'customer') {
        echo json_encode(['success' => false, 'message' => 'Can only delete customer accounts']);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    $stmt->close();

    // Delete customer (cascading will handle appointments)
    $deleteSql = "DELETE FROM users WHERE id = ? AND role = 'customer'";
    $stmt = $conn->prepare($deleteSql);
    $stmt->bind_param("i", $customerId);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Customer deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete customer']);
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error']);
}
?>