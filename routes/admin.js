const express = require('express');
const router = express.Router();
const path = require('path');

// Route cho trang admin
router.get('/', (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        res.sendFile(path.join(__dirname, '../admin.html')); // Đảm bảo đường dẫn tới admin.html là chính xác
    } else {
        res.redirect('/login'); // Nếu không phải admin, chuyển hướng đến trang đăng nhập
    }
});

module.exports = router;
