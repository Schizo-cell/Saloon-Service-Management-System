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

    // Check if Appointment table exists
    $tableCheck = $conn->query("SHOW TABLES LIKE 'Appointment'");
    
    if (!$tableCheck || $tableCheck->num_rows === 0) {
        echo json_encode(['success' => true, 'appointments' => []]);
        exit;
    }

    // Get all appointments with customer names
    $sql = "SELECT 
                a.AppointmentID,
                a.AppointmentDate,
                a.AppointmentTime,
                a.ServiceName,
                a.CategoryName,
                a.AppointmentStatus,
                u.name as customer_name
            FROM Appointment a
            LEFT JOIN users u ON a.CustomerID = u.id
            ORDER BY a.AppointmentDate DESC, a.AppointmentTime DESC";
    
    $result = $conn->query($sql);

    $appointments = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $appointments[] = [
                'id' => $row['AppointmentID'],
                'date' => $row['AppointmentDate'],
                'time' => $row['AppointmentTime'],
                'service' => $row['ServiceName'],
                'category' => $row['CategoryName'],
                'status' => $row['AppointmentStatus'],
                'customer_name' => $row['customer_name'] ?? 'Unknown'
            ];
        }
    }

    echo json_encode([
        'success' => true,
        'appointments' => $appointments
    ]);

    $conn->close();
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error']);
}
?>