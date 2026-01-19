<?php
error_reporting(0);
ini_set('display_errors', 0);

session_start();
header('Content-Type: application/json');

try {
    // Only admins can manage categories
    if (!isset($_SESSION['is_logged_in']) || $_SESSION['user_role'] !== 'admin') {
        echo json_encode(['success' => false, 'message' => 'Not authorized - Admin only']);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'message' => 'Invalid request']);
        exit;
    }

    $categoryId = isset($_POST['category_id']) ? (int)$_POST['category_id'] : 0;
    $serviceId = isset($_POST['service_id']) ? (int)$_POST['service_id'] : 0;
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $price = isset($_POST['price']) ? (float)$_POST['price'] : 0;
    $status = isset($_POST['status']) ? trim($_POST['status']) : 'Active';

    if (empty($name)) {
        echo json_encode(['success' => false, 'message' => 'Category name is required']);
        exit;
    }

    if ($price <= 0) {
        echo json_encode(['success' => false, 'message' => 'Valid price is required']);
        exit;
    }

    if ($serviceId <= 0 && $categoryId === 0) {
        echo json_encode(['success' => false, 'message' => 'Service ID is required']);
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

    if ($categoryId > 0) {
        // Update existing category
        $sql = "UPDATE Category SET CategoryName = ?, CategoryPrice = ?, CategoryStatus = ? WHERE CategoryID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sdsi", $name, $price, $status, $categoryId);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Category updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update category']);
        }
    } else {
        // Insert new category
        $sql = "INSERT INTO Category (CategoryName, CategoryPrice, ServiceID, CategoryStatus) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sdis", $name, $price, $serviceId, $status);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Category created successfully', 'category_id' => $stmt->insert_id]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to create category']);
        }
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error']);
}
?>