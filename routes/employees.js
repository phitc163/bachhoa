const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../db'); // Tệp kết nối cơ sở dữ liệu

// Lấy danh sách nhân viên
router.get('/', (req, res) => {
    connection.query('SELECT id, fullname, email, address, sex FROM employees', (err, results) => {
        if (err) {
            console.error('Lỗi khi truy vấn nhân viên:', err);
            return res.status(500).send('Đã xảy ra lỗi khi lấy dữ liệu nhân viên');
        }
        res.json(results);
    });
});

// Thêm nhân viên mới
// Thêm nhân viên mới
router.post('/add', (req, res) => {
    const { fullname, email, password, address, sex } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!fullname || !email || !password || !address || !sex) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin nhân viên.' });
    }

    // Mã hóa mật khẩu trước khi lưu
    const hashedPassword = bcrypt.hashSync(password, 10);

    connection.query(
        'INSERT INTO employees (fullname, email, password, address, sex) VALUES (?, ?, ?, ?, ?)',
        [fullname, email, hashedPassword, address, sex],
        (err, result) => {
            if (err) {
                console.error('Lỗi khi thêm nhân viên:', err);
                return res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm nhân viên.' });
            }
            res.status(201).json({ message: 'Thêm nhân viên thành công!' });
        }
    );
});

// Cập nhật thông tin nhân viên
router.put('/:id', (req, res) => {
    const { fullname, email, address, sex, password } = req.body;
    const employeeId = req.params.id;

    let query = 'UPDATE employees SET fullname = ?, email = ?, address = ?, sex = ? WHERE id = ?';
    const params = [fullname, email, address, sex, employeeId];

    if (password) {
        query = 'UPDATE employees SET fullname = ?, email = ?, address = ?, sex = ?, password = ? WHERE id = ?';
        params.splice(4, 0, bcrypt.hashSync(password, 10)); // Mã hóa mật khẩu
    }

    connection.query(query, params, (err, result) => {
        if (err) {
            console.error('Lỗi khi cập nhật nhân viên:', err);
            return res.status(500).send('Đã xảy ra lỗi khi cập nhật nhân viên');
        }
        res.status(200).json({ message: 'Cập nhật nhân viên thành công!' });
    });
});

module.exports = router;
