<?php
session_start();

// Destroy all session data
session_unset();
session_destroy();

// Clear cookies
setcookie('user_email', '', time() - 3600, '/');
setcookie('user_name', '', time() - 3600, '/');
setcookie('remember_me', '', time() - 3600, '/');

// Redirect to login page
header('Location: ../html/login.html');
exit;
?>