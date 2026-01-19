<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// Start session
session_start();

// Set JSON header FIRST before any output
header('Content-Type: application/json');

try {
    // Check if logged in
    if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
        echo json_encode(['success' => false, 'message' => 'Not logged in - Please login first']);
        exit;
    }
    
    if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'customer') {
        echo json_encode(['success' => false, 'message' => 'Not authorized - Customer access only']);
        exit;
    }
    
    // Check if POST request
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'message' => 'Invalid request method']);
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
    
    // Get POST data
    $date = isset($_POST['date']) ? $_POST['date'] : '';
    $time = isset($_POST['time']) ? $_POST['time'] : '';
    $serviceId = isset($_POST['service_id']) ? (int)$_POST['service_id'] : 0;
    $categoryId = isset($_POST['category_id']) ? (int)$_POST['category_id'] : 0;
    $notes = isset($_POST['notes']) ? trim($_POST['notes']) : '';
    $customerId = $_SESSION['user_id'];
    
    // Validation
    if (empty($date)) {
        echo json_encode(['success' => false, 'message' => 'Date is required']);
        exit;
    }
    
    if (empty($time)) {
        echo json_encode(['success' => false, 'message' => 'Time is required']);
        exit;
    }
    
    if ($serviceId === 0) {
        echo json_encode(['success' => false, 'message' => 'Please select a service']);
        exit;
    }
    
    if ($categoryId === 0) {
        echo json_encode(['success' => false, 'message' => 'Please select a category']);
        exit;
    }
    
    // Get service name
    $serviceSql = "SELECT ServiceName FROM Service WHERE ServiceID = ?";
    $stmt = $conn->prepare($serviceSql);
    
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Database error 1']);
        exit;
    }
    
    $stmt->bind_param("i", $serviceId);
    $stmt->execute();
    $serviceResult = $stmt->get_result();
    
    if ($serviceResult->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid service selected']);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    $serviceName = $serviceResult->fetch_assoc()['ServiceName'];
    $stmt->close();
    
    // Get category name
    $categorySql = "SELECT CategoryName FROM Category WHERE CategoryID = ?";
    $stmt = $conn->prepare($categorySql);
    
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Database error 2']);
        exit;
    }
    
    $stmt->bind_param("i", $categoryId);
    $stmt->execute();
    $categoryResult = $stmt->get_result();
    
    if ($categoryResult->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid category selected']);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    $categoryName = $categoryResult->fetch_assoc()['CategoryName'];
    $stmt->close();
    
    // Insert appointment
    $insertSql = "INSERT INTO Appointment (AppointmentDate, AppointmentTime, ServiceName, CategoryName, CustomerID, AppointmentStatus) 
                  VALUES (?, ?, ?, ?, ?, 'Pending')";
    
    $stmt = $conn->prepare($insertSql);
    
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Database error 3']);
        exit;
    }
    
    $stmt->bind_param("ssssi", $date, $time, $serviceName, $categoryName, $customerId);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Appointment booked successfully!',
            'appointment_id' => $stmt->insert_id
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to book appointment']);
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error occurred']);
}
?>