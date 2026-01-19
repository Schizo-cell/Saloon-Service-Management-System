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
        echo json_encode(['success' => false, 'services' => []]);
        exit;
    }
    
    $conn->set_charset("utf8mb4");

    // Get all services (including inactive)
    $sql = "SELECT ServiceID, ServiceName, ServiceDescription, ServiceStatus FROM Service ORDER BY ServiceName";
    $result = $conn->query($sql);

    $services = [];
    
    if ($result && $result->num_rows > 0) {
        while ($service = $result->fetch_assoc()) {
            // Get ALL categories for this service (including inactive)
            $serviceId = $service['ServiceID'];
            $catSql = "SELECT CategoryID, CategoryName, CategoryPrice, CategoryStatus, ServiceID 
                       FROM Category 
                       WHERE ServiceID = ? 
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
                    'status' => $cat['CategoryStatus'],
                    'service_id' => $cat['ServiceID']
                ];
            }
            
            $services[] = [
                'id' => $service['ServiceID'],
                'name' => $service['ServiceName'],
                'description' => $service['ServiceDescription'],
                'status' => $service['ServiceStatus'],
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