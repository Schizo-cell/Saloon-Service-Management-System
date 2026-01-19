<?php
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't show errors in output

session_start();

// Set JSON header first
header('Content-Type: application/json');

// Check login
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

// Check role
if ($_SESSION['user_role'] !== 'admin' && $_SESSION['user_role'] !== 'staff') {
    echo json_encode(['success' => false, 'message' => 'Not authorized']);
    exit;
}

// Database connection
$host = 'localhost';
$dbname = 'salon_db';
$username = 'root';
$password = '';

try {
    $conn = new mysqli($host, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
        exit;
    }
    
    $conn->set_charset("utf8mb4");
    
    // Initialize stats
    $stats = [
        'customers' => 0,
        'staff' => 0,
        'admins' => 0,
        'appointments' => 0
    ];
    
    // Count customers
    $sql = "SELECT COUNT(*) as count FROM users WHERE role = 'customer'";
    $result = $conn->query($sql);
    if ($result) {
        $stats['customers'] = (int)$result->fetch_assoc()['count'];
    }
    
    // Count staff
    $sql = "SELECT COUNT(*) as count FROM users WHERE role = 'staff'";
    $result = $conn->query($sql);
    if ($result) {
        $stats['staff'] = (int)$result->fetch_assoc()['count'];
    }
    
    // Count admins
    $sql = "SELECT COUNT(*) as count FROM users WHERE role = 'admin'";
    $result = $conn->query($sql);
    if ($result) {
        $stats['admins'] = (int)$result->fetch_assoc()['count'];
    }
    
    // Count appointments (safely)
    $sql = "SHOW TABLES LIKE 'Appointment'";
    $result = $conn->query($sql);
    if ($result && $result->num_rows > 0) {
        $sql = "SELECT COUNT(*) as count FROM Appointment";
        $result = $conn->query($sql);
        if ($result) {
            $stats['appointments'] = (int)$result->fetch_assoc()['count'];
        }
    }
    
    // Get all users
    $sql = "SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC";
    $result = $conn->query($sql);
    
    $users = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $users[] = [
                'id' => $row['id'],
                'name' => $row['name'],
                'email' => $row['email'],
                'phone' => $row['phone'] ?? '',
                'role' => $row['role'],
                'created_at' => $row['created_at']
            ];
        }
    }
    
    // Success response
    echo json_encode([
        'success' => true,
        'stats' => $stats,
        'users' => $users
    ]);
    
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>