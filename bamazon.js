var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table")

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "Comphealth1",
    database: "bamazon_db"
})

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    initTable();
    inquirer.prompt({

    })
}

function initTable() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, data) {
        if (err) throw err;
        console.log(data)

        var table = new Table({
            head: ["Product ID", "Product Name", "Price", "Stock Quantity"],
            colWidths: [15, 40, 20, 20]
        });
        for (var i = 0; i < data.length; i++) {
            table.push([data[i].item_id, data[i].product_name, data[i].price, data[i].stock_quantity])
        };
        console.log("\n\n" + table.toString() + "\n\n")
    })
}