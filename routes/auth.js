const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const connection = require('../db'); // Tệp kết nối cơ sở dữ liệu

// Đăng ký người dùng
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Kiểm tra email đã tồn tại chưa
        const [rows] = await connection.promise().query('SELECT * FROM customers WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Thêm người dùng mới vào cơ sở dữ liệu
        await connection.promise().query(
            'INSERT INTO customers (fullname, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        // Log sau khi thêm thành công vào cơ sở dữ liệu
        console.log("Đăng ký thành công cho người dùng:", username);

        // Trả về phản hồi thành công
        res.status(201).json({ message: 'Đăng ký thành công!' });

    } catch (error) {
        console.error('Lỗi khi đăng ký:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng ký' });
    }
});

// // Route xử lý đăng nhập người dùng
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // Tìm người dùng theo email
//         const [rows] = await connection.promise().query('SELECT * FROM customers WHERE email = ?', [email]);

//         if (rows.length === 0) {
//             return res.status(400).json({ message: 'Email không tồn tại' });
//         }

//         const user = rows[0];

//         // Kiểm tra mật khẩu
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Mật khẩu không chính xác' });
//         }

//         // Đăng nhập thành công - lưu thông tin vào session
//         req.session.user = { id: user.id, email: user.email };

//         // Trả về phản hồi thành công và bao gồm id của người dùng
//         res.status(200).json({ message: 'Đăng nhập thành công!', id: user.id });

//     } catch (error) {
//         console.error('Lỗi khi đăng nhập:', error);
//         res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng nhập' });
//     }
// });

// Route xử lý đăng nhập người dùng
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Tìm người dùng trong bảng customers trước
        const [customerRows] = await connection.promise().query('SELECT * FROM customers WHERE email = ?', [email]);

        if (customerRows.length > 0) {
            const customer = customerRows[0];

            // Kiểm tra mật khẩu
            const isMatch = await bcrypt.compare(password, customer.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Mật khẩu không chính xác' });
            }

            // Đăng nhập thành công - lưu thông tin vào session
            req.session.user = { id: customer.id, email: customer.email };

            // Trả về phản hồi thành công và bao gồm id của người dùng
            return res.status(200).json({ message: 'Đăng nhập thành công!', id: customer.id });
        }

        // Nếu không tìm thấy trong bảng customers, kiểm tra trong bảng employees
        const [employeeRows] = await connection.promise().query('SELECT * FROM employees WHERE email = ?', [email]);

        if (employeeRows.length === 0) {
            return res.status(400).json({ message: 'Email không tồn tại trong hệ thống' });
        }

        const employee = employeeRows[0];

        // Kiểm tra mật khẩu của employee
        const isEmployeeMatch = await bcrypt.compare(password, employee.password);
        if (!isEmployeeMatch) {
            return res.status(400).json({ message: 'Mật khẩu không chính xác' });
        }

        // Đăng nhập thành công cho employee - lưu thông tin vào session
        req.session.user = { id: employee.id, email: employee.email, role: 'admin' };

        // Trả về phản hồi thành công và chuyển hướng đến trang admin
        return res.status(200).json({ message: 'Đăng nhập admin thành công!', redirectUrl: '/admin' });

    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng nhập' });
    }
});



// Route kiểm tra trạng thái đăng nhập
router.get('/check', (req, res) => {
    if (req.session.user) {
        // Trả về thông tin nếu người dùng đã đăng nhập
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        // Trả về thông tin nếu người dùng chưa đăng nhập
        res.json({ loggedIn: false });
    }
});

// Route xử lý đăng xuất
router.get('/logout', (req, res) => {
    // Hủy session đăng nhập
    req.session.destroy((err) => {
        if (err) {
            console.error('Lỗi khi đăng xuất:', err);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng xuất' });
        }
        // Chuyển hướng người dùng về trang đăng nhập hoặc trang chủ
        res.clearCookie('connect.sid'); // Xóa cookie session nếu cần
        res.redirect('/login'); // Chuyển hướng về trang đăng nhập
    });
});


module.exports = router;
