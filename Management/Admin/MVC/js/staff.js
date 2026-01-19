let allStaff = [];
let currentFilter = 'all';
let staffToDelete = null;

// Check login on load
window.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    loadStaff();
    setupSearch();
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

// Load all staff and admins
function loadStaff() {
    fetch('/Saloon%20Service%20Management/Management/Admin/MVC/php/get-staff.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            allStaff = data.staff;
            updateStats(data.staff);
            displayStaff(data.staff);
        } else {
            showEmptyState();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('staffTableBody').innerHTML = 
            '<tr><td colspan="8" style="text-align: center;">Failed to load staff</td></tr>';
    });
}

// Update statistics
function updateStats(staff) {
    const staffCount = staff.filter(s => s.role === 'staff').length;
    const adminCount = staff.filter(s => s.role === 'admin').length;
    
    document.getElementById('totalStaff').textContent = staffCount;
    document.getElementById('totalAdmins').textContent = adminCount;
}

// Display staff in table
function displayStaff(staff) {
    const tbody = document.getElementById('staffTableBody');
    
    if (staff.length === 0) {
        showEmptyState();
        return;
    }
    
    let html = '';
    staff.forEach(member => {
        const roleClass = member.role === 'admin' ? 'role-admin' : 'role-staff';
        
        html += `
            <tr>
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td>${member.phone || '-'}</td>
                <td><span class="role-badge ${roleClass}">${member.role.toUpperCase()}</span></td>
                <td>${member.address || '-'}</td>
                <td>${formatDate(member.created_at)}</td>
                <td>
                    <button class="btn-view" onclick="viewStaff(${member.id})">View</button>
                    <button class="btn-delete-small" onclick="showDeleteModal(${member.id})">Delete</button>
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
        
        let filtered = allStaff.filter(member => {
            return member.name.toLowerCase().includes(searchTerm) ||
                   member.email.toLowerCase().includes(searchTerm);
        });
        
        // Apply current filter
        if (currentFilter !== 'all') {
            filtered = filtered.filter(m => m.role === currentFilter);
        }
        
        displayStaff(filtered);
    });
}

// Filter staff
function filterStaff(filter) {
    currentFilter = filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter staff
    let filtered = allStaff;
    
    if (filter === 'staff') {
        filtered = allStaff.filter(m => m.role === 'staff');
    } else if (filter === 'admin') {
        filtered = allStaff.filter(m => m.role === 'admin');
    }
    
    displayStaff(filtered);
}

// View staff details
function viewStaff(staffId) {
    const member = allStaff.find(s => s.id === staffId);
    if (member) {
        alert(`Staff Details:\n\nName: ${member.name}\nEmail: ${member.email}\nPhone: ${member.phone || 'N/A'}\nRole: ${member.role.toUpperCase()}\nAddress: ${member.address || 'N/A'}\nJoined: ${formatDate(member.created_at)}`);
    }
}

// Show delete confirmation modal
function showDeleteModal(staffId) {
    staffToDelete = staffId;
    document.getElementById('deleteModal').classList.add('show');
}

// Close delete modal
function closeDeleteModal() {
    staffToDelete = null;
    document.getElementById('deleteModal').classList.remove('show');
}

// Confirm delete
function confirmDelete() {
    if (!staffToDelete) return;
    
    const formData = new FormData();
    formData.append('staff_id', staffToDelete);
    
    fetch('/Saloon%20Service%20Management/Management/Admin/MVC/php/delete-staff.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('User deleted successfully');
            closeDeleteModal();
            loadStaff(); // Reload list
        } else {
            alert('Failed to delete: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Connection error');
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Show empty state
function showEmptyState() {
    const tbody = document.getElementById('staffTableBody');
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No staff members found</td></tr>';
}