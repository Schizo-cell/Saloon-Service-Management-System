<?php
error_reporting(0);
ini_set('display_errors', 0);

session_start();
header('Content-Type: application/json');

try {
    // Only admins can manage services
    if (!isset($_SESSION['is_logged_in']) || $_SESSION['user_role'] !== 'admin') {
        echo json_encode(['success' => false, 'message' => 'Not authorized - Admin only']);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'message' => 'Invalid request']);
        exit;
    }

    $serviceId = isset($_POST['service_id']) ? (int)$_POST['service_id'] : 0;
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $description = isset($_POST['description']) ? trim($_POST['description']) : '';
    $status = isset($_POST['status']) ? trim($_POST['status']) : 'Active';

    if (empty($name)) {
        echo json_encode(['success' => false, 'message' => 'Service name is required']);
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

    if ($serviceId > 0) {
        // Update existing service
        $sql = "UPDATE Service SET ServiceName = ?, ServiceDescription = ?, ServiceStatus = ? WHERE ServiceID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssi", $name, $description, $status, $serviceId);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Service updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update service']);
        }
    } else {
        // Insert new service
        $sql = "INSERT INTO Service (ServiceName, ServiceDescription, ServiceStatus) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $name, $description, $status);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Service created successfully', 'service_id' => $stmt->insert_id]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to create service']);
        }
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error']);
}
?>