<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../db/connection.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    $action = isset($_POST['action']) ? $_POST['action'] : '';
    
    if ($action === 'verify') {
        // STEP 1: Verify email and phone
        
        $email = trim($_POST['email']);
        $phone = trim($_POST['phone']);
        
        // Validation
        if (empty($email)) {
            echo json_encode(['success' => false, 'message' => 'Email is required']);
            exit;
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['success' => false, 'message' => 'Invalid email format']);
            exit;
        }
        
        if (empty($phone)) {
            echo json_encode(['success' => false, 'message' => 'Phone number is required']);
            exit;
        }
        
        if (!preg_match('/^[0-9]{11}$/', $phone)) {
            echo json_encode(['success' => false, 'message' => 'Phone number must be 11 digits']);
            exit;
        }
        
        // Check if user exists with matching email and phone
        $sql = "SELECT id, name FROM users WHERE email = ? AND phone = ? AND role = 'customer'";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $email, $phone);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            echo json_encode([
                'success' => true,
                'message' => 'User verified successfully',
                'user_name' => $user['name']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'No account found with this email and phone number'
            ]);
        }
        
        $stmt->close();
        
    } elseif ($action === 'reset') {
        // STEP 2: Reset password
        
        $email = trim($_POST['email']);
        $newPassword = trim($_POST['newPassword']);
        
        // Validation
        if (empty($email)) {
            echo json_encode(['success' => false, 'message' => 'Email is required']);
            exit;
        }
        
        if (empty($newPassword)) {
            echo json_encode(['success' => false, 'message' => 'New password is required']);
            exit;
        }
        
        if (strlen($newPassword) < 6) {
            echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
            exit;
        }
        
        // Hash new password
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        
        // Update password in database
        $sql = "UPDATE users SET password = ? WHERE email = ? AND role = 'customer'";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $hashedPassword, $email);
        
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Password reset successfully'
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to reset password'
                ]);
            }
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Database error occurred'
            ]);
        }
        
        $stmt->close();
        
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}

$conn->close();
?>