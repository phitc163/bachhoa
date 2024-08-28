if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  var removeItem = document.getElementsByClassName("delbtn");
  for (var i = 0; i < removeItem.length; i++) {
    var btn = removeItem[i];
    btn.addEventListener("click", removeCartItem);
  }

  var quantiInp = document.getElementsByClassName("quanti");
  for (var i = 0; i < quantiInp.length; i++) {
    var inp = quantiInp[i];
    inp.addEventListener("change", quantiChanged);
  }

  var addCartBtn = document.getElementsByClassName("addbtn");
  for (var i = 0; i < addCartBtn.length; i++) {
    var btn = addCartBtn[i];
    btn.addEventListener("click", addCartClicked);
  }
}

function addCartClicked(event) {
  var btn = event.target;
  var item = btn.parentElement.parentElement;

  // Lấy thông tin sản phẩm từ HTML, bao gồm các thuộc tính data-set
  var name = item.getElementsByClassName("sp-name")[0].innerText;
  var img = item.getElementsByClassName("sp-img")[0].src;
  var productId = item.getAttribute('id'); // Lấy ID sản phẩm từ thuộc tính id
  var price = item.dataset.price; // Lấy giá từ data-price
  var category = item.dataset.category; // Lấy danh mục từ data-category

  // Thêm sản phẩm vào giỏ hàng
  addItem(name, price, img, productId, category);
  updateCart();
}

function addItem(name, price, img, productId, category) {
  // First, fetch the additional product data from the server
  fetchProductDataAndAddToContentDiv(productId);

  // Continue with the existing logic to add the item to the cart
  var cartRow = document.createElement("div");

  var carRowContent = `
    <div class="item" data-productid="${productId}" data-price="${price}" data-category="${category}" data-quantity="1">
      <div class="imn item-col">
        <img src="${img}">
        <span class="item-name">${name}</span>
      </div>
      <span class="price item-col">${formatCurrencyVND(price)}</span>
      <div class="item-col">
        <input class="quanti" type="number" value="1">
        <button class="delbtn">Xóa</button>
      </div>
    </div>`;

  cartRow.innerHTML = carRowContent;
  console.log("cartRow: ", cartRow);

  // Check if the product is already in the cart
  var items = document.getElementsByClassName("items")[0];
  var itemName = items.getElementsByClassName("item-name");
  for (var i = 0; i < itemName.length; i++) {
    if (itemName[i].innerText === name) {
      alert("Vật phẩm này đã có trong giỏ hàng.");
      return;
    }
  }

  // Add the product to the cart
  items.append(cartRow);

  // Add event listeners for removing the item and changing the quantity
  cartRow
    .getElementsByClassName("delbtn")[0]
    .addEventListener("click", removeCartItem);
  cartRow
    .getElementsByClassName("quanti")[0]
    .addEventListener("change", quantiChanged);
}

