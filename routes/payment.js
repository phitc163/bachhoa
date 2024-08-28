// routes/payment.js
const express = require('express');
const router = express.Router();
const connection = require('../db'); // Kết nối tới DB

router.post('/confirm', (req, res) => {
    const { orderDetails, total, customer_id } = req.body;

    console.log("Order Details:", orderDetails);
    console.log("Total:", total);
    console.log("Customer ID:", customer_id);

    if (!orderDetails || !total || !customer_id) {
        return res.status(400).json({ success: false, message: 'Thiếu dữ liệu đầu vào' });
    }

    // Tạo hóa đơn (orders)
    const orderDate = new Date();
    const orderQuery = `INSERT INTO orders (order_date, total, customer_id) VALUES (?, ?, ?)`;

    connection.query(orderQuery, [orderDate, total, customer_id], (error, results) => {
        if (error) {
            console.error("Lỗi khi tạo hóa đơn:", error);
            return res.status(500).json({ success: false, message: 'Lỗi khi tạo hóa đơn' });
        }

        const orderId = results.insertId; // ID của đơn hàng vừa tạo

        // Tạo chi tiết hóa đơn (order_details)
        const orderDetailsQuery = `INSERT INTO order_details (order_id, product_id, quantity, price) VALUES ?`;
        const orderDetailsValues = orderDetails.map(item => [orderId, item.productId, item.quantity, item.price]);

        connection.query(orderDetailsQuery, [orderDetailsValues], (error, results) => {
            if (error) {
                console.error("Lỗi khi tạo chi tiết hóa đơn:", error);
                return res.status(500).json({ success: false, message: 'Lỗi khi tạo chi tiết hóa đơn' });
            }

            // Nếu thành công, trả về phản hồi
            res.json({ success: true });
        });
    });
});

module.exports = router;
