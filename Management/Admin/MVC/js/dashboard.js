// Check if user is logged in
window.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    loadDashboardData();
});

function checkLogin() {
    fetch('/Saloon%20Service%20Management/Management/Admin/MVC/php/check-session.php')
    .then(response => response.json())
    .then(data => {
        if (!data.logged_in) {
            window.location.href = 'login.html';
        } else {
            // Update admin name in header
            document.getElementById('adminName').textContent = data.user_name;
            document.getElementById('welcomeName').textContent = data.user_name;
            
            // Update profile information
            document.getElementById('adminProfileName').textContent = data.user_name;
            document.getElementById('adminProfileEmail').textContent = data.user_email;
            document.getElementById('adminProfilePhone').textContent = data.user_phone || '-';
            document.getElementById('adminProfileRole').textContent = data.user_role;
            document.getElementById('adminProfileAddress').textContent = data.user_address || '-';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        window.location.href = 'login.html';
    });
}

function loadDashboardData() {
    // Load statistics
    fetch('/Saloon%20Service%20Management/Management/Admin/MVC/php/get-dashboard-data.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update statistics
            document.getElementById('totalCustomers').textContent = data.stats.customers;
            document.getElementById('totalStaff').textContent = data.stats.staff;
            document.getElementById('totalAdmins').textContent = data.stats.admins;
            document.getElementById('totalAppointments').textContent = data.stats.appointments;
            
            // Load users table
            loadUsersTable(data.users);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function loadUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No users found</td></tr>';
        return;
    }
    
    let html = '';
    users.forEach(user => {
        let roleClass = '';
        if (user.role === 'admin') roleClass = 'role-admin';
        else if (user.role === 'staff') roleClass = 'role-staff';
        else roleClass = 'role-customer';
        
        html += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone || '-'}</td>
                <td><span class="role-badge ${roleClass}">${user.role.toUpperCase()}</span></td>
                <td>${formatDate(user.created_at)}</td>
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