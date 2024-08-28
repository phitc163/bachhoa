const mysql = require('mysql2');

// Kết nối cơ sở dữ liệu MySQL
const connection = mysql.createConnection({
    host: 'localhost',  // Địa chỉ host của MySQL
    user: 'root',  // Tên người dùng MySQL
    password: '#Phi135790',  // Mật khẩu MySQL của bạn
    database: 'BachHoa'  // Tên cơ sở dữ liệu MySQL
});

connection.connect(err => {
    if (err) {
        console.error('Lỗi kết nối cơ sở dữ liệu:', err);
        return;
    }
    console.log('Kết nối thành công đến cơ sở dữ liệu MySQL');
});

module.exports = connection;
