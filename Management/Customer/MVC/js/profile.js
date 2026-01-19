// Elements
const form = document.getElementById('profileForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const addressInput = document.getElementById('address');
const currentPasswordInput = document.getElementById('currentPassword');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const messageBox = document.getElementById('messageBox');

// Check login and load profile on page load
window.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    loadProfile();
});

// Check if logged in
function checkLogin() {
    fetch('/Saloon%20Service%20Management/Management/Customer/MVC/php/check-session.php')
    .then(response => response.json())
    .then(data => {
        if (!data.logged_in) {
            window.location.href = 'login.html';
        } else {
            document.getElementById('customerName').textContent = data.user_name;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        window.location.href = 'login.html';
    });
}

// Load profile data
function loadProfile() {
    fetch('/Saloon%20Service%20Management/Management/Customer/MVC/php/get-profile.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            nameInput.value = data.profile.name;
            emailInput.value = data.profile.email;
            phoneInput.value = data.profile.phone || '';
            addressInput.value = data.profile.address || '';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    clearErrors();
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();
    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    let isValid = true;
    
    // Validate name
    if (name === '') {
        showError('nameError', 'Name is required');
        isValid = false;
    } else if (name.length < 3) {
        showError('nameError', 'Name must be at least 3 characters');
        isValid = false;
    }
    
    // Validate email
    if (email === '') {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError', 'Please enter a valid email');
        isValid = false;
    }
    
    // Validate phone
    if (phone === '') {
        showError('phoneError', 'Phone is required');
        isValid = false;
    } else if (!isValidPhone(phone)) {
        showError('phoneError', 'Phone must be 11 digits');
        isValid = false;
    }
    
    // Validate password change (if user wants to change password)
    if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword) {
            showError('currentPasswordError', 'Current password is required');
            isValid = false;
        }
        
        if (!newPassword) {
            showError('newPasswordError', 'New password is required');
            isValid = false;
        } else if (newPassword.length < 6) {
            showError('newPasswordError', 'Password must be at least 6 characters');
            isValid = false;
        }
        
        if (!confirmPassword) {
            showError('confirmPasswordError', 'Please confirm your password');
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            showError('confirmPasswordError', 'Passwords do not match');
            isValid = false;
        }
    }
    
    if (isValid) {
        updateProfile(name, email, phone, address, currentPassword, newPassword);
    }
});

function updateProfile(name, email, phone, address, currentPassword, newPassword) {
    showMessage('success', 'Updating your profile...');
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    
    if (currentPassword && newPassword) {
        formData.append('current_password', currentPassword);
        formData.append('new_password', newPassword);
    }
    
    fetch('/Saloon%20Service%20Management/Management/Customer/MVC/php/update-profile.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage('success', 'Profile updated successfully!');
            
            // Clear password fields
            currentPasswordInput.value = '';
            newPasswordInput.value = '';
            confirmPasswordInput.value = '';
            
            // Reload profile
            setTimeout(() => {
                loadProfile();
            }, 1000);
        } else {
            showMessage('error', data.message);
        }
    })
    .catch(error => {
        showMessage('error', 'Connection error. Please try again.');
        console.error('Error:', error);
    });
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function isValidPhone(phone) {
    const phonePattern = /^[0-9]{11}$/;
    return phonePattern.test(phone);
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.classList.add('show');
}

function clearErrors() {
    document.querySelectorAll('.error-text').forEach(el => {
        el.classList.remove('show');
    });
    messageBox.className = 'message-box';
}

function showMessage(type, message) {
    messageBox.textContent = message;
    messageBox.className = 'message-box ' + type;
}