drop database bachhoa;

CREATE DATABASE BachHoa;
USE BachHoa;

-- Table: category
CREATE TABLE category (
  id INT(11) NOT NULL AUTO_INCREMENT,
  category_name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Inserting data into category
INSERT INTO category (category_name) VALUES
('Thịt'),
('Hải sản'),
('Cá'),
('Rau củ'),
('Gia vị');

-- Table: customers
CREATE TABLE customers (
  id INT(11) NOT NULL AUTO_INCREMENT,
  fullname VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(250) DEFAULT NULL,
  phone VARCHAR(15) DEFAULT NULL,
  birthday DATE DEFAULT NULL,
  sex ENUM('male', 'female') DEFAULT 'male',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Inserting data into customers
INSERT INTO customers (fullname, email, password, address, phone, birthday, sex) VALUES
('Dương Đình Nghĩa', 'nghia15121991@gmail.com', 'hashed_password', 'Thạch Kim, Lộc Hà, Hà Tĩnh', '0927645448', '1991-12-15', 'male'),
('Dương Đình Tài', 'nghia28121995@gmail.com', 'hashed_password', 'Thạch Kim, Lộc Hà, Hà Tĩnh', '0927645448', '1995-12-28', 'male'),
('Dương Thị Xuân', 'nghia14051994@gmail.com', 'hashed_password', 'Mỹ Khánh, Long Xuyên, An Giang', '01678780208', '1994-05-14', 'female'),
('Nguyễn Văn Phước', 'vanphuoc@gmail.com', 'hashed_password', '134/1/15 Cách mạng T8, Phường 10, Quận 3, Tp. Hồ Chí Minh', NULL, NULL, 'male'),
('Nguyễn Ngọc Hà Trân', 'hatran2018@gmail.com', 'hashed_password', '24 Đường số 1, Phường Bình Trị Đông, quận Bình Thạnh, TP.HCM', NULL, NULL, 'female');

-- Table: employees
CREATE TABLE employees (
  id INT(11) NOT NULL AUTO_INCREMENT,
  fullname VARCHAR(100) NOT NULL,
  sex ENUM('male', 'female') DEFAULT NULL,
  birthday DATE DEFAULT NULL,
  address VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Inserting data into employees
INSERT INTO employees (fullname, sex, birthday, address, email, password) VALUES
('Ta Cong Phi', 'male', '2003-06-01', 'Binh Hung - Binh Chanh - Ho Chi Minh', 'tacongphi1@gmail.com', 'hashed_password'),
('Duong Lam Khang', 'male', '2004-01-06', 'Phuong 5 - Quan 10 - Ho Chi Minh', 'duonglamkhang@gmail.com', 'hashed_password');

select * from employees;
-- Table: supplier
CREATE TABLE supplier (
  id INT(11) NOT NULL AUTO_INCREMENT,
  supplier_name VARCHAR(100) NOT NULL,
  supplier_phone VARCHAR(15) NOT NULL,
  supplier_address VARCHAR(200) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Inserting data into supplier
INSERT INTO supplier (supplier_name, supplier_phone, supplier_address) VALUES
('Công ty TNHH Quốc Tuấn', '0903787904', '8, Trần Văn Quang, Phường 10, Quận Tân Bình, TP.HCM'),
('Công ty Hải Sản Vinagrico', '02854280009', '32 Đường 14E , KDC Vĩnh Lộc, P.Bình Hưng Hòa, Q.Tân Bình, Tp.HCM'),
('Công ty thực phẩm Khang Nam', '02633679379', 'Thôn Phú Hưng, Xã Phú Hội, Huyện Đức Trọng, tỉnh Lâm Đồng'),
('Công ty cổ phần chế biến thực phầm Thành Công', '02733834616', 'Km1977 Quốc Lộ 1, Xã Long Định, Huyện Châu Thành, Tiền Giang'),
('Công ty TNHH Hạnh Phúc', '02633970586', 'Thôn Đa Thọ, X. Xuân Thọ, Đà Lạt, Lâm Đồng , Việt Nam');
-- Table: products
CREATE TABLE products (
  id INT(11) NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  picture VARCHAR(100) DEFAULT NULL,
  origin VARCHAR(100) NOT NULL,
  unit_price INT(11) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  stock FLOAT DEFAULT NULL,
  supplier_id INT(11) DEFAULT NULL,
  description TEXT NOT NULL,
  category_id INT(11) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_products_supplier FOREIGN KEY (supplier_id) REFERENCES supplier (id),
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES category (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Inserting data into products
INSERT INTO products (product_name, picture, origin, unit_price, unit, stock, supplier_id, description, category_id) VALUES
( 'Ba rọi heo', 'Images/Products/ba-roi-heo.jpg', 'Long An', 31800, '300g', 30, 1, 'Nướng sả ớt, kho tàu, rim mắm tỏi, chiên giòn, cuốn rau sống, xào chua ngọt, nấu canh chua, hấp bia, om nấm, sốt me.', 1),
( 'Xương đuôi heo ', 'Images/Products/xuong-duoi-heo.jpg', 'Tiền Giang', 42000, '400g', 20, 1, 'Hầm măng, hầm củ sen, hầm đậu xanh, nấu canh chua, kho tiêu, nướng muối ớt, rim mắm, nấu bún riêu, hầm bí đỏ, kho gừng.', 1),
( 'Thịt đùi heo', 'Images/Products/thit-dui-heo.jpg', 'Long An', 56500, '400g', 20, 1, 'Luộc chấm mắm nêm, quay, kho tiêu, rang muối, sốt cà chua, chiên xù, xào hành tây, hầm nấm, rim mắm, nướng BBQ', 1),
( 'Thịt heo xay', 'Images/Products/thit-heo-xay.jpg', 'Long An', 58000, '400g', 14, 1, 'Viên chiên, làm chả giò, làm nem chua, làm xúc xích, xào cà chua, làm bánh bao, làm bánh cuốn, làm nem nướng, nấu bún riêu, làm chả lụa.', 1),
( 'Thịt bò xay', 'Images/Products/thit-bo-xay.jpg', 'Đồng Nai', 65000, '250g', 15, 1, 'Viên chiên, làm bò lúc lắc, làm bánh mì bò băm, làm chả bò, xào hành tây, nấu mì ý, làm nem nướng, làm bánh bao, làm bánh cuốn, xào nấm.', 1),
( 'Thịt nạc bò', 'Images/Products/thit-nac-bo.jpg', 'Tiền Giang', 99000, '250g', 5, 1, 'Xào rau củ, nướng, xào hành tây, xào ớt chuông, xào nấm, xào cần tây, xào bông cải xanh, xào đậu que, xào súp lơ, xào mướp.', 1),
( 'Thịt nạm bò', 'Images/Products/thit-nam-bo.jpg', 'Đồng Nai', 89000, '250g', 5, 1, 'Hầm khoai tây, hầm cà rốt, hầm đậu đen, hầm bí đỏ, nấu canh chua, kho tiêu, rim mắm, xào hành tây, xào nấm, hầm đậu phụ.', 1),
( 'Ức gà tươi phi lê', 'Images/Products/uc-ga-tuoi-phi-le.jpg', 'Tây Ninh', 50000, '500g', 13, 1, 'Nướng, áp chảo, xé phay, xào rau củ, sốt nấm, sốt chanh dây, cuốn bánh tráng, làm salad, trộn rau, làm bánh mì.', 1),
( 'Đùi tỏi gà', 'Images/Products/dui-toi-ga.jpg', 'Tây Ninh', 35400, '300g', 6, 1, 'Nướng, chiên, hầm, kho gừng, sốt mật ong, sốt BBQ, om nấm, rang muối, hấp, chiên xù.', 1),
( 'Bạch tuộc', 'Images/Products/bach-tuoc.jpg', 'Khánh Hòa', 285000, '650g', 12, 2, 'Luộc, nướng, xào chua ngọt, xào tỏi ớt, hấp bia, nướng muối ớt, xào rau muống, nấu canh chua, làm gỏi, sốt me.', 2),
( 'Thịt ốc móng tay', 'Images/Products/thit-oc-mong-tay.jpg', 'Khánh Hòa', 32250, '250g', 21, 2, 'Xào sả ớt, xào me, hấp sả, nướng mỡ hành, xào bơ tỏi, nấu chuối đậu, xào rau muống, xào nấm, xào hành tây, nướng muối ớt.', 2),
( 'Tôm thẻ', 'Images/Products/tom-the.jpg', 'Vĩnh Long', 39600, '200', 35, 2, 'Nướng, rang muối, chiên giòn, sốt chua ngọt, xào hành tây, nấu canh chua, rim mắm, nướng muối ớt, xào rau muống, sốt me.', 2),
( 'Sò huyết', 'Images/Products/so-huyet.jpg', 'Bình Thuận', 113000, '500g', 12, 2, 'Hấp, nướng mỡ hành, xào hành tỏi, nấu cháo, làm gỏi, nướng muối ớt, xào rau muống, xào nấm, xào hành tây, nấu canh chua.', 2),
( 'Mực nang', 'Images/Products/muc-nang.jpg', 'Bình Thuận', 259000, '1Kg', 11, 2, 'Nướng, chiên giòn, xào chua ngọt, xào tỏi ớt, hấp bia, nướng muối ớt, xào rau muống, nấu canh chua, làm gỏi, sốt me.', 2),
( 'Hàu sữa', 'Images/Products/hau-sua.jpg', 'Tiền Giang', 78000, '300g', 10, 2, 'Nướng mỡ hành, nướng phô mai, nướng mỡ hành chấm muối tiêu, nướng sốt Thái, nướng sốt me, hấp, xào rau muống, xào nấm, xào hành tây, nấu cháo.', 2),
( 'Cá kèo', 'Images/Products/ca-keo.jpg', 'Bạc Liêu', 255000, '500g', 10, 3, 'Kho tộ, om chuối đậu, nướng, chiên giòn, nấu canh chua, kho tiêu, rim mắm, kho sả ớt, kho tiêu xanh, kho riềng.', 3),
( 'Cá cơm', 'Images/Products/ca-com.jpg', 'Đà Nẵng', 53000, '500g', 12, 3, 'Chiên giòn, kho tiêu, rim mắm, kho tộ, kho dưa, kho cà chua, rim đường, nấu canh chua, kho tiêu xanh, kho riềng.', 3),
( 'Cá chốt', 'Images/Products/ca-chot.jpg', 'Hồ Chí Minh', 65000, '500g', 5, 3, 'Kho tộ, om chuối đậu, nướng, chiên giòn, nấu canh chua, kho tiêu, rim mắm, kho sả ớt, kho tiêu xanh, kho riềng.', 3),
( 'Cá bóp', 'Images/Products/ca-bop.jpg', 'Bà Rịa', 185000, '500g', 10, 3, 'Kho tộ, om chuối đậu, nướng, chiên giòn, nấu canh chua, kho tiêu, rim mắm, kho sả ớt, kho tiêu xanh, kho riềng.', 3),
( 'Cá basa', 'Images/Products/ca-basa.jpg', 'Khánh Hòa', 27250, '250g', 20, 3, 'Chiên xù, nướng mọi, om dưa chua, sốt cà chua, sốt me, hấp xì dầu, kho tộ, chiên giòn chấm mắm ớt, cuốn bánh tráng, nấu canh chua.', 3),
( 'Cá nục', 'Images/Products/ca-nuc.jpg', 'Tiền Giang', 23400, '300g', 10, 3, 'Một nắng nướng, kho tộ, chiên giòn, rim mắm tỏi, kho tiêu, sốt cà chua, hấp cuốn bánh tráng, kho dưa, nấu canh chua, rim đường.', 3),
( 'Cá bạc má', 'Images/Products/ca-bac-ma.jpg', 'Bà Rịa', 39000, '500g', 13, 3, 'Kho tộ, nướng muối ớt, chiên giòn, rim mắm, sốt cà chua, hấp xì dầu, kho tiêu, om dưa chua, nấu canh chua, kho riềng.', 3),
( 'Cá chim nước ngọt', 'Images/Products/ca-chim-nuoc-ngot.jpg', 'Long An', 30000, '600g', 15, 3, 'Kho tộ, nướng muối ớt, chiên giòn, rim mắm, sốt cà chua, hấp xì dầu, kho tiêu, om dưa chua, nấu canh chua, kho riềng.', 3),
( 'Rau muống', 'Images/Products/rau-muong.jpg', 'Đà Lạt', 10000, 'bó', 20, 4, 'Xào tỏi, xào thịt bò, luộc chấm mắm, xào tôm, luộc chấm tương, xào tỏi ớt, xào thịt ba chỉ, xào nấm, xào tép, luộc chấm muối vừng.', 4),
( 'Cải ngọt', 'Images/Products/cai-ngot.jpg', 'Đà Lạt', 10000, 'bó', 32, 4, 'Xào thịt bò, xào tỏi, luộc chấm mắm, xào tôm, luộc chấm tương, xào tỏi ớt, xào thịt ba chỉ, xào nấm, xào tép, luộc chấm muối vừng.', 4),
( 'Khoai lang', 'Images/Products/khoai-lang.jpg', 'Đà Lạt', 20000, '500g', 20, 4, 'Nướng, luộc, chiên, kén, tím nướng, hấp, làm bánh, nghiền, trộn sữa, làm kem.', 4),
( 'Rau má', 'Images/Products/rau-ma.jpg', 'Đà Lạt', 12000, '200g', 10, 4, 'Sinh tố, chè, trộn tôm thịt, làm gỏi, nấu canh mát, làm nước ép, làm bánh xèo, trộn dầu giấm, làm salad, nấu canh cua.', 4),
( 'Hành lá', 'Images/Products/hanh-la.jpg', 'Đà Lạt', 8000, '100g', 10, 4, 'Canh chua cá, bánh xèo, nem cuốn, phở, bún bò huế, mì xào, trứng ốp la, chả giò, gỏi cuốn, bánh cuốn.', 4),
( 'Rau răm', 'Images/Products/rau-ram.jpg', 'Đà Lạt', 5000, '50g', 10, 4, 'Gỏi cuốn, bún bò huế, bánh xèo, nem chua, gỏi gà, gỏi tai heo, gỏi cá trích, chả giò, bánh cuốn, thịt kho tàu.', 4),
( 'Tía tô', 'Images/Products/tia-to.jpg', 'Đà Lạt', 6900, '100g', 10, 4, 'Gỏi cuốn, bún chả, bún thang, nem nướng, bánh cuốn, phở, bún riêu, canh chua cá, gỏi cá trích, chả giò.', 4),
( 'Rau dền', 'Images/Products/rau-den.jpg', 'Đà Lạt', 10000, '400g', 10, 4, 'Canh rau dền nấu thịt bằm, rau dền luộc chấm mắm nêm, rau dền xào tỏi, rau dền nấu canh chua, rau dền xào thịt bò, rau dền nấu canh tôm, rau dền nấu canh xương, rau dền xào nấm, gỏi rau dền, rau dền luộc chấm tương.', 4),
( 'Dưa chuột', 'Images/Products/dua-chuot.jpg', 'Đà Lạt', 7500, '500g', 10, 4, 'Gỏi dưa chuột, nộm dưa chuột, dưa chuột trộn tôm, dưa chuột trộn thịt bò, dưa chuột trộn gà, dưa chuột trộn hải sản, dưa chuột ngâm chua ngọt, dưa chuột muối, dưa chuột xào thịt, dưa chuột làm salad.', 4),
( 'Rau diếp cá', 'Images/Products/rau-diep-ca.jpg', 'Đà Lạt', 6900, '100g', 10, 4, 'Gỏi cá trích, gỏi gà, gỏi tai heo, bún riêu, bún thang, bún chả, chả giò, nem nướng, bánh cuốn, bánh xèo.', 4),
( 'Măng tây', 'Images/Products/mang-tay.jpg', 'Đà Lạt', 30000, '200g', 13, 4, 'Măng tây xào thịt bò, măng tây xào tôm, măng tây xào tỏi, măng tây nướng, măng tây luộc chấm sốt, măng tây nấu canh, măng tây xào nấm, măng tây xào hải sản, măng tây trộn salad, măng tây om thịt.', 4),
( 'Hành tây', 'Images/Products/hanh-tay.jpg', 'Đà Lạt', 17500, '500g', 15, 4, 'Canh chua cá, thịt kho tàu, cà ri gà, bò kho, nem nướng, thịt xào, mì xào, bánh xèo, chả giò, ốp la.', 4),
( 'Hành tím', 'Images/Products/hanh-tim.jpg', 'Lý Sơn', 21600, '200g', 20, 4, 'Thịt kho tàu, cà ri gà, bò kho, nem nướng, thịt xào, mì xào, bánh xèo, chả giò, ốp la, canh chua cá.', 4),
( 'Củ tỏi', 'Images/Products/cu-toi.jpg', 'Lý Sơn', 35000, '200g', 32, 4, 'Thịt kho tàu, cà ri gà, bò kho, nem nướng, thịt xào, mì xào, bánh xèo, chả giò, ốp la, canh chua cá.', 4),
( 'Ớt hiểm ', 'Images/Products/ot-hiem.jpg', 'Đà Lạt', 6800, '50g', 10, 4, 'Các món xào, các món kho, các món nướng, các loại gỏi, các loại nước chấm, các loại sốt, mắm.', 4),
( 'Sả', 'Images/Products/sa.jpg', 'Đà Lạt', 7600, '200g', 10, 4, 'Sả, hay còn gọi là cỏ chanh, là một loại cây thảo có nguồn gốc từ châu Á, nổi tiếng với hương thơm mát và hơi cay. Sả thường được sử dụng trong ẩm thực Đông Nam Á như là một gia vị quan trọng, thường xuất hiện trong các món cà ri, món xào, và các loại nước dùng. Bóng mượt và dài, sả được cắt nhỏ và đập dập để giải phóng hương vị khi nấu, làm nền cho nhiều món ăn như gà xào sả ớt, bò lúc lắc, hoặc làm phần nước sốt chấm. Ngoài ra, sả còn được dùng để tạo hương trong các loại trà và nước giải khát, mang lại cảm giác sảng khoái, đồng thời có tính năng kháng khuẩn và giảm căng thẳng.', 5),
( 'Me', 'Images/Products/me.jpg', 'Đà Lạt', 16600, '250g', 10, 4, 'Ba rọi heo sốt me, Bạch tuộc sốt me, Thịt ốc móng tay xào me, Tôm thẻ sốt me, Hàu sữa nướng sốt me, Cá basa sốt me.', 5),
( 'Tiêu', 'Images/Products/tieu.jpg', 'Gia Lai', 17300, '50g', 10, 4, 'Xương đuôi heo kho tiêu, Thịt đùi heo kho tiêu, Thịt nạm bò kho tiêu, Thịt nạm bò rim mắm, Cá kèo kho tiêu, Cá kèo kho tiêu xanh, Cá cơm kho tiêu, Cá cơm kho tiêu xanh, Cá chốt kho tiêu, Cá chốt kho tiêu xanh, Cá bóp kho tiêu, Cá bóp kho tiêu xanh, Cá nục kho tiêu, Cá bạc má kho tiêu, và Cá chim nước ngọt kho tiêu.', 5),
( 'Mướp', 'Images/Products/muop.jpg', 'Đà Lạt', 12500, '150g', 15, 4, 'Mướp xào thịt bằm, mướp nấu canh, mướp hầm xương, mướp nhồi thịt, mướp kho tộ, mướp xào tôm, mướp xào nấm, mướp luộc chấm mắm, mướp om thịt, mướp nấu canh chua.', 4),
( 'Nấm rơm', 'Images/Products/nam-rom.jpg', 'Đà Lạt', 26000, '200g', 13, 4, 'Nấm xào thịt bò, nấm xào tôm, nấm xào tỏi, nấm nướng, nấm nấu canh, nấm om thịt, nấm xào hải sản, nấm trộn salad, nấm làm pizza, nấm làm súp.', 4),
( 'Đậu Hà Lan', 'Images/Products/dau-ha-lan.jpg', 'Đà Lạt', 30000, '200g', 5, 4, 'Đậu Hà Lan xào thịt lợn, đậu Hà Lan nấu canh, đậu Hà Lan xào tỏi, đậu Hà Lan trộn salad, đậu Hà Lan nấu súp, đậu Hà Lan hầm xương, đậu Hà Lan xào nấm, đậu Hà Lan nấu cà ri, đậu Hà Lan rang bơ, đậu Hà Lan nấu xốt kem.', 4),
( 'Gói gia vị kho', 'Images/Products/gia-vi-kho.jpg', 'HCM', 7400, '28g', 15, 5, 'Thịt ba chỉ kho tộ, cá kho tộ, đậu phụ kho tộ, trứng kho tộ, thịt bò kho tộ, mướp kho tộ, khổ qua kho tộ, cà tím kho tộ, đậu que kho tộ, nấm kho tộ.', 5),
( 'Bột chiên giòn', 'Images/Products/bot-chien-gion.jpg', 'HCM', 10000, '150g', 8, 5, 'Tôm chiên giòn, cá viên chiên giòn, rau củ chiên giòn, thịt gà chiên giòn, đậu hũ chiên giòn, chả giò, nem rán, bánh xèo, khoai tây chiên giòn, xúc xích chiên giòn.', 5),
( 'Muối I-ốt', 'Images/Products/muoi.jpg', 'HCM', 6500, '500g', 10, 5, 'Thịt kho tàu, cá kho tộ, canh chua, thịt luộc chấm muối tiêu chanh, rau luộc chấm muối, trứng ốp la, gà nướng muối ớt, thịt nướng muối ớt, các loại gỏi, các món xào.', 5),
( 'Mắm nam ngư', 'Images/Products/mam-nam-ngu.jpg', 'HCM', 61000, '900g', 12, 5, 'Cá kho mắm, thịt kho mắm, rau luộc chấm mắm, gỏi cá, gỏi đu đủ, nem chua, chả lụa, các loại nước chấm, các món xào chua ngọt, tỏi, ớt.', 5),
( 'Gói gia vị canh chua', 'Images/Products/goi-gia-vi-canh-chua.jpg', 'HCM', 7400, '30g', 10, 5, 'Canh chua cá, canh chua thịt bằm, canh chua hải sản, canh chua tôm, canh chua sườn, canh chua cá lóc, canh chua cá diêu hồng, canh chua măng, canh chua rau muống, canh chua bông súng.', 5),
( 'Bột mì', 'Images/Products/bot-mi.jpg', 'HCM', 14500, '500g', 7, 5, 'Bánh mì, bánh mì sandwich, bánh mì kẹp thịt, bánh pizza, bánh mì que, bánh bao, bánh bông lan, bánh mì nướng, bánh mì chà bông, bánh mì thịt nướng.', 5),
( 'Bún tươi', 'Images/Products/bun-tuoi.jpg', 'HCM', 18000, '300g', 5, 5, 'Bún bò huế, bún riêu, bún chả, bún thang, bún cá, bún thịt nướng, bún mắm, bún trộn, bún xào, bún cuốn.', 5);


-- Table: orders
CREATE TABLE orders (
  id INT(11) NOT NULL AUTO_INCREMENT,
  order_date DATE NOT NULL,
  total INT(11) NOT NULL,
  customer_id INT(11) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Inserting data into orders
INSERT INTO orders (order_date, total, customer_id) VALUES
('2018-05-12', 120, 2),
('2018-05-11', 250, 3),
('2018-05-11', 75, 1),
('2018-05-11', 180, 4);

-- Table: order_details
CREATE TABLE order_details (
  order_id INT(11) NOT NULL,
  product_id INT(11) NOT NULL,
  quantity INT(11) NOT NULL DEFAULT 1,
  price INT(11) NOT NULL,
  total_amount INT(11) AS (quantity * price) STORED,
  PRIMARY KEY (order_id, product_id),
  CONSTRAINT fk_order_details_order FOREIGN KEY (order_id) REFERENCES orders (id),
  CONSTRAINT fk_order_details_product FOREIGN KEY (product_id) REFERENCES products (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Inserting data into order_details
INSERT INTO order_details (order_id, product_id, quantity, price) VALUES
(1, 1, 2, 31800),
(2, 3, 1, 56500),
(3, 2, 3, 42000),
(4, 4, 1, 58000);

COMMIT;