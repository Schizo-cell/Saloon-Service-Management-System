let allCustomers = [];
let customerToDelete = null;

// Check login on load
window.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    loadCustomers();
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

// Load all customers
function loadCustomers() {
    fetch('/Saloon%20Service%20Management/Management/Admin/MVC/php/get-customers.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            allCustomers = data.customers;
            document.getElementById('totalCustomers').textContent = data.customers.length;
            displayCustomers(data.customers);
        } else {
            showEmptyState();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('customersTableBody').innerHTML = 
            '<tr><td colspan="7" style="text-align: center;">Failed to load customers</td></tr>';
    });
}

// Display customers in table
function displayCustomers(customers) {
    const tbody = document.getElementById('customersTableBody');
    
    if (customers.length === 0) {
        showEmptyState();
        return;
    }
    
    let html = '';
    customers.forEach(customer => {
        html += `
            <tr>
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone || '-'}</td>
                <td>${customer.address || '-'}</td>
                <td>${formatDate(customer.created_at)}</td>
                <td>
                    <button class="btn-view" onclick="viewCustomer(${customer.id})">View</button>
                    <button class="btn-delete-small" onclick="showDeleteModal(${customer.id})">Delete</button>
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
        
        const filtered = allCustomers.filter(customer => {
            return customer.name.toLowerCase().includes(searchTerm) ||
                   customer.email.toLowerCase().includes(searchTerm);
        });
        
        displayCustomers(filtered);
    });
}

// View customer details
function viewCustomer(customerId) {
    const customer = allCustomers.find(c => c.id === customerId);
    if (customer) {
        alert(`Customer Details:\n\nName: ${customer.name}\nEmail: ${customer.email}\nPhone: ${customer.phone || 'N/A'}\nAddress: ${customer.address || 'N/A'}\nJoined: ${formatDate(customer.created_at)}`);
    }
}

// Show delete confirmation modal
function showDeleteModal(customerId) {
    customerToDelete = customerId;
    document.getElementById('deleteModal').classList.add('show');
}

// Close delete modal
function closeDeleteModal() {
    customerToDelete = null;
    document.getElementById('deleteModal').classList.remove('show');
}

// Confirm delete
function confirmDelete() {
    if (!customerToDelete) return;
    
    const formData = new FormData();
    formData.append('customer_id', customerToDelete);
    
    fetch('/Saloon%20Service%20Management/Management/Admin/MVC/php/delete-customer.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Customer deleted successfully');
            closeDeleteModal();
            loadCustomers(); // Reload list
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
    const tbody = document.getElementById('customersTableBody');
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No customers found</td></tr>';
}