<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>TESTING APPOINTMENT BOOKING</h1>";

session_start();

echo "<h2>1. Session Check:</h2>";
echo "Logged in: " . (isset($_SESSION['is_logged_in']) ? 'YES' : 'NO') . "<br>";
echo "User ID: " . (isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 'NOT SET') . "<br>";
echo "User Role: " . (isset($_SESSION['user_role']) ? $_SESSION['user_role'] : 'NOT SET') . "<br>";

echo "<h2>2. Database Connection:</h2>";
$host = 'localhost';
$dbname = 'salon_db';
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection FAILED: " . $conn->connect_error);
}
echo "Connection: SUCCESS<br>";

echo "<h2>3. Check Service Table:</h2>";
$result = $conn->query("SELECT ServiceID, ServiceName FROM Service LIMIT 1");
if ($result) {
    $row = $result->fetch_assoc();
    echo "Service found: ID=" . $row['ServiceID'] . ", Name=" . $row['ServiceName'] . "<br>";
} else {
    echo "ERROR: " . $conn->error . "<br>";
}

echo "<h2>4. Check Category Table:</h2>";
$result = $conn->query("SELECT CategoryID, CategoryName FROM Category LIMIT 1");
if ($result) {
    $row = $result->fetch_assoc();
    echo "Category found: ID=" . $row['CategoryID'] . ", Name=" . $row['CategoryName'] . "<br>";
} else {
    echo "ERROR: " . $conn->error . "<br>";
}

echo "<h2>5. Check Appointment Table:</h2>";
$result = $conn->query("SHOW TABLES LIKE 'Appointment'");
if ($result && $result->num_rows > 0) {
    echo "Appointment table EXISTS<br>";
    
    // Try to insert
    $date = '2026-01-25';
    $time = '14:00';
    $serviceName = 'Test Service';
    $categoryName = 'Test Category';
    $customerId = $_SESSION['user_id'];
    
    $sql = "INSERT INTO Appointment (AppointmentDate, AppointmentTime, ServiceName, CategoryName, CustomerID, AppointmentStatus) 
            VALUES (?, ?, ?, ?, ?, 'Pending')";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssi", $date, $time, $serviceName, $categoryName, $customerId);
    
    if ($stmt->execute()) {
        echo "TEST INSERT: SUCCESS! ID = " . $stmt->insert_id . "<br>";
    } else {
        echo "TEST INSERT FAILED: " . $stmt->error . "<br>";
    }
} else {
    echo "Appointment table DOES NOT EXIST!<br>";
}

$conn->close();
echo "<h2>ALL TESTS COMPLETE</h2>";
?>