// Hàm để ẩn tất cả các phần quản lý
function hideAllSections() {
    document.getElementById('product-management').style.display = 'none';
    document.getElementById('order-management').style.display = 'none';
    document.getElementById('customer-management').style.display = 'none';
    document.getElementById('employee-management').style.display = 'none';
}

// QLSP - Quản lý Sản phẩm
document.getElementById('manage-products').addEventListener('click', function () {
    hideAllSections();
    document.getElementById('product-management').style.display = 'block';
});

// QL Đơn hàng - Quản lý Đơn hàng
document.getElementById('manage-orders').addEventListener('click', function () {
    hideAllSections();
    document.getElementById('order-management').style.display = 'block';
});

// QL Khách hàng - Quản lý Khách hàng
document.getElementById('manage-customers').addEventListener('click', function () {
    hideAllSections();
    document.getElementById('customer-management').style.display = 'block';
});

// QL Nhân viên - Quản lý Nhân viên
document.getElementById('manage-employees').addEventListener('click', function () {
    hideAllSections();
    document.getElementById('employee-management').style.display = 'block';
});

// --------------------------------------------------------------------------------------------------------
// Quản lý Sản phẩm
function loadProducts() {
    fetch('/api/products')
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById('product-list');
            productList.innerHTML = '';

            data.forEach(product => {
                addProductRow(product, productList);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

document.getElementById('add-product').addEventListener('click', function () {
    const productName = prompt('Nhập tên sản phẩm:');
    const productCategory = prompt('Nhập loại sản phẩm:');
    const productUnit = prompt('Nhập đơn vị sản phẩm:');
    const productOrigin = prompt('Nhập nguồn gốc sản phẩm:');
    const productPrice = prompt('Nhập giá sản phẩm:');
    const productQuantity = prompt('Nhập số lượng sản phẩm:');
    const productDescription = prompt('Nhập mô tả sản phẩm:');
    const productImage = prompt('Nhập URL hình ảnh sản phẩm:');
    const supplierId = null; // Bỏ qua supplier_id và đặt giá trị là null

    if (productName && productCategory && productUnit && productOrigin && productPrice && productQuantity && productDescription && productImage) {
        const newProduct = {
            product_name: productName,
            picture: productImage,
            origin: productOrigin,
            unit_price: productPrice,
            unit: productUnit,
            stock: productQuantity,
            description: productDescription,
            category_id: productCategory,
            supplier_id: supplierId // Đặt supplier_id là null
        };

        fetch('/api/products/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Thêm sản phẩm thất bại');
                }

                // Kiểm tra xem kiểu nội dung có phải JSON không
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                } else {
                    return response.text(); // Nếu không phải JSON, trả về text để xử lý
                }
            })
            .then(data => {
                if (typeof data === 'object') {
                    alert('Thêm sản phẩm thành công!');
                } else {
                    alert(data); // Hiển thị chuỗi văn bản từ máy chủ
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Đã xảy ra lỗi khi thêm sản phẩm.');
            });

    } else {
        alert('Vui lòng điền đầy đủ thông tin.');
    }
    loadProducts();
});

function addProductRow(product, productList) {
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${product.id}</td>
        <td>${product.product_name}</td>
        <td>${product.category_id}</td>
        <td>${product.unit}</td>
        <td>${product.origin}</td>
        <td>${product.unit_price}</td>
        <td>${product.stock}</td>
        <td>${product.description}</td>
        <td><img src="${product.picture}" alt="${product.product_name}" style="width: 50px; height: 50px;"></td>
        <td>
            <button class="edit-product-btn">Sửa</button>
            <button class="delete-product-btn" style="display: none;">Xóa</button>
        </td>
    `;
    productList.appendChild(newRow);

    attachProductEventListeners(newRow);
}

function attachProductEventListeners(row) {
    const editBtn = row.querySelector('.edit-product-btn');
    const deleteBtn = row.querySelector('.delete-product-btn');

    editBtn.addEventListener('click', () => editProduct(row));
    deleteBtn.addEventListener('click', () => deleteProduct(row));
}

function editProduct(row) {
    const productId = row.cells[0].innerText;
    const productName = prompt('Nhập tên sản phẩm:', row.cells[1].innerText);
    const productCategory = prompt('Nhập loại sản phẩm (ID):', row.cells[2].innerText);
    const productUnit = prompt('Nhập đơn vị sản phẩm:', row.cells[3].innerText);
    const productOrigin = prompt('Nhập nguồn gốc sản phẩm:', row.cells[4].innerText);
    const productPrice = prompt('Nhập giá sản phẩm:', row.cells[5].innerText);
    const productQuantity = prompt('Nhập số lượng sản phẩm:', row.cells[6].innerText);
    const productDescription = prompt('Nhập mô tả sản phẩm:', row.cells[7].innerText);
    const productImage = prompt('Nhập URL hình ảnh sản phẩm:', row.cells[8].querySelector('img').src);

    const updatedProduct = {
        id: productId,
        product_name: productName,
        category_id: productCategory,
        unit: productUnit,
        origin: productOrigin,
        unit_price: productPrice,
        stock: productQuantity,
        description: productDescription,
        picture: productImage
    };

    fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
    })
        .then(response => response.json())
        .then(() => {
            alert('Cập nhật sản phẩm thành công!');
            loadProducts();
        })
        .catch(error => alert('Đã xảy ra lỗi khi cập nhật sản phẩm:', error));
}

function deleteProduct(row) {
    const productId = row.cells[0].innerText;

    fetch(`/api/products/${productId}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(() => {
            row.remove();
            alert('Sản phẩm đã bị xóa.');
        })
        .catch(error => alert('Đã xảy ra lỗi khi xóa sản phẩm:', error));
}

