// Fetch dữ liệu từ API và thêm các phần tử <li> vào <ul id="listCategory">
fetch('/api/categories')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const listCategory = document.getElementById('listCategory');

        // Xóa nội dung hiện tại của danh sách (nếu cần)
        listCategory.innerHTML = '';

        data.forEach(category => {
            // Tạo thẻ <li>
            const listItem = document.createElement('li');

            // Tạo nút với thuộc tính data-listCategory
            const button = document.createElement('button');
            button.style.cursor = 'pointer';
            button.setAttribute('data-listCategory', category.id);
            button.textContent = category.category_name;

            // Thêm sự kiện click vào nút
            button.addEventListener('click', () => {
                filterProductsByCategory(category.id);
            });

            // Thêm nút vào thẻ <li>
            listItem.appendChild(button);

            // Thêm thẻ <li> vào <ul id="listCategory">
            listCategory.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Lỗi khi lấy dữ liệu category:', error);
    });

// Hàm lọc sản phẩm theo category
function filterProductsByCategory(categoryId) {
    const products = document.querySelectorAll('.sp');

    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');

        // Hiển thị sản phẩm nếu data-category khớp với categoryId
        if (productCategory == categoryId) {
            product.style.display = 'inline-block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Sự kiện cho nút "Xem tất cả"
document.getElementById('showAll').addEventListener('click', () => {
    const products = document.querySelectorAll('.sp');

    products.forEach(product => {
        product.style.display = 'inline-block'; // Hiển thị tất cả sản phẩm
    });
});
