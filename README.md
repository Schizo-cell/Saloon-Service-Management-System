# 🏪 Salon Service Management System

A comprehensive web-based salon management system built with HTML, CSS, JavaScript, PHP, and MySQL.

## 👥 Group 16 - Team Members
- **Ahnaf Aman Auvrow** - 22-48920-3
- **Susanta Roy Emon ** - 22-49558-3

## 🎯 Project Overview
Complete salon management solution for handling customer appointments, service management, staff coordination, and administrative operations.

## ✨ Features

### 👤 Customer Portal
- ✅ User Registration & Authentication
- ✅ Password Recovery System
- ✅ Browse Services & Pricing
- ✅ Book Appointments
- ✅ View/Cancel Appointments
- ✅ Profile Management

### 👨‍💼 Admin Portal
- ✅ Admin Dashboard with Statistics
- ✅ Customer Management (View/Delete)
- ✅ Staff Management (View/Delete)
- ✅ Service & Category Management (Full CRUD)
- ✅ Appointment Management
- ✅ Status Updates

## 🛠️ Technology Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: PHP 
- **Database**: MySQL 
- **Server**: Apache (XAMPP)
- **Version Control**: Git & GitHub

## 📁 Project Structure
```
Management/
├── index.html              # Landing page
├── style.css              # Landing page styles
├── script.js              # Landing page scripts
├── Customer/
│   └── MVC/
│       ├── html/          # Customer pages
│       ├── css/           # Customer styles
│       ├── js/            # Customer scripts
│       ├── php/           # Customer backend
│       └── db/            # Database connection
└── Admin/
    └── MVC/
        ├── html/          # Admin pages
        ├── css/           # Admin styles
        ├── js/            # Admin scripts
        ├── php/           # Admin backend
        └── db/            # Database connection
```

## 🗄️ Database Schema

### Tables
- **users** - Customer, Staff, and Admin accounts
- **Service** - Available salon services
- **Category** - Service pricing categories  
- **Appointment** - Customer bookings

## 🚀 Installation Guide

### Prerequisites
- XAMPP (or any Apache + MySQL server)
- Git
- Modern web browser

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/Schizo-cell/Saloon-Service-Management-System.git
```

2. **Move to XAMPP htdocs**
```bash
# Copy the entire folder to:
C:\xampp\htdocs\
```

3. **Start XAMPP**
- Open XAMPP Control Panel
- Start Apache
- Start MySQL

4. **Create Database**
- Open: http://localhost/phpmyadmin
- Click "New" → Create database: `salon_db`
- Select `utf8mb4_general_ci` collation
- Click "Create"

5. **Import Database**
- Click on `salon_db`
- Click "SQL" tab
- Copy and paste the SQL queries from database setup
- Click "Go"

6. **Access the Application**
```
Landing Page: http://localhost/Saloon-Service-Management-System/Management/
Customer: http://localhost/Saloon-Service-Management-System/Management/Customer/MVC/html/login.html
Admin: http://localhost/Saloon-Service-Management-System/Management/Admin/MVC/html/login.html
```

## 🔐 Default Login Credentials

### Customer Account
```
Email: customer@test.com
Password: password
```

### Admin Account
```
Email: admin@salon.com
Password: password
```

### Staff Account
```
Email: staff@salon.com
Password: password
```

## 📊 Features Breakdown

### Customer Features (Complete ✅)
- User authentication with password hashing
- Service browsing with categories
- Appointment booking system
- Appointment management (view/cancel)
- Profile updates with password change

### Admin Features (Complete ✅)
- Dashboard with system statistics
- Customer CRUD operations
- Staff CRUD operations
- Service CRUD operations
- Category CRUD operations
- Appointment status management

### Security Features (Complete ✅)
- Bcrypt password hashing
- Session management
- SQL injection prevention
- Input validation & sanitization
- Role-based access control

## 🎓 Academic Information
- **Course**: [Your Course Name & Code]
- **Instructor**: [Sir's Name]
- **Institution**: [University/College Name]
- **Semester**: Spring 2026
- **Submission Date**: January 2026

## 📝 License
This project is developed as part of academic coursework.

## 🙏 Acknowledgments
Special thanks to our course instructor for guidance and support throughout the project development.

---

**Developed by Group 16-Ahnaf & Shushanto**