// --------------------------------------------------------------------------------------------------------
// Quản lý Đơn hàng
function loadOrders() {
    fetch('/api/orders')
        .then(response => response.json())
        .then(orders => {
            const orderList = document.getElementById('order-list');
            orderList.innerHTML = '';

            orders.forEach(order => addOrderRow(order, orderList));
        })
        .catch(error => console.error('Error fetching orders:', error));
}

function addOrderRow(order, orderList) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.customer_id}</td>
        <td>${order.total}</td>
        <td>${order.order_date}</td>
        <td><button class="view-order-btn">Xem</button></td>
    `;
    orderList.appendChild(row);
    row.querySelector('.view-order-btn').addEventListener('click', () => loadOrderDetails(order.id));
}

function loadOrderDetails(orderId) {
    fetch(`/api/orders/${orderId}/details`)
        .then(response => response.json())
        .then(details => {
            const orderDetailsTable = document.getElementById('order-details');
            orderDetailsTable.innerHTML = '';

            details.forEach(detail => addOrderDetailRow(detail, orderDetailsTable));
        })
        .catch(error => console.error('Error fetching order details:', error));
}

function addOrderDetailRow(detail, table) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${detail.order_id}</td>
        <td>${detail.product_id}</td>
        <td>${detail.quantity}</td>
        <td>${detail.price}</td>
        <td>${detail.total_amount}</td>
    `;
    table.appendChild(row);
}

// --------------------------------------------------------------------------------------------------------
// Quản lý Khách hàng
function loadCustomers() {
    fetch('/api/customers')
        .then(response => response.json())
        .then(data => {
            const customerList = document.getElementById('customer-list');
            customerList.innerHTML = '';

            data.forEach(customer => addCustomerRow(customer, customerList));
        });
}

document.getElementById('add-customer').addEventListener('click', function () {
    const fullname = prompt('Nhập họ và tên:');
    const email = prompt('Nhập email:');
    const password = prompt('Nhập mật khẩu:');
    const address = prompt('Nhập địa chỉ:');
    const phone = prompt('Nhập số điện thoại:');
    const sex = prompt('Nhập giới tính (male hoặc female):', 'male');

    if (fullname && email && password && sex) {
        const newCustomer = {
            fullname: fullname,
            email: email,
            password: password,
            address: address || null,
            phone: phone || null,
            sex: sex
        };

        fetch('/api/customers/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCustomer),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Thêm khách hàng thất bại');
                }
                return response.json();
            })
            .then(data => {
                alert('Thêm khách hàng thành công!');
                loadCustomers(); // Tải lại danh sách khách hàng
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Đã xảy ra lỗi khi thêm khách hàng.');
            });
    } else {
        alert('Vui lòng điền đầy đủ thông tin.');
    }
    loadCustomers();
});

