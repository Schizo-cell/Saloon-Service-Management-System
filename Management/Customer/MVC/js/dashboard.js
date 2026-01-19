// Check if user is logged in
window.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    loadDashboardData();
});

function checkLogin() {
    fetch('/Saloon%20Service%20Management/Management/Customer/MVC/php/check-session.php')
    .then(response => response.json())
    .then(data => {
        if (!data.logged_in) {
            window.location.href = 'login.html';
        } else {
            // Update customer name
            document.getElementById('customerName').textContent = data.user_name;
            document.getElementById('welcomeName').textContent = data.user_name;
            
            // Update profile information
            document.getElementById('profileName').textContent = data.user_name;
            document.getElementById('profileEmail').textContent = data.user_email;
            document.getElementById('profilePhone').textContent = data.user_phone || '-';
            document.getElementById('profileAddress').textContent = data.user_address || '-';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        window.location.href = 'login.html';
    });
}

function loadDashboardData() {
    fetch('/Saloon%20Service%20Management/Management/Customer/MVC/php/get-dashboard-data.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update statistics
            document.getElementById('totalAppointments').textContent = data.stats.total;
            document.getElementById('upcomingAppointments').textContent = data.stats.upcoming;
            document.getElementById('completedAppointments').textContent = data.stats.completed;
            
            // Load recent appointments
            loadAppointmentsTable(data.appointments);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function loadAppointmentsTable(appointments) {
    const tbody = document.getElementById('appointmentsTableBody');
    
    if (appointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No appointments yet. <a href="book-appointment.html">Book your first appointment!</a></td></tr>';
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
                <td>${formatDate(appointment.date)}</td>
                <td>${appointment.time}</td>
                <td>${appointment.service}</td>
                <td><span class="status-badge ${statusClass}">${appointment.status}</span></td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}