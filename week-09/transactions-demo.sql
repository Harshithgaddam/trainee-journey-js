-- transactions-demo.sql
-- PostgreSQL demo:
-- 1. Transfer stock between two product rows and deliberately fail midway.
-- 2. Demonstrate that ROLLBACK restores the original stock values.
-- 3. Add indexes to foreign-key columns.
-- 4. Use EXPLAIN before and after adding an index.
--
-- Run ecommerce-schema.sql first.

-- This query is likely to use a Sequential Scan even if an index is available
-- because the table is very small. We cannot directly choose which
-- scan PostgreSQL should use. PostgreSQL's Query Planner chooses the
-- scan based on the estimated cost. For this small table with only
-- 5 rows, an Index Scan may cost more than a Sequential Scan, so the
-- Query Planner chooses the Sequential Scan.
-- Thats why "screenshots/Explain-Before.PNG" and "screenshots/Explain-After.PNG" both screenshots  show seq scan only.                                                                                                                                
-- ===========================================================
-- 1. BEFORE-INDEX EXPLAIN
-- ============================================================

EXPLAIN
SELECT *
FROM Orders
WHERE user_id = 2;

-- Typical output with the small sample data:
-- Seq Scan on orders
--   Filter: (user_id = 2)
--
-- Note: PostgreSQL may choose a Seq Scan because the sample table
-- contains only a few rows.

-- ============================================================
-- 2. ADD INDEXES
-- ============================================================
-- Primary-key columns already have indexes.
-- PostgreSQL does NOT automatically index foreign-key columns.

CREATE INDEX IF NOT EXISTS idx_orders_user_id
ON Orders(user_id);

CREATE INDEX IF NOT EXISTS idx_orderitems_product_id
ON OrderItems(product_id);

CREATE INDEX IF NOT EXISTS idx_orderitems_order_id
ON OrderItems(order_id);

ANALYZE Orders;
ANALYZE OrderItems;

-- ============================================================
-- 3. AFTER-INDEX EXPLAIN
-- ============================================================

EXPLAIN
SELECT *
FROM Orders
WHERE user_id = 2;

-- IMPORTANT:
-- With only 5 sample Orders, PostgreSQL may STILL choose Seq Scan.
-- That is normal: scanning 5 rows can be cheaper than using an index.
--
-- With a larger Orders table, the same query is expected to use:
--
-- Index Scan using idx_orders_user_id on orders
--   Index Cond: (user_id = 2)
--
-- EXPLAIN shows the planner's choice; creating an index does not
-- force PostgreSQL to use it.

-- ============================================================
-- 4. CHECK STOCK BEFORE TRANSACTION
-- ============================================================

SELECT
    product_id,
    product_name,
    stock_quantity
FROM Products
WHERE product_id IN (1, 2)
ORDER BY product_id;

-- Expected:
-- product_id | product_name | stock_quantity
-- 1          | Laptop       | 8
-- 2          | Phone        | 15

-- ============================================================
-- 5. START TRANSACTION
-- ============================================================

BEGIN;

-- Lock both product rows.
SELECT
    product_id,
    product_name,
    stock_quantity
FROM Products
WHERE product_id IN (1, 2)
ORDER BY product_id
FOR UPDATE;

-- Transfer 2 units from Product 1 to Product 2.
-- First operation succeeds.
UPDATE Products
SET stock_quantity = stock_quantity - 2
WHERE product_id = 1
  AND stock_quantity >= 2;

-- Check the intermediate state.
SELECT
    product_id,
    product_name,
    stock_quantity
FROM Products
WHERE product_id IN (1, 2)
ORDER BY product_id;

-- Expected INSIDE the transaction:
-- product_id | product_name | stock_quantity
-- 1          | Laptop       | 6
-- 2          | Phone        | 15

-- ============================================================
-- 6. DELIBERATE FAILURE
-- ============================================================
-- This INSERT intentionally fails because product_id 999999
-- does not exist and OrderItems.product_id is a foreign key.

INSERT INTO OrderItems (
    order_id,
    product_id,
    quantity,
    unit_price
)
VALUES (
    1,
    999999,
    2,
    50000.00
);

-- PostgreSQL reports a FOREIGN KEY violation here.
-- The transaction is now in an aborted state.
--
-- IMPORTANT:
-- Do not try to run normal SQL statements after this error.
-- Execute:
--
-- ROLLBACK;
--
-- ROLLBACK will undo the successful stock update too.

ROLLBACK;

-- ============================================================
-- 7. CHECK STOCK AFTER ROLLBACK
-- ============================================================

SELECT
    product_id,
    product_name,
    stock_quantity
FROM Products
WHERE product_id IN (1, 2)
ORDER BY product_id;

-- Expected AFTER ROLLBACK:
-- product_id | product_name | stock_quantity
-- 1          | Laptop       | 8
-- 2          | Phone        | 15
--
-- Product 1 returned from 6 to 8.
-- This demonstrates Atomicity: the successful change before the
-- failure was undone.

-- ============================================================
-- OPTIONAL CLEANUP
-- ============================================================
-- If you do not want to keep the indexes:
--
-- DROP INDEX IF EXISTS idx_orders_user_id;
-- DROP INDEX IF EXISTS idx_orderitems_product_id;
-- DROP INDEX IF EXISTS idx_orderitems_order_id;
