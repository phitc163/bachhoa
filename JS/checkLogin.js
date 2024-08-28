// Gửi yêu cầu kiểm tra trạng thái đăng nhập tới server
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/auth/check', {  // Sử dụng đúng đường dẫn
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        const btnDangNhap = document.getElementById('btnDangNhap');
        const btnProfile = document.getElementById('btnProfile');
        const btnCart = document.getElementById('btnCart');
        const btnElements = document.getElementsByClassName('btn'); // Lấy tất cả phần tử có class "btn"

        // Kiểm tra trạng thái đăng nhập
        if (data.loggedIn) {
            // Khi đã đăng nhập, ẩn nút đăng nhập và hiển thị nút profile và giỏ hàng
            if (btnDangNhap) btnDangNhap.style.display = 'none';
            if (btnProfile) btnProfile.style.display = 'block';
            if (btnCart) btnCart.style.display = 'block';

            // Hiển thị tất cả các nút có class "btn"
            for (let i = 0; i < btnElements.length; i++) {
                btnElements[i].style.display = 'block';
            }

            console.log("email: ", localStorage.getItem('email'))
            console.log("email: ", localStorage.getItem('userId'))
            const userId = localStorage.getItem('userId');

            if (userId) {
                // Gửi yêu cầu đến server để lấy thông tin người dùng dựa trên userId
                fetch(`/user/profile/${userId}`)
                    .then(response => response.json())
                    .then(data => {
                        // Điền thông tin người dùng vào mẫu
                        document.getElementById('fullname').value = data.fullname;
                        document.getElementById('email').value = data.email;
                        document.getElementById('address').value = data.address;
                        document.getElementById('phone').value = data.phone;
                        document.getElementById('gender').value = data.sex;
                    })
                    .catch(error => console.error('Lỗi khi tải thông tin hồ sơ:', error));
            }

        } else {
            // Khi chưa đăng nhập, hiển thị nút đăng nhập và ẩn nút profile và giỏ hàng
            localStorage.clear();
            if (btnDangNhap) btnDangNhap.style.display = 'block';
            if (btnProfile) btnProfile.style.display = 'none';
            if (btnCart) btnCart.style.display = 'none';

            // Ẩn tất cả các nút có class "btn"
            for (let i = 0; i < btnElements.length; i++) {
                btnElements[i].style.display = 'none';
            }
        }

    } catch (error) {
        console.error('Đã xảy ra lỗi khi kiểm tra trạng thái đăng nhập:', error);
    }
});

document.getElementById('btnDangXuat').addEventListener('click', async function () {
    try {
        const response = await fetch('/auth/logout', {
            method: 'GET',
        });

        if (response.ok) {
            alert('Đăng xuất thành công!');
            localStorage.clear();
            // Sau khi đăng xuất, chuyển hướng người dùng về trang đăng nhập
            window.location.href = '/login';
        } else {
            alert('Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại.');
        }
    } catch (error) {
        console.error('Lỗi khi đăng xuất:', error);
        alert('Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại sau.');
    }
});
