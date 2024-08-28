// const express = require('express');
// const router = express.Router();
// const connection = require('../db');

// // Route để lấy thông tin người dùng theo ID
// router.get('/profile/:id', async (req, res) => {
//     const userId = req.params.id;

//     try {
//         const [rows] = await connection.promise().query('SELECT fullname, email, address, phone, sex FROM customers WHERE id = ?', [userId]);

//         if (rows.length === 0) {
//             return res.status(404).json({ message: 'Người dùng không tồn tại' });
//         }

//         const user = rows[0];
//         res.json(user);
//     } catch (error) {
//         console.error('Lỗi khi lấy thông tin người dùng:', error);
//         res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin người dùng' });
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const connection = require('../db');

// Route để lấy thông tin người dùng theo ID
router.get('/profile/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const [rows] = await connection.promise().query('SELECT fullname, email, address, phone, sex FROM customers WHERE id = ?', [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        const user = rows[0];
        res.json(user);
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin người dùng' });
    }
});

// Route để cập nhật thông tin người dùng
router.put('/profile/:id', async (req, res) => {
    const userId = req.params.id;
    const { fullname, email, address, phone, gender } = req.body;

    try {
        // Kiểm tra xem người dùng có tồn tại hay không
        const [rows] = await connection.promise().query('SELECT * FROM customers WHERE id = ?', [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        // Cập nhật thông tin người dùng
        await connection.promise().query(
            'UPDATE customers SET fullname = ?, email = ?, address = ?, phone = ?, sex = ? WHERE id = ?',
            [fullname, email, address, phone, gender, userId]
        );

        res.status(200).json({ message: 'Cập nhật hồ sơ thành công!' });
    } catch (error) {
        console.error('Lỗi khi cập nhật hồ sơ:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật hồ sơ' });
    }
});

module.exports = router;

