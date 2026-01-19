<?php
error_reporting(0);
ini_set('display_errors', 0);

session_start();
header('Content-Type: application/json');

try {
    // Check if logged in
    if (!isset($_SESSION['is_logged_in']) || $_SESSION['user_role'] !== 'customer') {
        echo json_encode(['success' => false, 'message' => 'Not logged in']);
        exit;
    }

    // Database connection
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
    
    $customerId = $_SESSION['user_id'];

    // Check if Appointment table exists
    $tableCheck = $conn->query("SHOW TABLES LIKE 'Appointment'");
    
    if (!$tableCheck || $tableCheck->num_rows === 0) {
        echo json_encode(['success' => true, 'appointments' => []]);
        exit;
    }

    // Get all appointments for this customer
    $sql = "SELECT AppointmentID, AppointmentDate, AppointmentTime, ServiceName, CategoryName, AppointmentStatus 
            FROM Appointment 
            WHERE CustomerID = ? 
            ORDER BY AppointmentDate DESC, AppointmentTime DESC";

    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Query preparation failed']);
        exit;
    }
    
    $stmt->bind_param("i", $customerId);
    $stmt->execute();
    $result = $stmt->get_result();

    $appointments = [];
    while ($row = $result->fetch_assoc()) {
        $appointments[] = [
            'id' => $row['AppointmentID'],
            'date' => $row['AppointmentDate'],
            'time' => $row['AppointmentTime'],
            'service' => $row['ServiceName'],
            'category' => $row['CategoryName'],
            'status' => $row['AppointmentStatus']
        ];
    }

    echo json_encode([
        'success' => true,
        'appointments' => $appointments
    ]);

    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error']);
}
?>