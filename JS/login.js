// document.getElementById('submit').addEventListener('click', async function (e) {
//     e.preventDefault();

//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     // Kiểm tra tính hợp lệ của dữ liệu
//     if (!email || !password) {
//         alert('Vui lòng nhập đầy đủ email và mật khẩu!');
//         return;
//     }

//     try {
//         // Gửi yêu cầu đăng nhập tới server
//         const response = await fetch('/auth/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 email,
//                 password
//             })
//         });

//         const data = await response.json();

//         if (response.ok) {
//             // Lưu email và id vào localStorage
//             localStorage.setItem('email', email);
//             localStorage.setItem('userId', data.id);

//             if (data.redirectUrl) {
//                 // Chuyển hướng đến trang admin nếu là nhân viên
//                 window.location.href = data.redirectUrl;
//             } else {
//                 // Chuyển hướng đến trang chủ nếu là khách hàng
//                 alert('Đăng nhập thành công!');
//                 window.location.href = '/';
//             }
//         } else {
//             alert(`Lỗi: ${data.message}`);
//         }
//     } catch (error) {
//         console.error('Đã xảy ra lỗi:', error);
//         alert('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.');
//     }
// });


document.getElementById('submit').addEventListener('click', async function (e) {
    e.preventDefault();

    // Lấy giá trị email và password từ các input
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Kiểm tra xem email và password đã được nhập đầy đủ chưa
    if (!email || !password) {
        alert('Vui lòng nhập đầy đủ email và mật khẩu!');
        return;
    }

    try {
        // Gửi yêu cầu đăng nhập đến server qua API
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        // Chuyển đổi phản hồi của server sang JSON
        const data = await response.json();

        // Kiểm tra nếu phản hồi từ server là thành công
        if (response.ok) {
            // Lưu email và userId vào localStorage
            localStorage.setItem('email', email);
            localStorage.setItem('userId', data.id);

            // Kiểm tra nếu có URL chuyển hướng cho admin
            if (data.redirectUrl) {
                // Chuyển hướng đến trang admin cho nhân viên (admin)
                window.location.href = data.redirectUrl;
            } else {
                // Thông báo đăng nhập thành công và chuyển hướng tới trang chủ cho khách hàng
                alert('Đăng nhập thành công!');
                window.location.href = '/';
            }
        } else {
            // Nếu đăng nhập không thành công, hiển thị thông báo lỗi từ server
            alert(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        // Xử lý nếu có lỗi xảy ra trong quá trình đăng nhập
        console.error('Đã xảy ra lỗi:', error);
        alert('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.');
    }
});
