<?php
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');

try {
    $host = 'localhost';
    $dbname = 'salon_db';
    $username = 'root';
    $password = '';
    
    $conn = new mysqli($host, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'services' => []]);
        exit;
    }
    
    $conn->set_charset("utf8mb4");

    $sql = "SELECT ServiceID as id, ServiceName as name FROM Service WHERE ServiceStatus = 'Active' ORDER BY ServiceName";
    $result = $conn->query($sql);

    $services = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $services[] = $row;
        }
    }

    echo json_encode([
        'success' => true,
        'services' => $services
    ]);

    $conn->close();
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'services' => []]);
}
?>