const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../db'); // Tệp kết nối cơ sở dữ liệu

// Lấy danh sách khách hàng
router.get('/', (req, res) => {
    connection.query('SELECT * FROM customers', (err, results) => {
        if (err) {
            console.error('Lỗi khi truy vấn khách hàng:', err);
            return res.status(500).send('Đã xảy ra lỗi khi lấy dữ liệu khách hàng');
        }
        res.json(results);
    });
});

// Thêm khách hàng mới
router.post('/add', (req, res) => {
    const { fullname, email, password, address, phone, birthday, sex } = req.body;

    connection.query(
        'INSERT INTO customers (fullname, email, password, address, phone, birthday, sex) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [fullname, email, bcrypt.hashSync(password, 10), address, phone, birthday, sex],
        (err, result) => {
            if (err) {
                console.error('Lỗi khi thêm khách hàng:', err);
                return res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm khách hàng' });
            }
            res.status(201).json({ message: 'Thêm khách hàng thành công' });
        }
    );
});

// Cập nhật khách hàng   
router.put('/:id', (req, res) => {
    const { fullname, email, address, phone, sex, password } = req.body;
    const customerId = req.params.id;

    let query = 'UPDATE customers SET fullname = ?, email = ?, address = ?, phone = ?, sex = ? WHERE id = ?';
    const params = [fullname, email, address, phone, sex, customerId];

    if (password) {
        query = 'UPDATE customers SET fullname = ?, email = ?, address = ?, phone = ?, sex = ?, password = ? WHERE id = ?';
        params.splice(5, 0, bcrypt.hashSync(password, 10)); // Mã hóa mật khẩu trước khi lưu
    }

    connection.query(query, params, (err, result) => {
        if (err) {
            console.error('Lỗi khi cập nhật khách hàng:', err);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật khách hàng' });
        }
        res.status(200).json({ message: 'Cập nhật khách hàng thành công' });
    });
});

module.exports = router;
