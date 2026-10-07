-- query-set.sql
-- Run ecommerce-schema.sql first.
-- Expected outputs below assume the sample data in ecommerce-schema.sql.

-- ============================================================
-- 1. JOIN: Get all orders with customer information
-- ============================================================

SELECT
    o.order_id,
    u.name,
    u.email,
    o.status
FROM Orders o
JOIN Users u ON o.user_id = u.user_id
ORDER BY o.order_id;

-- Expected:
-- order_id | name    | email                 | status
-- 1        | Alice   | alice@example.com     | PLACED
-- 2        | Alice   | alice@example.com     | DELIVERED
-- 3        | Bob     | bob@example.com       | DELIVERED
-- 4        | Bob     | bob@example.com       | PLACED
-- 5        | Charlie | charlie@example.com   | DELIVERED


-- ============================================================
-- 2. JOIN: Show products in every order
-- ============================================================

SELECT
    oi.order_id,
    p.product_name,
    oi.quantity,
    oi.unit_price
FROM OrderItems oi
JOIN Products p ON oi.product_id = p.product_id
ORDER BY oi.order_id, p.product_id;

-- Expected:
-- order_id | product_name | quantity | unit_price
-- 1        | Laptop       | 1        | 50000.00
-- 1        | Headphones   | 2        | 2000.00
-- 2        | Phone        | 1        | 30000.00
-- 2        | Mouse        | 2        | 800.00
-- 3        | Laptop       | 1        | 50000.00
-- 3        | Keyboard     | 1        | 1500.00
-- 4        | Headphones   | 3        | 2000.00
-- 4        | Mouse        | 1        | 800.00
-- 5        | Phone        | 1        | 30000.00
-- 5        | Keyboard     | 2        | 1500.00


-- ============================================================
-- 3. GROUP BY: Calculate total value of each order
-- ============================================================

SELECT
    order_id,
    SUM(quantity * unit_price) AS order_total
FROM OrderItems
GROUP BY order_id
ORDER BY order_id;

-- Expected:
-- order_id | order_total
-- 1        | 54000.00
-- 2        | 31600.00
-- 3        | 51500.00
-- 4        | 6800.00
-- 5        | 33000.00


-- ============================================================
-- 4. GROUP BY + HAVING: Users with more than one order
-- ============================================================

SELECT
    u.user_id,
    u.name,
    COUNT(o.order_id) AS order_count
FROM Users u
JOIN Orders o ON u.user_id = o.user_id
GROUP BY u.user_id, u.name
HAVING COUNT(o.order_id) > 1
ORDER BY u.user_id;

-- Expected:
-- user_id | name  | order_count
-- 1       | Alice | 2
-- 2       | Bob   | 2


-- ============================================================
-- 5. LEFT JOIN: Products that have never been ordered
-- ============================================================

SELECT
    p.product_id,
    p.product_name
FROM Products p
LEFT JOIN OrderItems oi
    ON p.product_id = oi.product_id
WHERE oi.product_id IS NULL
ORDER BY p.product_id;

-- Expected:
-- product_id | product_name
-- 6           | Monitor


-- ============================================================
-- 6. SUBQUERY: Products priced above the average
-- ============================================================

SELECT
    product_id,
    product_name,
    price
FROM Products
WHERE price > (
    SELECT AVG(price)
    FROM Products
)
ORDER BY price DESC;

-- Expected:
-- product_id | product_name | price
-- 1          | Laptop       | 50000.00
-- 2          | Phone        | 30000.00


-- ============================================================
-- 7. EXISTS SUBQUERY: Users who have placed an order
-- ============================================================

SELECT
    user_id,
    name
FROM Users u
WHERE EXISTS (
    SELECT 1
    FROM Orders o
    WHERE o.user_id = u.user_id
)
ORDER BY user_id;

-- Expected:
-- user_id | name
-- 1       | Alice
-- 2       | Bob
-- 3       | Charlie


-- ============================================================
-- 8. SUBQUERY: Most expensive product
-- ============================================================

SELECT
    product_id,
    product_name,
    price
FROM Products
WHERE price = (
    SELECT MAX(price)
    FROM Products
);

-- Expected:
-- product_id | product_name | price
-- 1          | Laptop       | 50000.00


-- ============================================================
-- 9. GROUP BY + HAVING: Users whose total spending > 50000
-- ============================================================

SELECT
    u.user_id,
    u.name,
    SUM(oi.quantity * oi.unit_price) AS total_spending
FROM Users u
JOIN Orders o ON u.user_id = o.user_id
JOIN OrderItems oi ON o.order_id = oi.order_id
GROUP BY u.user_id, u.name
HAVING SUM(oi.quantity * oi.unit_price) > 50000
ORDER BY total_spending DESC;

-- Expected:
-- user_id | name  | total_spending
-- 1       | Alice | 85600.00
-- 2       | Bob   | 58300.00


-- ============================================================
-- 10. GROUP BY + ORDER BY + LIMIT: Top 5 best-selling products
-- ============================================================

SELECT
    p.product_id,
    p.product_name,
    SUM(oi.quantity) AS total_sold
FROM Products p
JOIN OrderItems oi ON p.product_id = oi.product_id
GROUP BY p.product_id, p.product_name
ORDER BY total_sold DESC, p.product_id
LIMIT 5;

-- Expected:
-- product_id | product_name | total_sold
-- 3          | Headphones   | 5
-- 4          | Keyboard     | 3
-- 5          | Mouse        | 3
-- 2          | Phone        | 2
-- 1          | Laptop       | 2
