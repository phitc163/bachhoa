const express = require('express');
const router = express.Router();
const connection = require('../db'); // Tệp kết nối cơ sở dữ liệu
const fs = require('fs');
// Read the JSON file synchronously
const rawData = fs.readFileSync('..\\TKW_Cu-main\\id_matrix.json');
const jsonData = JSON.parse(rawData);
// Lấy danh sách tất cả sản phẩm
router.get('/', async (req, res) => {
    // Query the database for the final product list ordered by stock
    connection.query('SELECT * FROM products ORDER BY stock DESC;', (err, results) => {
        if (err) {
            console.error('Lỗi khi truy vấn sản phẩm:', err);
            return res.status(500).send('Đã xảy ra lỗi khi lấy dữ liệu sản phẩm');
        }
        res.json(results);
    });
});

// router.get('/getProductId/:id', (req, res) => {
//     let productsArray = jsonData; // Assuming productsArray is populated elsewhere
//     let baseProductId = req.params.id;
//     let baseCategoryId;

//     // Get the category ID of the base product from the database
//     connection.query('SELECT category_id FROM products WHERE id = ?', [baseProductId], (err, baseProduct) => {
//         if (err) {
//             console.error('Error querying base product:', err);
//             return res.status(500).json({ message: 'Database query failed', error: err });
//         }
//         console.log('Pass');
//         if (baseProduct.length > 0) {
//             console.log('Pass2');
//             baseCategoryId = baseProduct[0].category_id;

//             // Create an array contains data from productsArray(productsArray[baseProductId])
//             let productsInfo = [];

//             for (let x = 1; x < 51; x++) {
//                 connection.query('SELECT * FROM products WHERE id = ?', [x], (err, productInfo) => {
//                     if (err) {
//                         console.error('Error querying product info:', err);
//                         return res.status(500).json({ message: 'Database query failed', error: err });
//                     }

//                     if (productInfo.length > 0) {
//                         let currentProduct = productInfo[0];
//                         // Check if the category_id is not equal to the baseCategoryIdz
//                         if (currentProduct.category_id !== baseCategoryId) {
//                             // Add points field to currentProduct
//                             currentProduct.point = productsArray[baseCategoryId][x];

//                             console.log("Point: ", currentProduct.point)
//                             // Add currentProduct to productsInfo
//                             productsInfo.push(currentProduct);

//                             // After completing the loop
//                             if (x === 50) {
//                                 // Sort the productsInfo array by points field in descending order
//                                 productsInfo.sort((a, b) => b.point - a.point);

//                                 // tempProductInfo contains all product data fetched during this iteration
//                                 const tempProductInfo = productsInfo.slice(0, 7);

//                                 // Return the fetched data
//                                 res.json({ tempProductInfo });
//                             }
//                         }
//                     }
//                 });
//             }
//         } else {
//             res.status(404).json({ message: 'Base product not found' });
//         }
//     });
// });

