document.getElementById('submit').addEventListener('click', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!username || !email || !password) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }

    try {
        console.log("Gửi yêu cầu đăng ký tới server...");

        // Gửi yêu cầu đăng ký tới server
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });

        console.log("Phản hồi từ server:", response);

        if (response.ok) {
            alert('Đăng ký thành công!');
            // Sử dụng window.location.href để chuyển hướng tới trang đăng nhập
            window.location.href = '/login';  // Chuyển hướng tới route /login
        } else {
            const data = await response.json();
            alert(`Lỗi: ${data.message}`);
        }

    } catch (error) {
        console.error('Đã xảy ra lỗi trong quá trình đăng ký:', error);
        alert('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.');
    }
});
