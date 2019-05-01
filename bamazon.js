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
    initTable();
});



function buyProduct() {
    inquirer.prompt([{
            name: "buy",
            type: "input",
            message: "Please enter the ID of the item you would like to buy."
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to buy?"
        }
    ]).then(function (answer) {
        var itemID = parseInt(answer.buy);
        var quantity = answer.quantity;
        connection.query(`SELECT * FROM products WHERE item_id = ${itemID}`, function (err, results) {
            if (err) throw err;
            else {
                if (results[0].stock_quantity >= answer.quantity) {
                    var item = results[0];
                    var totalCost = item.price * quantity;
                    connection.query(`UPDATE products SET stock_quantity = stock_quantity - ${quantity} WHERE item_id = ${itemID}`, function (err, results2) {
                        if (err) throw err;
                        else {
                            console.log("Your Total Comes To: " + totalCost)
                        }
                        connection.end();
                    })
                } else {
                    console.log("Insufficient Quantity!");
                    connection.end();
                }
            }
        })
    })
}

function initTable() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, data) {
        if (err) throw err;
        // console.log(data)

        var table = new Table({
            head: ["Product ID", "Product Name", "Price", "Stock Quantity"],
            colWidths: [15, 40, 20, 20]
        });
        for (var i = 0; i < data.length; i++) {
            table.push([data[i].item_id, data[i].product_name, data[i].price, data[i].stock_quantity])
        };
        console.log("\n\n" + table.toString() + "\n\n")
        inquirer.prompt({
            name: "start",
            type: "list",
            message: "Welcome to the Bamazon Pet Store! What would you like to do?",
            choices: ["BUY", "EXIT"]
        }).then(function (answer) {
            if (answer.start === "BUY") {
                buyProduct();
            } else {
                console.log("Thank you for shopping at Bamazon, have a great day!")
                connection.end();
            }
        })

    })
}