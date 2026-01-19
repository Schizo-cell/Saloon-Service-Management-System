<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
require_once '../db/connection.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $remember_me = isset($_POST['remember_me']) ? true : false;
    
    if (empty($email)) {
        echo json_encode(['success' => false, 'message' => 'Email is required']);
        exit;
    }
    
    if (empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Password is required']);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit;
    }
    
    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
        exit;
    }
    
    // Search for admin or staff user
    $sql = "SELECT * FROM users WHERE email = ? AND (role = 'admin' OR role = 'staff')";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        if (password_verify($password, $user['password'])) {
            
            // SESSION
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_phone'] = $user['phone'];
            $_SESSION['user_address'] = $user['address'];
            $_SESSION['user_role'] = $user['role'];
            $_SESSION['is_logged_in'] = true;
            $_SESSION['login_time'] = time();
            
            // COOKIE
            if ($remember_me) {
                $cookie_time = time() + (30 * 24 * 60 * 60);
                setcookie('admin_email', $email, $cookie_time, '/');
                setcookie('admin_name', $user['name'], $cookie_time, '/');
                setcookie('remember_me', 'yes', $cookie_time, '/');
            } else {
                setcookie('admin_email', '', time() - 3600, '/');
                setcookie('admin_name', '', time() - 3600, '/');
                setcookie('remember_me', '', time() - 3600, '/');
            }
            
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ]
            ]);
            
        } else {
            echo json_encode(['success' => false, 'message' => 'Incorrect password']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'No admin account found with this email']);
    }
    
    $stmt->close();
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}

$conn->close();
?>