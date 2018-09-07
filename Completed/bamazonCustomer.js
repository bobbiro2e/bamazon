var inquirer = require("inquirer");

var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db",
    socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});

connection.connect(function (err) {
    if (err) throw err;
});
connection.query("select * from products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
        console.log("-----------------" + "\n" + "Product ID: " + res[i].item_id + "\n" + "Product Name: " + res[i].product_name + "\n" + "Price: " + res[i].price + "\n")
    }
    start();
});
function start() {
    inquirer.prompt([
        {
            type: "input",
            message: "what is the id of the product you would like to buy?",
            name: "id"
        },
        {
            type: "input",
            message: "how many units would you like to buy?",
            name: "quantity",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answers) {
        var selectedID = parseInt(answers.id);
        var selectedQuantity = answers.quantity;
        purchase(selectedID, selectedQuantity);
    })
};

function purchase(id, quantity) {
    connection.query("select * from products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            var itemID = res[i].item_id;
            var itemQuantity = res[i].stock_quantity;
            if (id === itemID && quantity <= itemQuantity) {
                connection.query("update products set ? where ?",
                    [
                        { stock_quantity: res[i].stock_quantity - itemQuantity },
                        { item_id: res[i].item_id }
                    ]
                )
                console.log("Thanks for your purchase!")
            } else if (id === itemID && quantity > itemQuantity) {
                console.log("Invalid quantity. " + res[i].stock_quantity + " left in inventory.");
            }
        };

    })
};

