<?php
session_start();
require_once '../db/connection.php';
header('Content-Type: application/json');

// Check if logged in
if (!isset($_SESSION['is_logged_in']) || $_SESSION['user_role'] !== 'customer') {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $appointmentId = (int)$_POST['appointment_id'];
    $customerId = $_SESSION['user_id'];
    
    // Check if appointment belongs to this customer
    $checkSql = "SELECT AppointmentStatus FROM Appointment WHERE AppointmentID = ? AND CustomerID = ?";
    $stmt = $conn->prepare($checkSql);
    $stmt->bind_param("ii", $appointmentId, $customerId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Appointment not found']);
        exit;
    }
    
    $appointment = $result->fetch_assoc();
    
    // Check if appointment can be cancelled
    if ($appointment['AppointmentStatus'] === 'Completed' || $appointment['AppointmentStatus'] === 'Cancelled') {
        echo json_encode(['success' => false, 'message' => 'This appointment cannot be cancelled']);
        exit;
    }
    
    // Update appointment status to Cancelled
    $updateSql = "UPDATE Appointment SET AppointmentStatus = 'Cancelled' WHERE AppointmentID = ?";
    $stmt = $conn->prepare($updateSql);
    $stmt->bind_param("i", $appointmentId);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Appointment cancelled successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to cancel appointment']);
    }
    
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}

$conn->close();
?>