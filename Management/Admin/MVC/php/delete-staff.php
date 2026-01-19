<?php
error_reporting(0);
ini_set('display_errors', 0);

session_start();
header('Content-Type: application/json');

try {
    // Only admins can delete staff/admin accounts
    if (!isset($_SESSION['is_logged_in']) || $_SESSION['user_role'] !== 'admin') {
        echo json_encode(['success' => false, 'message' => 'Not authorized - Admin only']);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'message' => 'Invalid request']);
        exit;
    }

    $staffId = isset($_POST['staff_id']) ? (int)$_POST['staff_id'] : 0;
    
    if ($staffId === 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid staff ID']);
        exit;
    }

    // Prevent admin from deleting themselves
    if ($staffId === $_SESSION['user_id']) {
        echo json_encode(['success' => false, 'message' => 'Cannot delete your own account']);
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

    // Check if user exists and is staff or admin
    $checkSql = "SELECT id, role FROM users WHERE id = ?";
    $stmt = $conn->prepare($checkSql);
    $stmt->bind_param("i", $staffId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    $user = $result->fetch_assoc();
    
    // Ensure we're only deleting staff or admin
    if ($user['role'] !== 'staff' && $user['role'] !== 'admin') {
        echo json_encode(['success' => false, 'message' => 'Can only delete staff or admin accounts']);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    $stmt->close();

    // Delete user
    $deleteSql = "DELETE FROM users WHERE id = ? AND (role = 'staff' OR role = 'admin')";
    $stmt = $conn->prepare($deleteSql);
    $stmt->bind_param("i", $staffId);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete user']);
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error']);
}
?>