// Fetch data and add the result to contentDiv
async function fetchProductDataAndAddToContentDiv(baseProductId) {
    try {
        // Fetch data from the server
        const response = await fetch(`/api/products/getProductId/${baseProductId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Get the contentDiv
        const contentDiv = document.querySelector('.content');
        
        // Create a new div to hold the fetched product info
        const newContent = document.createElement('div');
        
        // Loop through the fetched products and add them to the newContent div
        data.tempProductInfo.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('sp');
            productDiv.setAttribute('id', `${product.id}`);
            productDiv.setAttribute('data-category', product.category_id); // Thêm data-category với giá trị category_id
            productDiv.setAttribute('data-price', `${product.unit_price}`);


            // Tạo và thêm hình ảnh sản phẩm
            const img = document.createElement('img');
            img.src = product.picture;
            img.classList.add('sp-img');
            productDiv.appendChild(img);

            // Tạo và thêm tên sản phẩm
            const nameP = document.createElement('p');
            nameP.classList.add('sp-name');
            nameP.textContent = product.product_name;
            productDiv.appendChild(nameP);

            // Tạo và thêm giá sản phẩm
            const priceP = document.createElement('p');
            priceP.classList.add('price');
            priceP.textContent = `${formatCurrencyVND(product.unit_price)}`;
            productDiv.appendChild(priceP);

            // Tạo và thêm chi tiết sản phẩm
            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add('details');
            detailsDiv.style.display = 'none';

            const categoryP = document.createElement('p');
            categoryP.classList.add('category');
            categoryP.textContent = `Loại: ${product.category}`;
            detailsDiv.appendChild(categoryP);

            const unitP = document.createElement('p');
            unitP.classList.add('unit');
            unitP.textContent = `Đơn vị: ${product.unit}`;
            detailsDiv.appendChild(unitP);

            const originP = document.createElement('p');
            originP.classList.add('origin');
            originP.textContent = `Xuất xứ: ${product.origin}`;
            detailsDiv.appendChild(originP);

            const quantityP = document.createElement('p');
            quantityP.classList.add('quantity');
            quantityP.textContent = `Số lượng: ${product.stock}`;
            detailsDiv.appendChild(quantityP);

            const descriptionP = document.createElement('p');
            descriptionP.classList.add('description');
            descriptionP.textContent = product.description;
            detailsDiv.appendChild(descriptionP);

            productDiv.appendChild(detailsDiv);

            // Thêm sự kiện click để hiển thị chi tiết sản phẩm trong modal
            img.addEventListener('click', () => {
                showProductDetail(product);
            });

            // Tạo và thêm nút thêm vào giỏ hàng
            const btnP = document.createElement('p');
            btnP.classList.add('btn');

            const addButton = document.createElement('button');
            addButton.classList.add('addbtn');
            addButton.textContent = 'Thêm Vào Giỏ Hàng';
            btnP.appendChild(addButton);

            productDiv.appendChild(btnP);

            // Thêm sản phẩm vào contentDiv
            newContent.appendChild(productDiv);
        });
        // Thêm sự kiện click cho các nút thêm vào giỏ hàng
        var addCartBtn = document.getElementsByClassName("addbtn");
        for (var i = 0; i < addCartBtn.length; i++) {
            var btn = addCartBtn[i];
            btn.addEventListener("click", addCartClicked);
        }
        // Insert the newContent div at the head of the old content
        contentDiv.prepend(newContent);
        console.log(contentDiv)
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}

function removeCartItem(event) {
  var btn_remove = event.target;
  btn_remove.parentElement.parentElement.remove();
  updateCart();
}

function quantiChanged(event) {
  var inp = event.target;
  if (isNaN(inp.value) || inp.value <= 0) {
    inp.value = 1;
  }
  updateCart();
}

function updateCart() {
  var itemContainer = document.getElementsByClassName("items")[0];
  var cartRows = itemContainer.getElementsByClassName("item");
  var total = 0;

  // Lặp qua các sản phẩm trong giỏ hàng để tính tổng
  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];

    // Lấy giá từ data-price
    var price = parseInt(cartRow.dataset.price); // Lấy giá từ data-price

    // Lấy số lượng từ input
    var quantityElement = cartRow.getElementsByClassName("quanti")[0];
    var quantity = parseInt(quantityElement.value);
    cartRow.setAttribute("data-quantity", quantity)
    // Cập nhật tổng giá trị
    total += price * quantity;
  }

  // Hiển thị tổng giá trị đã được định dạng
  document.getElementsByClassName("total-price")[0].innerText = formatCurrencyVND(total);
  document.getElementsByClassName("total-price")[0].setAttribute('data-amount', total);
  calculateTotal(); // Cập nhật tổng cộng khi cập nhật giỏ hàng
}

// Hàm định dạng tiền tệ VND
function formatCurrencyVND(amount) {
  return amount.toLocaleString('vi-VN').replace('₫', '').trim() + ' VNĐ';
}


// display basket
function display() {
  var modal = document.getElementById("basket");
  modal.style.display = "block";
}

// close basket
function close_m() {
  var modal = document.getElementById("basket");
  modal.style.display = "none";
}

// Thanh toan
document.querySelector('.ord').addEventListener('click', function () {
  document.getElementById('checkoutModal').style.display = 'block';
  displayProductList();
  calculateTotal();
});

function closeCheckout() {
  document.getElementById('checkoutModal').style.display = 'none';
}

// Hiển thị sản phẩm thanh toán
function displayProductList() {
  // Lấy danh sách sản phẩm trong giỏ hàng và hiển thị trong modal
  var productList = ''; // Sử dụng biến này để tạo danh sách sản phẩm
  var items = document.querySelectorAll('.item'); // Lấy tất cả các sản phẩm trong giỏ hàng

  items.forEach(function (item) {
    // Lấy thông tin từ data attributes
    var name = item.querySelector('.item-name').innerText; // Tên sản phẩm
    var quantity = item.querySelector('input').value; // Số lượng sản phẩm
    var price = item.dataset.price; // Giá sản phẩm từ data-price
    var productID = item.dataset.productId; // ID sản phẩm từ data-product-id

    // Tạo dòng sản phẩm với thông tin từ data attributes
    productList += `
      <p data-name="${name}" data-quantity="${quantity}" data-price="${price}" data-proID="${productID}">
        ${name} x ${quantity} - ${formatCurrencyVND(price * quantity)}
      </p>
    `;
  });

  // Gắn danh sách sản phẩm vào modal thanh toán
  document.getElementById('productList').innerHTML = productList;
}

document.querySelector('.ord').addEventListener('click', function () {
  document.getElementById('checkoutModal').style.display = 'block';
  displayProductList();
  calculateTotal(); // Tính tổng lại sau khi hiển thị modal thanh toán
});

function calculateTotal() {
  document.getElementById("totalAfterDiscount").innerHTML = document.getElementById("totalPrice").innerHTML;
  document.getElementById("totalAfterDiscount").setAttribute("data-total", document.getElementById("totalPrice").dataset.amount);
}

function confirmPayment() {
  // Lấy thông tin giỏ hàng từ DOM
  const totalAfterDiscount = document.getElementById('totalAfterDiscount').dataset.total;

  const customer_id = localStorage.getItem('userId');;  // Thay đổi ID khách hàng phù hợp
  const products = [];
  const items = document.querySelectorAll('.item');

  // Duyệt qua từng phần tử item trong giỏ hàng
  items.forEach(item => {
    // Lấy các thuộc tính dữ liệu từ phần tử
    const productId = parseInt(item.getAttribute('data-productid'));
    const price = parseFloat(item.getAttribute('data-price'));
    const quantity = parseInt(item.getAttribute('data-quantity'));

    // Đẩy dữ liệu vào mảng products
    products.push({
      productId: productId,
      price: price,
      quantity: quantity
    });
  });

  console.log("products: ", products);

  // Gửi yêu cầu thanh toán tới server
  fetch('/payment/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      orderDetails: products,
      total: totalAfterDiscount,
      customer_id: customer_id
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log("Response from server:", data);
      if (data.success) {
        // Hiển thị thông báo xác nhận
        alert("Cảm ơn bạn đã thanh toán đơn hàng!");

        var itemsContainer = document.getElementsByClassName("items")[0];
        while (itemsContainer.hasChildNodes()) {
          itemsContainer.removeChild(itemsContainer.firstChild);
        }

        // Reset thông tin thanh toán
        document.getElementById('totalAfterDiscount').innerText = '0.000 VNĐ';

        // Đóng modal thanh toán
        closeCheckout();

        // Cập nhật lại giỏ hàng và tổng cộng
        updateCart();
      } else {
        alert("Đã có lỗi xảy ra trong quá trình thanh toán: " + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert("Thanh toán thất bại.");
    });
}

function resetCart() {
  // Xóa tất cả các sản phẩm trong giỏ hàng
  const cartItemsContainer = document.querySelector('.items');
  cartItemsContainer.innerHTML = ''; // Xóa tất cả các sản phẩm trong giỏ hàng

  // Đặt lại tổng giá về 0
  const totalPriceElement = document.querySelector('.total-price');
  totalPriceElement.textContent = '0.000 VNĐ';

  // Reset lại các thông tin khác nếu cần thiết
  // Ví dụ: Đặt lại số lượng sản phẩm trong giỏ về 0
}

function resetCheckout() {
  // Reset giá trị của các trường trong phần thanh toán
  document.getElementById('totalAfterDiscount').innerText = '0.000 VNĐ';

  // Xóa các sản phẩm trong giỏ hàng
  resetCart(); // Xóa giỏ hàng

  // Cập nhật lại tổng giá trị giỏ hàng
  updateCart();
}
// Mở modal
function openProfile() {
  document.getElementById("profileModal").style.display = "block";
}

// Đóng modal
function closeProfile() {
  document.getElementById("profileModal").style.display = "none";
}

// Lưu thông tin hồ sơ (giả sử lưu vào localStorage hoặc gửi lên server)
// function saveProfile() {
//   const fullname = document.getElementById("fullname").value;
//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;
//   const address = document.getElementById("address").value;
//   const phone = document.getElementById("phone").value;
//   const birthday = document.getElementById("birthday").value;
//   const gender = document.getElementById("gender").value;

//   // Giả lập lưu thông tin vào localStorage
//   localStorage.setItem("fullname", fullname);
//   localStorage.setItem("email", email);
//   localStorage.setItem("password", password);
//   localStorage.setItem("address", address);
//   localStorage.setItem("phone", phone);
//   localStorage.setItem("birthday", birthday);
//   localStorage.setItem("gender", gender);

//   // Thông báo đã lưu
//   alert("Hồ sơ của bạn đã được cập nhật!");
//   closeProfile();
// }

// async function saveProfile() {
//   const fullname = document.getElementById('fullname').value || null;
//   const email = document.getElementById('email').value || null;
//   const address = document.getElementById('address').value || null;
//   const phone = document.getElementById('phone').value || null;
//   const gender = document.getElementById('gender').value || null;

//   // Lấy userId từ localStorage sau khi đăng nhập
//   const userId = localStorage.getItem('userId');

//   if (!userId) {
//     alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
//     return;
//   }

//   try {
//     // Gửi yêu cầu cập nhật thông tin người dùng đến server
//     const response = await fetch(`/user/profile/${userId}`, {
//       method: 'PUT', // Sử dụng phương thức PUT cho việc cập nhật
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         fullname,
//         email,
//         address,
//         phone,
//         gender
//       })
//     });

//     const data = await response.json();

//     if (response.ok) {
//       alert('Cập nhật hồ sơ thành công!');
//       // Bạn có thể thêm logic để cập nhật giao diện hoặc đóng modal ở đây
//     } else {
//       alert(`Lỗi: ${data.message}`);
//     }
//   } catch (error) {
//     console.error('Đã xảy ra lỗi:', error);
//     alert('Đã xảy ra lỗi khi cập nhật hồ sơ. Vui lòng thử lại sau.');
//   }
// }

async function saveProfile() {
  const fullname = document.getElementById('fullname').value || null;
  const email = document.getElementById('email').value || null;
  const address = document.getElementById('address').value || null;
  const phone = document.getElementById('phone').value || null;
  const gender = document.getElementById('gender').value || null;

  // Lấy userId từ localStorage sau khi đăng nhập
  const userId = localStorage.getItem('userId');

  if (!userId) {
    alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
    return;
  }

  try {
    // Gửi yêu cầu cập nhật thông tin người dùng đến server
    const response = await fetch(`/user/profile/${userId}`, {
      method: 'PUT', // Sử dụng phương thức PUT cho việc cập nhật
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullname,
        email,
        address,
        phone,
        gender
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Cập nhật hồ sơ thành công!');
      // Bạn có thể thêm logic để cập nhật giao diện hoặc đóng modal ở đây
    } else {
      alert(`Lỗi: ${data.message}`);
    }
  } catch (error) {
    console.error('Đã xảy ra lỗi:', error);
    alert('Đã xảy ra lỗi khi cập nhật hồ sơ. Vui lòng thử lại sau.');
  }
}