router.get('/getProductId/:id', (req, res) => {
    let productsArray = jsonData; // Assuming productsArray is populated elsewhere
    let baseProductId = req.params.id;
    let baseCategoryId;

    // Get the category ID of the base product from the database
    connection.query('SELECT category_id FROM products WHERE id = ?', [baseProductId], (err, baseProduct) => {
        if (err) {
            console.error('Error querying base product:', err);
            return res.status(500).json({ message: 'Database query failed', error: err });
        }

        if (baseProduct.length > 0) {
            const baseCategoryId = baseProduct[0].category_id;
            const productsRes = jsonData[baseProductId - 1]; // productsRes is an object with product IDs as values
            let productsInfo = [];

            // Convert the async queries to promises
            const queries = Object.values(productsRes).map((productId) => {
                return new Promise((resolve, reject) => {
                    // Query to fetch full product information from the database using the product ID
                    connection.query('SELECT * FROM products WHERE id = ?', [productId], (err, result) => {
                        if (err) {
                            console.error('Error querying product:', err);
                            return reject(err);
                        }

                        if (result.length > 0) {
                            const fullProductInfo = result[0];
                            const productCategoryId = fullProductInfo.category_id;

                            // Check if the category_id is different from baseCategoryId
                            if (productCategoryId !== baseCategoryId) {
                                // Add the full product information to productsInfo
                                productsInfo.push(fullProductInfo);
                                console.log(`Added product with ID: ${fullProductInfo.id}, Category_ID: ${productCategoryId}`);
                            }
                        }
                        resolve();
                    });
                });
            });

            // Wait for all queries to complete
            Promise.all(queries)
                .then(() => {
                    // After all queries are complete, send the response
                    const tempProductInfo = productsInfo.slice(0, 7);
                    res.json({ tempProductInfo })
                    
                })
                .catch((error) => {
                    console.error('Error processing queries:', error);
                    res.status(500).json({ message: 'Error processing product queries', error });
                });
        } else {
            console.log('Base product not found.');
            res.status(404).json({ message: 'Base product not found' });
        }
    });
});
//             for (let x = 1; x < 52; x++) {
//                 connection.query('SELECT * FROM products WHERE id = ?', [x], (err, productInfo) => {
//                     if (err) {
//                         console.error('Error querying product info:', err);
//                         return res.status(500).json({ message: 'Database query failed', error: err });
//                     }

//                     if (productInfo.length > 0) {
//                         let currentProduct = productInfo[0];
//                         // Check if the category_id is not equal to the baseCategoryIdz
//                         if (currentProduct.category_id !== baseCategoryId) {
//                             // Add points field to currentProduct
//                             currentProduct.point = productsArray[baseCategoryId][x];

//                             // Add currentProduct to productsInfo
//                             productsInfo.push(currentProduct);

//                             // After completing the loop
//                             if (x === 50) {
//                                 // Sort the productsInfo array by points field in descending order
//                                 productsInfo.sort((a, b) => b.point - a.point);

//                                 // tempProductInfo contains all product data fetched during this iteration
//                                 const tempProductInfo = productsInfo.slice(0, 7);

//                                 // Return the fetched data
//                                 res.json({ tempProductInfo });
//                             }
//                         }
//                     }
//                 });
//             }
//         } else {
//             res.status(404).json({ message: 'Base product not found' });
//         }
//     });
// });

router.delete('/:id', (req, res) => {
    const productId = req.params.id;

    connection.promise().query('DELETE FROM products WHERE id = ?', [productId])
        .then(() => {
            res.json({ message: 'Sản phẩm đã bị xóa thành công!' });
        })
        .catch(error => {
            console.error('Error deleting product:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa sản phẩm.' });
        });
});

router.put('/:id', (req, res) => {
    const productId = req.params.id;
    const { product_name, category_id, unit, origin, unit_price, stock, description } = req.body;

    connection.promise().query(
        'UPDATE products SET product_name = ?, category_id = ?, unit = ?, origin = ?, unit_price = ?, stock = ?, description = ? WHERE id = ?',
        [product_name, category_id, unit, origin, unit_price, stock, description, productId]
    )
        .then(() => {
            res.json({ message: 'Cập nhật sản phẩm thành công!' });
        })
        .catch(error => {
            console.error('Error updating product:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật sản phẩm.' });
        });
});

router.post('/add', (req, res) => {
    const { product_name, picture, origin, unit_price, unit, stock, description, category_id } = req.body;
    const supplier_id = req.body.supplier_id || null;  // Mặc định supplier_id là null nếu không cung cấp

    connection.query(
        'INSERT INTO products (product_name, picture, origin, unit_price, unit, stock, description, category_id, supplier_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [product_name, picture, origin, unit_price, unit, stock, description, category_id, supplier_id],
        (err, result) => {
            if (err) {
                console.error('Lỗi khi thêm sản phẩm:', err);
                return res.status(500).send('Đã xảy ra lỗi khi thêm sản phẩm');
            }
            res.status(201).send('Thêm sản phẩm thành công');
        }
    );
});

module.exports = router;