function addCustomerRow(customer, customerList) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${customer.id}</td>
        <td>${customer.fullname}</td>
        <td>${customer.email}</td>
        <td>${customer.address || ''}</td>
        <td>${customer.phone || ''}</td>
        <td>${customer.sex || 'male'}</td>
        <td><button class="edit-customer-btn">Sửa</button></td>
    `;
    customerList.appendChild(row);
    attachCustomerEventListeners(row);
}

function attachCustomerEventListeners(row) {
    const editBtn = row.querySelector('.edit-customer-btn');
    editBtn.addEventListener('click', () => editCustomer(row));
}

function editCustomer(row) {
    const customerId = row.cells[0].innerText;
    const customerName = prompt('Nhập họ và tên khách hàng:', row.cells[1].innerText);
    const customerEmail = prompt('Nhập email khách hàng:', row.cells[2].innerText);
    const customerAddress = prompt('Nhập địa chỉ khách hàng:', row.cells[3].innerText);
    const customerPhone = prompt('Nhập số điện thoại khách hàng:', row.cells[4].innerText);
    const customerSex = prompt('Nhập giới tính khách hàng (male/female):', row.cells[5].innerText);
    const customerPassword = prompt('Nhập mật khẩu mới (để trống nếu không thay đổi):', '');

    const updatedCustomer = {
        fullname: customerName,
        email: customerEmail,
        address: customerAddress,
        phone: customerPhone,
        sex: customerSex
    };

    if (customerPassword) {
        updatedCustomer.password = customerPassword;
    }

    fetch(`/api/customers/${customerId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCustomer),
    })
        .then(response => response.json())
        .then(() => {
            loadCustomers();
            alert('Cập nhật khách hàng thành công!');
        })
        .catch(error => alert('Đã xảy ra lỗi khi cập nhật khách hàng:', error));
}

// --------------------------------------------------------------------------------------------------------
// Quản lý Nhân viên
function loadEmployees() {
    fetch('/api/employees')
        .then(response => response.json())
        .then(data => {
            const employeeList = document.getElementById('employee-list');
            employeeList.innerHTML = '';

            data.forEach(employee => addEmployeeRow(employee, employeeList));
        });
}

document.getElementById('add-employee').addEventListener('click', function () {
    const fullname = prompt('Nhập họ và tên:');
    const email = prompt('Nhập email:');
    const password = prompt('Nhập mật khẩu:');
    const address = prompt('Nhập địa chỉ:');
    const sex = prompt('Nhập giới tính (male hoặc female):', 'male');

    if (fullname && email && password && address && sex) {
        const newEmployee = {
            fullname: fullname,
            email: email,
            password: password,
            address: address,
            sex: sex,
        };

        fetch('/api/employees/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEmployee),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Thêm nhân viên thất bại');
                }
                return response.json();
            })
            .then(data => {
                alert('Thêm nhân viên thành công!');
                // Tải lại danh sách nhân viên
                loadEmployees();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Đã xảy ra lỗi khi thêm nhân viên.');
            });
    } else {
        alert('Vui lòng điền đầy đủ thông tin.');
    }
});

function addEmployeeRow(employee, employeeList) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${employee.id}</td>
        <td>${employee.fullname}</td>
        <td>${employee.email}</td>
        <td>${employee.address || ''}</td>
        <td>${employee.sex || 'male'}</td>
        <td><button class="edit-employee-btn">Sửa</button></td>
    `;
    employeeList.appendChild(row);
    attachEmployeeEventListeners(row);
}

function attachEmployeeEventListeners(row) {
    const editBtn = row.querySelector('.edit-employee-btn');
    editBtn.addEventListener('click', () => editEmployee(row));
}

function editEmployee(row) {
    const employeeId = row.cells[0].innerText;
    const employeeName = prompt('Nhập họ và tên nhân viên:', row.cells[1].innerText);
    const employeeEmail = prompt('Nhập email nhân viên:', row.cells[2].innerText);
    const employeeAddress = prompt('Nhập địa chỉ nhân viên:', row.cells[3].innerText);
    const employeeSex = prompt('Nhập giới tính nhân viên (male/female):', row.cells[4].innerText);
    const employeePassword = prompt('Nhập mật khẩu mới (để trống nếu không thay đổi):', '');

    const updatedEmployee = {
        fullname: employeeName,
        email: employeeEmail,
        address: employeeAddress,
        sex: employeeSex
    };

    if (employeePassword) {
        updatedEmployee.password = employeePassword;
    }

    fetch(`/api/employees/${employeeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmployee),
    })
        .then(response => response.json())
        .then(() => {
            loadEmployees();
            alert('Cập nhật nhân viên thành công!');
        })
        .catch(error => alert('Đã xảy ra lỗi khi cập nhật nhân viên:', error));
}

// --------------------------------------------------------------------------------------------------------
// Gọi hàm load khi trang được tải
loadProducts();
loadOrders();
loadCustomers();
loadEmployees();
