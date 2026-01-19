<?php
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');

try {
    $serviceId = isset($_GET['service_id']) ? (int)$_GET['service_id'] : 0;

    if ($serviceId === 0) {
        echo json_encode(['success' => false, 'categories' => []]);
        exit;
    }
    
    $host = 'localhost';
    $dbname = 'salon_db';
    $username = 'root';
    $password = '';
    
    $conn = new mysqli($host, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'categories' => []]);
        exit;
    }
    
    $conn->set_charset("utf8mb4");

    $sql = "SELECT CategoryID as id, CategoryName as name, CategoryPrice as price 
            FROM Category 
            WHERE ServiceID = ? AND CategoryStatus = 'Active' 
            ORDER BY CategoryName";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $serviceId);
    $stmt->execute();
    $result = $stmt->get_result();

    $categories = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row;
        }
    }

    echo json_encode([
        'success' => true,
        'categories' => $categories
    ]);

    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'categories' => []]);
}
?>