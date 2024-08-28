const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;
const session = require('express-session');

// Kết nối cơ sở dữ liệu MySQL
const connection = require('./db');

// Sử dụng middleware để parse JSON body
app.use(express.json());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set thành true nếu dùng HTTPS
}));

// Phục vụ các tệp CSS và JS từ các thư mục cụ thể
app.use('/CSS', express.static(path.join(__dirname, 'CSS')));
app.use('/Images', express.static(path.join(__dirname, 'Images')));
app.use('/JS', express.static(path.join(__dirname, 'JS')));

// Định nghĩa route để phục vụ tệp HTML cho trang chủ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route cho trang đăng nhập
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Route cho trang đăng ký
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Route cho trang admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Route cho trang hóa đơn (orders)
app.get('/orders', (req, res) => {
    res.sendFile(path.join(__dirname, 'orders.html'));
});

// Route cho trang quản lý khách hàng (customers)
app.get('/customers', (req, res) => {
    res.sendFile(path.join(__dirname, 'customers.html'));
});

// Route cho trang nhân viên (employees.html)
app.get('/employees', (req, res) => {
    res.sendFile(path.join(__dirname, 'employees.html'));
});

// Import các route từ thư mục routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const paymentRoutes = require('./routes/payment');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/orders');
const customerRoutes = require('./routes/customers');
const employeeRoutes = require('./routes/employees'); // Thêm routes cho nhân viên



// Sử dụng các route
app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/payment', paymentRoutes);
app.use('/user', userRoutes);
app.use('/api/orders', orderRoutes); // Route mới cho orders
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes); // Sử dụng routes cho nhân viên


// Khởi động server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
