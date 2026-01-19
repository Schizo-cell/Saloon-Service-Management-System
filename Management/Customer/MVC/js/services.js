// Check login on load
window.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    loadServices();
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

// Load all services with their categories
function loadServices() {
    fetch('/Saloon%20Service%20Management/Management/Customer/MVC/php/get-all-services.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
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

// Display services with categories
function displayServices(services) {
    const container = document.getElementById('servicesContainer');
    
    if (services.length === 0) {
        showEmptyState();
        return;
    }
    
    let html = '';
    
    services.forEach(service => {
        html += `
            <div class="service-section">
                <div class="service-header">
                    <div class="service-icon">${getServiceIcon(service.name)}</div>
                    <div class="service-info">
                        <h2>${service.name}</h2>
                        <p>${service.description || 'Professional service with expert care'}</p>
                    </div>
                </div>
                
                <div class="categories-grid">
                    ${service.categories.map(category => `
                        <div class="category-card">
                            <div class="category-header">
                                <div>
                                    <h3>${category.name}</h3>
                                    <span class="category-status">${category.status}</span>
                                </div>
                                <span class="category-price">৳${category.price}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Get icon for service
function getServiceIcon(serviceName) {
    const icons = {
        'Hair Cut': '✂️',
        'Hair Color': '🎨',
        'Facial': '💆',
        'Massage': '💆‍♀️',
        'Manicure & Pedicure': '💅',
        'Spa': '🧖',
        'Makeup': '💄',
        'Waxing': '✨'
    };
    
    return icons[serviceName] || '✂️';
}

// Show empty state
function showEmptyState() {
    const container = document.getElementById('servicesContainer');
    container.innerHTML = `
        <div class="empty-state">
            <i>✂️</i>
            <h3>No services available</h3>
            <p>Please check back later for our services</p>
        </div>
    `;
}