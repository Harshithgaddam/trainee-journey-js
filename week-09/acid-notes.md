# ACID Notes — E-commerce Order Placement

## Order-placement flow

An order placement should be treated as one database transaction:

```sql
BEGIN;

-- 1. Lock/check the product row
SELECT stock_quantity
FROM Products
WHERE product_id = 1
FOR UPDATE;

-- 2. Create the order
INSERT INTO Orders (user_id, status)
VALUES (1, 'PLACED')
RETURNING order_id;

-- 3. Add the ordered product
INSERT INTO OrderItems (order_id, product_id, quantity, unit_price)
VALUES (/* new order_id */, 1, 1, 50000.00);

-- 4. Reduce stock
UPDATE Products
SET stock_quantity = stock_quantity - 1
WHERE product_id = 1
  AND stock_quantity >= 1;

COMMIT;
```

If any step fails:

```sql
ROLLBACK;
```

## 1. Atomicity

**Cause:** Placing an order requires multiple database operations: creating the order, inserting order items, and reducing product stock.

**Process:** All operations are placed inside one transaction. If one operation fails, `ROLLBACK` undoes the earlier operations.

**Result:** The database does not end up with a half-completed order.

Example: if the stock update fails, the newly created order and order item are rolled back too.

---

## 2. Consistency

**Cause:** The database must always obey its rules and constraints.

**Process:** Primary keys, foreign keys, UNIQUE constraints, and CHECK constraints enforce valid data.

Examples:

- `Orders.user_id` must refer to an existing user.
- `OrderItems.product_id` must refer to an existing product.
- `quantity > 0`.
- `price >= 0`.
- `stock_quantity >= 0`.

The stock update also checks that enough stock exists.

**Result:** A successful transaction moves the database from one valid state to another valid state.

---

## 3. Isolation

**Cause:** Multiple customers may try to purchase the same product at the same time.

**Process:** `SELECT ... FOR UPDATE` locks the product row while the transaction is working with it. Another transaction attempting to modify the same row must wait until the first transaction completes.

Example:

```sql
SELECT stock_quantity
FROM Products
WHERE product_id = 1
FOR UPDATE;
```

**Result:** Concurrent orders cannot both incorrectly consume the same stock.

---

## 4. Durability

**Cause:** After an order is successfully committed, the data must not disappear because the application crashes.

**Process:** `COMMIT` makes the transaction permanent. PostgreSQL uses transaction logging and recovery mechanisms to preserve committed changes.

**Result:** Once the database confirms the commit, the order remains stored even if the application/server subsequently crashes.

---

## Summary

| ACID Property | What it guarantees during order placement |
|---|---|
| Atomicity | All order operations succeed together or all are rolled back |
| Consistency | Constraints and business rules remain valid |
| Isolation | Concurrent orders do not incorrectly interfere with each other |
| Durability | A committed order survives application/server failure |

## Important note

ACID guarantees depend on the database engine, transaction configuration, and correct application code. The schema alone does not automatically provide every business-level guarantee; the order-placement logic must also use transactions and appropriate locking/isolation.
