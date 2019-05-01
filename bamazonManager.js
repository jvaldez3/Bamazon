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



// function buyProduct() {
//     inquirer.prompt([{
//             name: "buy",
//             type: "input",
//             message: "Please enter the ID of the item you would like to buy."
//         },
//         {
//             name: "quantity",
//             type: "input",
//             message: "How many would you like to buy?"
//         }
//     ]).then(function (answer) {
//         var itemID = parseInt(answer.buy);
//         var quantity = answer.quantity;
//         connection.query(`SELECT * FROM products WHERE item_id = ${itemID}`, function (err, results) {
//             if (err) throw err;
//             else {
//                 if (results[0].stock_quantity >= answer.quantity) {
//                     var item = results[0];
//                     var totalCost = item.price * quantity;
//                     connection.query(`UPDATE products SET stock_quantity = stock_quantity - ${quantity} WHERE item_id = ${itemID}`, function (err, results2) {
//                         if (err) throw err;
//                         else {
//                             console.log("Your Total Comes To: " + totalCost)
//                         }
//                         connection.end();
//                     })
//                 } else {
//                     console.log("Insufficient Quantity!");
//                     connection.end();
//                 }
//             }
//         })
//     })
// }

function initTable() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, data) {
        if (err) throw err;
        // console.log(data)

        var table = new Table({
            head: ["Product ID", "Product Name", "Department Name", "Price", "Stock Quantity"],
            colWidths: [15, 40, 20, 20, 20]
        });
        for (var i = 0; i < data.length; i++) {
            table.push([data[i].item_id, data[i].product_name, data[i].department_name, data[i].price, data[i].stock_quantity])
        };
        inquirer.prompt({
            name: "start",
            type: "list",
            message: "Manager View",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"]
        }).then(function (answer) {
            switch (answer.start) {
                case "View Products for Sale":
                    console.log("\n\n" + table.toString() + "\n\n");
                    initTable();
                    break;
                case "View Low Inventory":
                    viewLowInv();
                    break;
                case "Add to Inventory":
                    addInv();
                    break;
                case "Add New Product":
                    createNewProduct();
                    break;
                case "EXIT":
                    console.log("Exiting Manager View")
                    connection.end();
                    break;

            }
        })

    })
}

function viewLowInv() {
    var query = "SELECT * FROM products WHERE stock_quantity < 5";
    connection.query(query, function (err, data) {
        if (err) throw err;

        var table = new Table({
            head: ["Product ID", "Product Name", "Department Name", "Price", "Stock Quantity"],
            colWidths: [15, 40, 20, 20, 20]
        });
        for (var i = 0; i < data.length; i++) {
            table.push([data[i].item_id, data[i].product_name, data[i].department_name, data[i].price, data[i].stock_quantity])
        };
        console.log("\n\n" + table.toString() + "\n\n");
        initTable();
    })

}

function addInv() {
    inquirer.prompt([{
            name: "productName",
            type: "list",
            message: "Which product would you like to update?",
            choices: ["Dog Collar", "Harness", "Taste of the Wild", "Fromm", "Orijen", "Greenies", "Vita-Essentials Freeze Dried Minnows", "Dog Bed", "Dog Kennel-Medium", "Dog Kennel-Large"]
        },
        {
            name: "quantityAdd",
            type: "input",
            message: "How many items would you like to add?"
        }
    ]).then(function (answer) {
        console.log(answer);

        var {
            productName,
            quantityAdd
        } = answer;
        if (isNaN(quantityAdd)) {
            console.log("QUANTITY TO ADD MUST BE A NUMBER")
            addInv();
        } else {
            quantityAdd = quantityAdd * 1;
            var query = `SELECT item_id, stock_quantity FROM products WHERE product_name = "${productName}"`;
            connection.query(query, function (err, data) {
                if (err) throw err;
                else {
                    if (data.length) {
                        console.log(data);
                        var itemID = data[0].item_id;
                        var originalQuantity = data[0].stock_quantity;
                        connection.query(`UPDATE products SET stock_quantity = stock_quantity + ${quantityAdd} WHERE item_id = ${itemID}`, function (err, results2) {
                            if (err) throw err;
                            else {
                                var newStockQuantity = originalQuantity + quantityAdd;
                                console.log("Your new stock quantity is: " + newStockQuantity)
                                initTable();
                            }
                        })
                    }
                }
            })
        }

    })
}

function createNewProduct() {
    inquirer.prompt([{
            name: "product",
            type: "input",
            message: "What product would you like to add?"
        },
        {
            name: "departmentName",
            type: "input",
            message: "What department will this product go into?"
        }, {
            name: "price",
            type: "input",
            message: "What is the price of this product?"
        },
        {
            name: "amount",
            type: "input",
            message: "How many would you like to add?"
        }
    ]).then(function (answer) {
        connection.query(
            "INSERT INTO products SET ?", {
                product_name: answer.product,
                department_name: answer.departmentName,
                price: parseInt(answer.price),
                stock_quantity: parseInt(answer.amount)
            },

            function (err, data) {
                if (err) {
                    console.log("Please Try Again");
                }
                if (!err) {

                    var table = new Table({
                        head: ["Product ID", "Product Name", "Department Name", "Price", "Stock Quantity"],
                        colWidths: [15, 40, 20, 20, 20]
                    });
                    for (var i = 0; i < data.length; i++) {
                        table.push([data[i].item_id, data[i].product_name, data[i].department_name, data[i].price, data[i].stock_quantity])
                    };
                    console.log(`\nYou have added ${answer.product} to the inventory. You have ${answer.amount} in stock.\n`)
                    console.log("\n\n" + table.toString() + "\n\n");
                    initTable();
                }
            }
        );
    })
}