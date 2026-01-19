let allServices = [];
let deleteItem = { type: null, id: null };

// Check login on load
window.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    loadServices();
    setupForms();
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

// Load all services with categories
function loadServices() {
    fetch('/Saloon%20Service%20Management/Management/Admin/MVC/php/get-all-services-admin.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            allServices = data.services;
            displayServices(data.services);
        } else {
            showEmptyState();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('servicesContainer').innerHTML = 
            '<div class="loading">Failed to load services</div>';
    });
}

// Display services
function displayServices(services) {
    const container = document.getElementById('servicesContainer');
    
    if (services.length === 0) {
        showEmptyState();
        return;
    }
    
    let html = '';
    
    services.forEach(service => {
        const statusClass = service.status === 'Active' ? 'status-active' : 'status-inactive';
        
        html += `
            <div class="service-card">
                <div class="service-header">
                    <div class="service-info">
                        <h2>${service.name}</h2>
                        <p>${service.description || 'No description'}</p>
                    </div>
                    <div>
                        <span class="service-status ${statusClass}">${service.status}</span>
                        <div class="service-actions">
                            <button class="btn-edit" onclick="editService(${service.id})">Edit</button>
                            <button class="btn-delete-service" onclick="deleteService(${service.id})">Delete</button>
                        </div>
                    </div>
                </div>
                
                <div class="categories-header">
                    <h3>Categories (${service.categories.length})</h3>
                    <button class="btn-add-category" onclick="showAddCategoryModal(${service.id})">+ Add Category</button>
                </div>
                
                <div class="categories-grid">
                    ${service.categories.length > 0 ? service.categories.map(cat => `
                        <div class="category-item">
                            <h4>${cat.name}</h4>
                            <span class="category-price">৳${cat.price}</span>
                            <span class="service-status ${cat.status === 'Active' ? 'status-active' : 'status-inactive'}">${cat.status}</span>
                            <div class="category-actions">
                                <button class="btn-edit-cat" onclick="editCategory(${cat.id})">Edit</button>
                                <button class="btn-delete-cat" onclick="deleteCategory(${cat.id})">Delete</button>
                            </div>
                        </div>
                    `).join('') : '<p style="color: #999; grid-column: 1/-1;">No categories yet</p>'}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Show add service modal
function showAddServiceModal() {
    document.getElementById('serviceModalTitle').textContent = 'Add New Service';
    document.getElementById('serviceId').value = '';
    document.getElementById('serviceName').value = '';
    document.getElementById('serviceDescription').value = '';
    document.getElementById('serviceStatus').value = 'Active';
    document.getElementById('serviceMessage').className = 'message-box';
    document.getElementById('serviceModal').classList.add('show');
}

// Edit service
function editService(serviceId) {
    const service = allServices.find(s => s.id === serviceId);
    if (!service) return;
    
    document.getElementById('serviceModalTitle').textContent = 'Edit Service';
    document.getElementById('serviceId').value = service.id;
    document.getElementById('serviceName').value = service.name;
    document.getElementById('serviceDescription').value = service.description || '';
    document.getElementById('serviceStatus').value = service.status;
    document.getElementById('serviceMessage').className = 'message-box';
    document.getElementById('serviceModal').classList.add('show');
}

// Close service modal
function closeServiceModal() {
    document.getElementById('serviceModal').classList.remove('show');
}

// Show add category modal
function showAddCategoryModal(serviceId) {
    document.getElementById('categoryModalTitle').textContent = 'Add New Category';
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryServiceId').value = serviceId;
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryPrice').value = '';
    document.getElementById('categoryStatus').value = 'Active';
    document.getElementById('categoryMessage').className = 'message-box';
    document.getElementById('categoryModal').classList.add('show');
}

// Edit category
function editCategory(categoryId) {
    let category = null;
    allServices.forEach(s => {
        const found = s.categories.find(c => c.id === categoryId);
        if (found) category = found;
    });
    
    if (!category) return;
    
    document.getElementById('categoryModalTitle').textContent = 'Edit Category';
    document.getElementById('categoryId').value = category.id;
    document.getElementById('categoryServiceId').value = category.service_id;
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryPrice').value = category.price;
    document.getElementById('categoryStatus').value = category.status;
    document.getElementById('categoryMessage').className = 'message-box';
    document.getElementById('categoryModal').classList.add('show');
}

// Close category modal
function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('show');
}

// Delete service
function deleteService(serviceId) {
    deleteItem = { type: 'service', id: serviceId };
    document.getElementById('deleteMessage').textContent = 'Are you sure you want to delete this service? All its categories will also be deleted.';
    document.getElementById('deleteModal').classList.add('show');
}

// Delete category
function deleteCategory(categoryId) {
    deleteItem = { type: 'category', id: categoryId };
    document.getElementById('deleteMessage').textContent = 'Are you sure you want to delete this category?';
    document.getElementById('deleteModal').classList.add('show');
}

// Close delete modal
function closeDeleteModal() {
    deleteItem = { type: null, id: null };
    document.getElementById('deleteModal').classList.remove('show');
}

// Confirm delete
function confirmDelete() {
    if (!deleteItem.type || !deleteItem.id) return;
    
    const formData = new FormData();
    formData.append('type', deleteItem.type);
    formData.append('id', deleteItem.id);
    
    fetch('/Saloon%20Service%20Management/Management/Admin/MVC/php/delete-service-category.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            closeDeleteModal();
            loadServices();
        } else {
            alert('Failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Connection error');
    });
}

// Setup form submissions
function setupForms() {
    // Service form
    document.getElementById('serviceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('service_id', document.getElementById('serviceId').value);
        formData.append('name', document.getElementById('serviceName').value);
        formData.append('description', document.getElementById('serviceDescription').value);
        formData.append('status', document.getElementById('serviceStatus').value);
        
        fetch('/Saloon%20Service%20Management/Management/Admin/MVC/php/save-service.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage('serviceMessage', 'success', data.message);
                setTimeout(() => {
                    closeServiceModal();
                    loadServices();
                }, 1500);
            } else {
                showMessage('serviceMessage', 'error', data.message);
            }
        })
        .catch(error => {
            showMessage('serviceMessage', 'error', 'Connection error');
        });
    });
    
    // Category form
    document.getElementById('categoryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('category_id', document.getElementById('categoryId').value);
        formData.append('service_id', document.getElementById('categoryServiceId').value);
        formData.append('name', document.getElementById('categoryName').value);
        formData.append('price', document.getElementById('categoryPrice').value);
        formData.append('status', document.getElementById('categoryStatus').value);
        
        fetch('/Saloon%20Service%20Management/Management/Admin/MVC/php/save-category.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage('categoryMessage', 'success', data.message);
                setTimeout(() => {
                    closeCategoryModal();
                    loadServices();
                }, 1500);
            } else {
                showMessage('categoryMessage', 'error', data.message);
            }
        })
        .catch(error => {
            showMessage('categoryMessage', 'error', 'Connection error');
        });
    });
}

// Show message
function showMessage(elementId, type, message) {
    const el = document.getElementById(elementId);
    el.textContent = message;
    el.className = 'message-box ' + type;
}

// Show empty state
function showEmptyState() {
    const container = document.getElementById('servicesContainer');
    container.innerHTML = '<div class="loading">No services found. Click "Add New Service" to create one.</div>';
}