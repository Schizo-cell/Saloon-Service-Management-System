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

    // Get all active services
    $sql = "SELECT ServiceID, ServiceName, ServiceDescription FROM Service WHERE ServiceStatus = 'Active' ORDER BY ServiceName";
    $result = $conn->query($sql);

    $services = [];
    
    if ($result && $result->num_rows > 0) {
        while ($service = $result->fetch_assoc()) {
            // Get categories for this service
            $serviceId = $service['ServiceID'];
            $catSql = "SELECT CategoryID, CategoryName, CategoryPrice, CategoryStatus 
                       FROM Category 
                       WHERE ServiceID = ? AND CategoryStatus = 'Active' 
                       ORDER BY CategoryPrice";
            
            $stmt = $conn->prepare($catSql);
            $stmt->bind_param("i", $serviceId);
            $stmt->execute();
            $catResult = $stmt->get_result();
            
            $categories = [];
            while ($cat = $catResult->fetch_assoc()) {
                $categories[] = [
                    'id' => $cat['CategoryID'],
                    'name' => $cat['CategoryName'],
                    'price' => $cat['CategoryPrice'],
                    'status' => $cat['CategoryStatus']
                ];
            }
            
            $services[] = [
                'id' => $service['ServiceID'],
                'name' => $service['ServiceName'],
                'description' => $service['ServiceDescription'],
                'categories' => $categories
            ];
            
            $stmt->close();
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