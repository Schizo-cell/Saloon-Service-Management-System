// Get all elements
const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const messageBox = document.getElementById('messageBox');

// When form is submitted
form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    clearAllErrors();
    
    let isValid = true;
    
    if (email === '') {
        showError(emailError, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError(emailError, 'Please enter a valid email address');
        isValid = false;
    }
    
    if (password === '') {
        showError(passwordError, 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError(passwordError, 'Password must be at least 6 characters');
        isValid = false;
    }
    
    if (isValid) {
        sendLoginRequest(email, password);
    }
});

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
}

function clearAllErrors() {
    emailError.classList.remove('show');
    passwordError.classList.remove('show');
    messageBox.className = 'message-box';
    messageBox.textContent = '';
}

function showMessage(type, message) {
    messageBox.textContent = message;
    messageBox.className = 'message-box ' + type;
}

function sendLoginRequest(email, password) {
    showMessage('success', 'Checking credentials...');
    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    
    const rememberMe = document.getElementById('rememberMe').checked;
    if (rememberMe) {
        formData.append('remember_me', 'yes');
    }
    
    fetch('/Saloon%20Service%20Management/Management/Admin/MVC/php/login.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success === true) {
            showMessage('success', 'Login successful! Redirecting...');
            setTimeout(function() {
                window.location.href = 'dashboard.html';
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

emailInput.addEventListener('input', clearAllErrors);
passwordInput.addEventListener('input', clearAllErrors);