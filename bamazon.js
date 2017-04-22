var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "ZZZZ",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  else displayDB();
});


var displayDB = function () {
  connection.query('SELECT * FROM products', function (err, results) {
    if (err) throw err;
    console.log(console.table(results));
    purchase();
  });
}

var purchase = function () {
  // prompt for info about the purchase request
  inquirer.prompt([{
    name: "item_id",
    type: "input",
    message: "What is the item ID you would like to purchase?"
  }, {
    name: "purchase_quantity",
    type: "input",
    message: "How many of this item would you like to purchase?",
    validate: function (value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  }]).then(function (answer, err) {
    connection.query('SELECT stock_quantity, price FROM products WHERE item_id =' + answer.item_id, [], function (err, row, field) {
      compareValues(row, field, answer);    
    });
    if (err) throw err;
    displayDB();
  });
};

function compareValues(row, field, answer){
  var stock_quantity = row[0].stock_quantity;
  var purchase_quantity = answer.purchase_quantity;
  var price = row[0].price;
  var purchasePrice = purchase_quantity * price;
  if (stock_quantity > purchase_quantity) {
  //  had it working, then added this inquirer prompt and it broke.  would love to hear what i did wrong================================================================================
    inquirer.prompt([{
      type:'confirm',
      message:'Are you sure:',
      name:'confirm',
      default: false
    }])
    .then((response) => {
      if (response.confirm) {
    stock_quantity = stock_quantity - purchase_quantity;
    connection.query('UPDATE products SET ? WHERE ?', [{stock_quantity: stock_quantity}, {item_id: answer.item_id}]);
    console.log('Your Purchase Price is: ' + purchasePrice);
    console.log('in stock: ' + purchasePrice);
    purchase_quantity = 0;
  } else {
    displayDB();
  }
})}

  else console.log('WE DONT HAVE ENOUGH');
  purchase_quantity = 0;
}
