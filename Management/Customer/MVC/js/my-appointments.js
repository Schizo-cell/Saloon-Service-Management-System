let allAppointments = [];
let currentFilter = 'all';

// Check login on load
window.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    loadAppointments();
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

// Load all appointments
function loadAppointments() {
    fetch('/Saloon%20Service%20Management/Management/Customer/MVC/php/get-my-appointments.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            allAppointments = data.appointments;
            displayAppointments(allAppointments);
        } else {
            showEmptyState();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('appointmentsContainer').innerHTML = 
            '<div class="loading">Failed to load appointments</div>';
    });
}

// Display appointments
function displayAppointments(appointments) {
    const container = document.getElementById('appointmentsContainer');
    
    if (appointments.length === 0) {
        showEmptyState();
        return;
    }
    
    let html = '';
    appointments.forEach(appointment => {
        let statusClass = '';
        if (appointment.status === 'Pending') statusClass = 'status-pending';
        else if (appointment.status === 'Confirmed') statusClass = 'status-confirmed';
        else if (appointment.status === 'Completed') statusClass = 'status-completed';
        else statusClass = 'status-cancelled';
        
        const canCancel = appointment.status === 'Pending' || appointment.status === 'Confirmed';
        
        html += `
            <div class="appointment-card">
                <div class="appointment-header">
                    <span class="appointment-id">#${appointment.id}</span>
                    <span class="status-badge ${statusClass}">${appointment.status}</span>
                </div>
                
                <div class="appointment-details">
                    <div class="detail-row">
                        <i>📅</i>
                        <span><span class="detail-label">Date:</span> ${formatDate(appointment.date)}</span>
                    </div>
                    <div class="detail-row">
                        <i>⏰</i>
                        <span><span class="detail-label">Time:</span> ${formatTime(appointment.time)}</span>
                    </div>
                    <div class="detail-row">
                        <i>✂️</i>
                        <span><span class="detail-label">Service:</span> ${appointment.service}</span>
                    </div>
                    <div class="detail-row">
                        <i>📋</i>
                        <span><span class="detail-label">Category:</span> ${appointment.category}</span>
                    </div>
                </div>
                
                <div class="appointment-actions">
                    <button class="btn-cancel" onclick="cancelAppointment(${appointment.id})" 
                            ${!canCancel ? 'disabled' : ''}>
                        ${canCancel ? 'Cancel Appointment' : 'Cannot Cancel'}
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Filter appointments
function filterAppointments(filter) {
    currentFilter = filter;
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter appointments
    let filtered = allAppointments;
    
    if (filter === 'upcoming') {
        filtered = allAppointments.filter(a => 
            a.status === 'Pending' || a.status === 'Confirmed'
        );
    } else if (filter === 'completed') {
        filtered = allAppointments.filter(a => a.status === 'Completed');
    } else if (filter === 'cancelled') {
        filtered = allAppointments.filter(a => a.status === 'Cancelled');
    }
    
    displayAppointments(filtered);
}

// Cancel appointment
function cancelAppointment(appointmentId) {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
        return;
    }
    
    const formData = new FormData();
    formData.append('appointment_id', appointmentId);
    
    fetch('/Saloon%20Service%20Management/Management/Customer/MVC/php/cancel-appointment.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Appointment cancelled successfully');
            loadAppointments(); // Reload appointments
        } else {
            alert('Failed to cancel: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Connection error');
    });
}

// Show empty state
function showEmptyState() {
    const container = document.getElementById('appointmentsContainer');
    container.innerHTML = `
        <div class="empty-state">
            <i>📅</i>
            <h3>No appointments found</h3>
            <p>You haven't booked any appointments yet</p>
            <a href="book-appointment.html" class="btn-book">Book Your First Appointment</a>
        </div>
    `;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Format time
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}