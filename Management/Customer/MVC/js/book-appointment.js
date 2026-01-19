// Elements
const form = document.getElementById('bookingForm');
const serviceSelect = document.getElementById('service');
const categorySelect = document.getElementById('category');
const dateInput = document.getElementById('appointmentDate');
const timeInput = document.getElementById('appointmentTime');
const messageBox = document.getElementById('messageBox');

// Check login on load
window.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    loadServices();
    setMinDate();
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

// Set minimum date to today
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Load services
function loadServices() {
    fetch('/Saloon%20Service%20Management/Management/Customer/MVC/php/get-services.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            serviceSelect.innerHTML = '<option value="">Choose a service...</option>';
            data.services.forEach(service => {
                const option = document.createElement('option');
                option.value = service.id;
                option.textContent = service.name;
                serviceSelect.appendChild(option);
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// When service is selected, load categories
serviceSelect.addEventListener('change', function() {
    const serviceId = this.value;
    
    if (serviceId === '') {
        categorySelect.innerHTML = '<option value="">First select a service...</option>';
        return;
    }
    
    fetch('/Saloon%20Service%20Management/Management/Customer/MVC/php/get-categories.php?service_id=' + serviceId)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            categorySelect.innerHTML = '<option value="">Choose a category...</option>';
            data.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name + ' - ৳' + category.price;
                categorySelect.appendChild(option);
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    clearErrors();
    
    const date = dateInput.value;
    const time = timeInput.value;
    const service = serviceSelect.value;
    const category = categorySelect.value;
    const notes = document.getElementById('notes').value;
    
    let isValid = true;
    
    if (date === '') {
        showError('dateError', 'Date is required');
        isValid = false;
    }
    
    if (time === '') {
        showError('timeError', 'Time is required');
        isValid = false;
    }
    
    if (service === '') {
        showError('serviceError', 'Please select a service');
        isValid = false;
    }
    
    if (category === '') {
        showError('categoryError', 'Please select a category');
        isValid = false;
    }
    
    if (isValid) {
        bookAppointment(date, time, service, category, notes);
    }
});

function bookAppointment(date, time, serviceId, categoryId, notes) {
    showMessage('success', 'Booking your appointment...');
    
    const formData = new FormData();
    formData.append('date', date);
    formData.append('time', time);
    formData.append('service_id', serviceId);
    formData.append('category_id', categoryId);
    formData.append('notes', notes);
    
    fetch('/Saloon%20Service%20Management/Management/Customer/MVC/php/book-appointment.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage('success', 'Appointment booked successfully! Redirecting...');
            form.reset();
            setTimeout(() => {
                window.location.href = 'my-appointments.html';
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