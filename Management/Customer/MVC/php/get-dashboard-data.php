<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

session_start();
header('Content-Type: application/json');

// Check login
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

if ($_SESSION['user_role'] !== 'customer') {
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
    
    $customerId = $_SESSION['user_id'];
    
    // Initialize stats
    $stats = [
        'total' => 0,
        'upcoming' => 0,
        'completed' => 0
    ];
    
    // Check if Appointment table exists
    $tableCheck = $conn->query("SHOW TABLES LIKE 'Appointment'");
    
    if ($tableCheck && $tableCheck->num_rows > 0) {
        // Count total appointments
        $sql = "SELECT COUNT(*) as count FROM Appointment WHERE CustomerID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $customerId);
        $stmt->execute();
        $result = $stmt->get_result();
        $stats['total'] = (int)$result->fetch_assoc()['count'];
        
        // Count upcoming appointments
        $sql = "SELECT COUNT(*) as count FROM Appointment WHERE CustomerID = ? AND AppointmentStatus IN ('Pending', 'Confirmed')";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $customerId);
        $stmt->execute();
        $result = $stmt->get_result();
        $stats['upcoming'] = (int)$result->fetch_assoc()['count'];
        
        // Count completed appointments
        $sql = "SELECT COUNT(*) as count FROM Appointment WHERE CustomerID = ? AND AppointmentStatus = 'Completed'";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $customerId);
        $stmt->execute();
        $result = $stmt->get_result();
        $stats['completed'] = (int)$result->fetch_assoc()['count'];
        
        // Get recent appointments (last 5)
        $sql = "SELECT AppointmentDate, AppointmentTime, ServiceName, AppointmentStatus 
                FROM Appointment 
                WHERE CustomerID = ? 
                ORDER BY AppointmentDate DESC, AppointmentTime DESC 
                LIMIT 5";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $customerId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $appointments = [];
        while ($row = $result->fetch_assoc()) {
            $appointments[] = [
                'date' => $row['AppointmentDate'],
                'time' => $row['AppointmentTime'],
                'service' => $row['ServiceName'],
                'status' => $row['AppointmentStatus']
            ];
        }
    } else {
        $appointments = [];
    }
    
    echo json_encode([
        'success' => true,
        'stats' => $stats,
        'appointments' => $appointments
    ]);
    
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Server error'
    ]);
}
?>