DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;


CREATE TABLE products
(
    item_id INT (25) NOT NULL
    AUTO_INCREMENT,
    product_name VARCHAR
    (50) NOT NULL,
    department_name VARCHAR
    (50) NOT NULL,
    price INT
    (25) NOT NULL,
    stock_quantity VARCHAR
    (50) NOT NULL,
    PRIMARY KEY
    (item_id)
);

    INSERT INTO products
        (product_name, department_name, price, stock_quantity)

    VALUES
        ("Dog Collar", "Supplies", 30, 150),
        ("Harness", "Supplies", 35, 100),
        ("Taste of the Wild", "Food", 50, 30),
        ("Fromm", "Food", 75, 50),
        ("Orijen", "Food", 85, 15),
        ("Greenies", "Treats", 20, 40),
        ("Vita-Essentials Freeze Dried Minnows", "Treats", 8, 20),
        ("Dog Bed", "Supplies", 40, 10),
        ("Dog Kennel-Medium", "Supplies", 50, 7),
        ("Dog Kennel-Large", "Supplies", 60, 9);