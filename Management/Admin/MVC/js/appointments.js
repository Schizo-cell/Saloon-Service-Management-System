let allAppointments = [];
let currentFilter = 'all';

// Check login on load
window.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    loadAppointments();
    setupSearch();
    setupStatusForm();
});

// Check if logged in
function checkLogin() {
    fetch('/Saloon%20Service%20Management/Management/Admin/MVC/php/check-session.php')
    .then(response => response.json())
    .then(data => {
        if (!data.logged_in) {
            window.location.href = 'login.html';
        } else {
            document.getElementById('adminName').textContent = data.user_name;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        window.location.href = 'login.html';
    });
}

// Load all appointments
function loadAppointments() {
    fetch('/Saloon%20Service%20Management/Management/Admin/MVC/php/get-all-appointments.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            allAppointments = data.appointments;
            updateStats(data.appointments);
            displayAppointments(data.appointments);
        } else {
            showEmptyState();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('appointmentsTableBody').innerHTML = 
            '<tr><td colspan="8" style="text-align: center;">Failed to load appointments</td></tr>';
    });
}

// Update statistics
function updateStats(appointments) {
    const total = appointments.length;
    const pending = appointments.filter(a => a.status === 'Pending').length;
    
    document.getElementById('totalAppointments').textContent = total;
    document.getElementById('pendingAppointments').textContent = pending;
}

// Display appointments in table
function displayAppointments(appointments) {
    const tbody = document.getElementById('appointmentsTableBody');
    
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
        
        html += `
            <tr>
                <td>${appointment.id}</td>
                <td>${appointment.customer_name}</td>
                <td>${formatDate(appointment.date)}</td>
                <td>${formatTime(appointment.time)}</td>
                <td>${appointment.service}</td>
                <td>${appointment.category}</td>
                <td><span class="status-badge ${statusClass}">${appointment.status}</span></td>
                <td>
                    <button class="btn-update" onclick="showStatusModal(${appointment.id}, '${appointment.status}')">Update</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        let filtered = allAppointments.filter(appointment => {
            return appointment.customer_name.toLowerCase().includes(searchTerm);
        });
        
        // Apply current filter
        if (currentFilter !== 'all') {
            filtered = filtered.filter(a => a.status === currentFilter);
        }
        
        displayAppointments(filtered);
    });
}

// Filter appointments
function filterAppointments(filter) {
    currentFilter = filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter appointments
    let filtered = allAppointments;
    
    if (filter !== 'all') {
        filtered = allAppointments.filter(a => a.status === filter);
    }
    
    displayAppointments(filtered);
}

// Show status modal
function showStatusModal(appointmentId, currentStatus) {
    document.getElementById('appointmentId').value = appointmentId;
    document.getElementById('newStatus').value = currentStatus;
    document.getElementById('statusMessage').className = 'message-box';
    document.getElementById('statusModal').classList.add('show');
}

// Close status modal
function closeStatusModal() {
    document.getElementById('statusModal').classList.remove('show');
}

// Setup status form
function setupStatusForm() {
    document.getElementById('statusForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const appointmentId = document.getElementById('appointmentId').value;
        const newStatus = document.getElementById('newStatus').value;
        
        const formData = new FormData();
        formData.append('appointment_id', appointmentId);
        formData.append('status', newStatus);
        
        fetch('/Saloon%20Service%20Management/Management/Admin/MVC/php/update-appointment-status.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage('statusMessage', 'success', 'Status updated successfully!');
                setTimeout(() => {
                    closeStatusModal();
                    loadAppointments();
                }, 1500);
            } else {
                showMessage('statusMessage', 'error', data.message);
            }
        })
        .catch(error => {
            showMessage('statusMessage', 'error', 'Connection error');
        });
    });
}

// Show message
function showMessage(elementId, type, message) {
    const el = document.getElementById(elementId);
    el.textContent = message;
    el.className = 'message-box ' + type;
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

// Show empty state
function showEmptyState() {
    const tbody = document.getElementById('appointmentsTableBody');
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No appointments found</td></tr>';
}