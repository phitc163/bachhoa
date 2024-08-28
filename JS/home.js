// Định dạng tiền tệ VND
function formatCurrencyVND(amount) {
    return amount.toLocaleString('vi-VN').replace('₫', '').trim() + ' VNĐ';
}

// Hiển thị chi tiết sản phẩm trong modal
function showProductDetail(product) {
    const modal = document.getElementById('productDetailModal');
    document.getElementById('modalProductName').textContent = product.product_name;
    document.getElementById('modalProductImage').src = product.picture;
    document.getElementById('modalProductPrice').textContent = formatCurrencyVND(product.unit_price);
    // document.getElementById('modalProductType').textContent = product.category;
    document.getElementById('modalProductUnit').textContent = product.unit;
    document.getElementById('modalProductOrigin').textContent = product.origin;
    // document.getElementById('modalProductQuantity').textContent = product.stock;
    document.getElementById('modalProductDescription').textContent = product.description;
    modal.style.display = 'block';
}

// Đóng modal
function closeProductDetail() {
    const modal = document.getElementById('productDetailModal');
    modal.style.display = 'none';
}

// Đóng modal khi người dùng nhấp ra ngoài khu vực modal
window.onclick = function (event) {
    const modal = document.getElementById('productDetailModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Fetch dữ liệu từ server và chèn vào div với class "content"
fetch('/api/products')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const contentDiv = document.querySelector('.content');
        data.forEach(product => {
            // Tạo thẻ div chứa thông tin sản phẩm và thêm thuộc tính data-category
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
            contentDiv.appendChild(productDiv);
        });

        // Thêm sự kiện click cho các nút thêm vào giỏ hàng
        var addCartBtn = document.getElementsByClassName("addbtn");
        for (var i = 0; i < addCartBtn.length; i++) {
            var btn = addCartBtn[i];
            btn.addEventListener("click", addCartClicked);
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });


// Thêm sản phẩm vào giỏ hàng
function addCartClicked(event) {
    var btn = event.target;
    var item = btn.parentElement.parentElement;
    var name = item.getElementsByClassName("sp-name")[0].innerText;
    var price = item.getElementsByClassName("price")[0].innerText;
    var img = item.getElementsByClassName("sp-img")[0].src;
    addItemToCart(name, price, img);
    updateCart();
}

function addItemToCart(name, price, img) {
    var cartRow = document.createElement("div");
    var cartRowContent = `
    <div class="item">
        <div class="imn item-col">
            <img src="${img}">
            <span class="item-name">${name}</span>
        </div>
        <span class="price item-col">${price}</span>
        <div class="item-col">
            <input class="quanti" type="number" value="1">
            <button class="delbtn">Xóa</button>
        </div>
    </div>`;
    cartRow.innerHTML = cartRowContent;
    var items = document.getElementsByClassName("items")[0];
    var itemNames = items.getElementsByClassName("item-name");
    for (var i = 0; i < itemNames.length; i++) {
        if (itemNames[i].innerText === name) {
            alert("Vật phẩm này đã có trong giỏ hàng.");
            return;
        }
    }
    items.append(cartRow);

    // Thêm sự kiện click cho nút xóa và thay đổi số lượng
    cartRow.getElementsByClassName("delbtn")[0].addEventListener("click", removeCartItem);
    cartRow.getElementsByClassName("quanti")[0].addEventListener("change", quantiChanged);
}

function removeCartItem(event) {
    var btnRemove = event.target;
    btnRemove.parentElement.parentElement.remove();
    updateCart();
}

function quantiChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCart();
}

function updateCart() {
    var itemContainer = document.getElementsByClassName("items")[0];
    var cartRows = itemContainer.getElementsByClassName("item");
    var total = 0;
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceEl = cartRow.getElementsByClassName("price")[0];
        var quantiEl = cartRow.getElementsByClassName("quanti")[0];
        var price = parseFloat(priceEl.innerText.replace(".000 VNĐ", ""));
        var quanti = quantiEl.value;
        total += price * quanti;
    }
    document.getElementsByClassName("total-price")[0].innerText = total + ".000 VNĐ";
}
