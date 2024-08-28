const bcrypt = require('bcrypt');
const mysql = require('mysql2');

// Kết nối tới cơ sở dữ liệu
// Kết nối cơ sở dữ liệu MySQL
const connection = mysql.createConnection({
    host: 'localhost',  // Địa chỉ host của MySQL
    user: 'root',  // Tên người dùng MySQL
    password: '********',  // Mật khẩu MySQL của bạn
    database: 'BachHoa'  // Tên cơ sở dữ liệu MySQL
});


// Mã hóa mật khẩu
const plainPassword = '123';

bcrypt.hash(plainPassword, 10, (err, hash) => {
    if (err) {
        console.error('Lỗi khi mã hóa mật khẩu:', err);
        return;
    }

    // Lưu mật khẩu đã mã hóa vào cơ sở dữ liệu
    const sql = `INSERT INTO employees (fullname, sex, birthday, address, email, password) 
                 VALUES ('123', 'male', '2003-06-01', 'Binh Hung - Binh Chanh - Ho Chi Minh', '123@gmail.com', ?)`;
    connection.query(sql, [hash], (error, results) => {
        if (error) {
            console.error('Lỗi khi lưu mật khẩu vào cơ sở dữ liệu:', error);
        } else {
            console.log('Mật khẩu đã được mã hóa và lưu thành công!');
        }
    });
});
