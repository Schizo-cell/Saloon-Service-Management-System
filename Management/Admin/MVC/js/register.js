// Get all elements
const form = document.getElementById('registerForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const addressInput = document.getElementById('address');
const roleInput = document.getElementById('role');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const phoneError = document.getElementById('phoneError');
const addressError = document.getElementById('addressError');
const roleError = document.getElementById('roleError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');
const messageBox = document.getElementById('messageBox');

// When form is submitted
form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();
    const role = roleInput.value;
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    
    clearAllErrors();
    
    let isValid = true;
    
    if (name === '') {
        showError(nameError, 'Name is required');
        isValid = false;
    } else if (name.length < 3) {
        showError(nameError, 'Name must be at least 3 characters');
        isValid = false;
    }
    
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
    
    if (address !== '' && address.length < 10) {
        showError(addressError, 'Address must be at least 10 characters');
        isValid = false;
    }
    
    if (role === '') {
        showError(roleError, 'Please select a role');
        isValid = false;
    }
    
    if (password === '') {
        showError(passwordError, 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError(passwordError, 'Password must be at least 6 characters');
        isValid = false;
    }
    
    if (confirmPassword === '') {
        showError(confirmPasswordError, 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError(confirmPasswordError, 'Passwords do not match');
        isValid = false;
    }
    
    if (isValid) {
        sendRegisterRequest(name, email, phone, address, role, password);
    }
});

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
    nameError.classList.remove('show');
    emailError.classList.remove('show');
    phoneError.classList.remove('show');
    addressError.classList.remove('show');
    roleError.classList.remove('show');
    passwordError.classList.remove('show');
    confirmPasswordError.classList.remove('show');
    messageBox.className = 'message-box';
    messageBox.textContent = '';
}

function showMessage(type, message) {
    messageBox.textContent = message;
    messageBox.className = 'message-box ' + type;
}

function sendRegisterRequest(name, email, phone, address, role, password) {
    showMessage('success', 'Creating your account...');
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('role', role);
    formData.append('password', password);
    
    fetch('/Saloon%20Service%20Management/Management/Admin/MVC/php/register.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success === true) {
            showMessage('success', 'Registration successful! Redirecting to login...');
            form.reset();
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

// Clear errors when user types
nameInput.addEventListener('input', clearAllErrors);
emailInput.addEventListener('input', clearAllErrors);
phoneInput.addEventListener('input', clearAllErrors);
addressInput.addEventListener('input', clearAllErrors);
roleInput.addEventListener('change', clearAllErrors);
passwordInput.addEventListener('input', clearAllErrors);
confirmPasswordInput.addEventListener('input', clearAllErrors);