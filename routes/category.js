const express = require('express');
const router = express.Router();
const connection = require('../db'); // Tệp kết nối cơ sở dữ liệu

// Lấy danh sách tất cả danh mục
router.get('/', (req, res) => {
    connection.query('SELECT * FROM category', (err, results) => {
        if (err) {
            console.error('Lỗi khi truy vấn danh mục:', err);
            return res.status(500).send('Đã xảy ra lỗi khi lấy dữ liệu danh mục');
        }
        res.json(results);
    });
});

// Thêm danh mục mới
router.post('/add', (req, res) => {
    const { category_name } = req.body;

    connection.query(
        'INSERT INTO category (category_name) VALUES (?)',
        [category_name],
        (err, result) => {
            if (err) {
                console.error('Lỗi khi thêm danh mục:', err);
                return res.status(500).send('Đã xảy ra lỗi khi thêm danh mục');
            }
            res.status(201).send('Thêm danh mục thành công');
        }
    );
});

module.exports = router;
