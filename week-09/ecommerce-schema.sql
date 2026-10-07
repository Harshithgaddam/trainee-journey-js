-- ecommerce-schema.sql
-- PostgreSQL-compatible 3NF e-commerce schema
-- The design also satisfies BCNF/4NF/5NF under the stated dependencies.

DROP TABLE IF EXISTS OrderItems;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Products (
    product_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock_quantity INT NOT NULL CHECK (stock_quantity >= 0)
);

CREATE TABLE Orders (
    order_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'PLACED',

    CONSTRAINT fk_order_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
);

CREATE TABLE OrderItems (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),

    PRIMARY KEY (order_id, product_id),

    CONSTRAINT fk_item_order
        FOREIGN KEY (order_id)
        REFERENCES Orders(order_id),

    CONSTRAINT fk_item_product
        FOREIGN KEY (product_id)
        REFERENCES Products(product_id)
);

-- ------------------------------------------------------------
-- Sample data used by query-set.sql
-- ------------------------------------------------------------

INSERT INTO Users (name, email) VALUES
('Alice', 'alice@example.com'),
('Bob', 'bob@example.com'),
('Charlie', 'charlie@example.com'),
('Diana', 'diana@example.com'),
('Ethan', 'ethan@example.com');

INSERT INTO Products (product_name, price, stock_quantity) VALUES
('Laptop', 50000.00, 8),
('Phone', 30000.00, 15),
('Headphones', 2000.00, 25),
('Keyboard', 1500.00, 20),
('Mouse', 800.00, 30),
('Monitor', 12000.00, 10);

INSERT INTO Orders (user_id, status) VALUES
(1, 'PLACED'),     -- order 1: Alice
(1, 'DELIVERED'),  -- order 2: Alice
(2, 'DELIVERED'),  -- order 3: Bob
(2, 'PLACED'),     -- order 4: Bob
(3, 'DELIVERED');  -- order 5: Charlie

INSERT INTO OrderItems (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 50000.00),  -- Alice: Laptop
(1, 3, 2, 2000.00),   -- Alice: Headphones x2

(2, 2, 1, 30000.00),  -- Alice: Phone
(2, 5, 2, 800.00),    -- Alice: Mouse x2

(3, 1, 1, 50000.00),  -- Bob: Laptop
(3, 4, 1, 1500.00),   -- Bob: Keyboard

(4, 3, 3, 2000.00),   -- Bob: Headphones x3
(4, 5, 1, 800.00),    -- Bob: Mouse

(5, 2, 1, 30000.00),  -- Charlie: Phone
(5, 4, 2, 1500.00);   -- Charlie: Keyboard x2
