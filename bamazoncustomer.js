var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  connection.query("SELECT * FROM products", function(err, response){
    console.log(response);
    start();
  })
});



// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt([{
      name: "pid",
      type: "number",
      message: "What would you like to buy? Enter product ID."
    },{
      name: "q",
      type: "number",
      message: "How many?"
    }])
    .then(function(answer) {
        connection.query("SELECT * FROM products WHERE id = ?", answer.pid, function(err, response){
            var product= response[0];
            if(answer.q <= product.stock_quantity){
              var newq = product.stock_quantity - answer.q;
              connection.query("UPDATE products SET stock_quantity = ? WHERE id = ?", [newq, answer.pid], function(err, response){
                var cost = answer.q*product.price;
                console.log('Your purchase costs $' + cost);
              })
            }else{
              console.log('Insufficient quantity!');
            }

        })

    });
}

