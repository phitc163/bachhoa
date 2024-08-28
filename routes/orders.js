const express = require('express');
const router = express.Router();
const connection = require('../db'); // Tệp kết nối cơ sở dữ liệu

// Lấy danh sách tất cả hóa đơn
router.get('/', (req, res) => {
    connection.query('SELECT * FROM orders', (err, results) => {
        if (err) {
            console.error('Lỗi khi tải danh sách hóa đơn:', err);
            return res.status(500).send('Đã xảy ra lỗi khi tải dữ liệu hóa đơn');
        }
        res.json(results);
    });
});

// Lấy chi tiết hóa đơn dựa trên order_id
router.get('/:id/details', (req, res) => {
    const orderId = req.params.id;
    connection.query('SELECT * FROM order_details WHERE order_id = ?', [orderId], (err, results) => {
        if (err) {
            console.error('Lỗi khi tải chi tiết hóa đơn:', err);
            return res.status(500).send('Đã xảy ra lỗi khi tải chi tiết hóa đơn');
        }
        res.json(results);
    });
});

module.exports = router;
