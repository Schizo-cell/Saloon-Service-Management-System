// Get all elements
const form = document.getElementById('forgotForm');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');

const emailError = document.getElementById('emailError');
const phoneError = document.getElementById('phoneError');
const newPasswordError = document.getElementById('newPasswordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');
const messageBox = document.getElementById('messageBox');

const newPasswordGroup = document.getElementById('newPasswordGroup');
const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
const submitBtn = document.getElementById('submitBtn');

let step = 1;
let verifiedEmail = '';

form.addEventListener('submit', function(event) {
    event.preventDefault();
    clearAllErrors();
    
    if (step === 1) {
        verifyUser();
    } else {
        resetPassword();
    }
});

function verifyUser() {
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    
    let isValid = true;
    
    if (email === '') {
        showError(emailError, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError(emailError, 'Please enter a valid email address');
        isValid = false;
    }
    
    if (phone === '') {
        showError(phoneError, 'Phone number is required');
        isValid = false;
    } else if (!isValidPhone(phone)) {
        showError(phoneError, 'Please enter a valid phone number (11 digits)');
        isValid = false;
    }
    
    if (isValid) {
        sendVerifyRequest(email, phone);
    }
}

function resetPassword() {
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    
    let isValid = true;
    
    if (newPassword === '') {
        showError(newPasswordError, 'New password is required');
        isValid = false;
    } else if (newPassword.length < 6) {
        showError(newPasswordError, 'Password must be at least 6 characters');
        isValid = false;
    }
    
    if (confirmPassword === '') {
        showError(confirmPasswordError, 'Please confirm your password');
        isValid = false;
    } else if (newPassword !== confirmPassword) {
        showError(confirmPasswordError, 'Passwords do not match');
        isValid = false;
    }
    
    if (isValid) {
        sendResetRequest(verifiedEmail, newPassword);
    }
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function isValidPhone(phone) {
    const phonePattern = /^[0-9]{11}$/;
    return phonePattern.test(phone);
}

function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
}

function clearAllErrors() {
    emailError.classList.remove('show');
    phoneError.classList.remove('show');
    newPasswordError.classList.remove('show');
    confirmPasswordError.classList.remove('show');
    messageBox.className = 'message-box';
    messageBox.textContent = '';
}

function showMessage(type, message) {
    messageBox.textContent = message;
    messageBox.className = 'message-box ' + type;
}

function sendVerifyRequest(email, phone) {
    showMessage('success', 'Verifying your information...');
    
    const formData = new FormData();
    formData.append('action', 'verify');
    formData.append('email', email);
    formData.append('phone', phone);
    
    fetch('/Saloon%20Service%20Management/Management/Admin/MVC/php/forgot-password.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success === true) {
            showMessage('success', 'Verification successful! Enter new password below.');
            verifiedEmail = email;
            
            newPasswordGroup.style.display = 'block';
            confirmPasswordGroup.style.display = 'block';
            
            emailInput.disabled = true;
            phoneInput.disabled = true;
            
            submitBtn.textContent = 'Reset Password';
            step = 2;
        } else {
            showMessage('error', data.message);
        }
    })
    .catch(error => {
        showMessage('error', 'Connection error. Please try again.');
        console.error('Error:', error);
    });
}

function sendResetRequest(email, newPassword) {
    showMessage('success', 'Resetting your password...');
    
    const formData = new FormData();
    formData.append('action', 'reset');
    formData.append('email', email);
    formData.append('newPassword', newPassword);
    
    fetch('/Saloon%20Service%20Management/Management/Admin/MVC/php/forgot-password.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success === true) {
            showMessage('success', 'Password reset successful! Redirecting to login...');
            setTimeout(function() {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showMessage('error', data.message);
        }
    })
    .catch(error => {
        showMessage('error', 'Connection error. Please try again.');
        console.error('Error:', error);
    });
}

emailInput.addEventListener('input', clearAllErrors);
phoneInput.addEventListener('input', clearAllErrors);
newPasswordInput.addEventListener('input', clearAllErrors);
confirmPasswordInput.addEventListener('input', clearAllErrors);