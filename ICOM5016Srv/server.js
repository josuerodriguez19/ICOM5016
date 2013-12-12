// Express is the web framework 
var express = require('express');
var pg = require('pg');

var app = express();
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.configure(function () {
  app.use(allowCrossDomain);
});

var selectedSuperCategory;

app.use(express.bodyParser());

var user = require("./user.js");
var User = user.User;

var category = require("./category.js");
var Category = category.Category;

var book = require("./book.js");
var Book = book.Book;

var product = require("./product.js");
var Product = product.Product;

var conString = "pg://postgres:col8269@localhost:5432/mydb";


var productList = new Array(
	new Product("MyBook", "10.00", "1.47", "In good condition", "mymodel", "http://stanleyavenue.ultranet.school.nz/DataStore/Pages/CLASS_224/Docs/Documents/books3.jpg", "mybrand", "mydimension", "Books", "Fiction", 0),
	new Product("Rick's Sports Tips", "4.99", "3.00", "new", "mymodel", "http://users.rowan.edu/~hildeb54/sports-book.jpg", "mybrand", "mydimension", "Sports", "Wheels", 0),
	new Product("A Game of Thrones", "99.9", "90", "used", "mymodel", "http://media.boingboing.net/wp-content/uploads/2012/05/a-game-of-thrones-book-1-of-a-song-of-ice-and-fire.jpeg", "mybrand", "mydimension", "Books", "Fiction",1),
	new Product("Cooking With Manuel", "50", "0", "old", "mymodel", "http://cognitive-edge.com/uploads/blog/recipe%20book.png", "mybrand", "mydimension", "Books", "Fiction",1)

);

var categoryList = new Array(
	new Category("Books", "empty"),
	new Category("Electronics", "empty"),
	new Category("Computers", "empty"),
	new Category("Clothing", "empty"),
	new Category("Shoes", "empty"),
	new Category("Sports", "empty"),
	new Category("Children", "Books"),
	new Category("Fiction", "Books"),
	new Category("Technology", "Books"),
	new Category("Business", "Books"),
	new Category("TV", "Electronics"),
	new Category("Audio", "Electronics"),
	new Category("Phones", "Electronics"),
	new Category("Camera", "Electronics"),
	new Category("Video", "Electronics"),
	new Category("Bicycles", "Sports"),
	new Category("Frames", "Bicycles"),
	new Category("Wheels", "Bicycles"),
	new Category("Helmet", "Bicycles"),
	new Category("Parts", "Bicycles"),
	new Category("Laptops", "Computers"),
	new Category("Desktops", "Computers"),
	new Category("Tablets", "Computers"),
	new Category("Printers", "Computers"),
	new Category("Children", "Clothes"),
	new Category("Men", "Clothes"),
	new Category("Women", "Clothes"),
	new Category("Fishing", "Sports"),
	new Category("Baseball", "Sports"),
	new Category("Golf", "Sports"),
	new Category("Basketball", "Sports")
);




var userList = new Array(
	new User("Ramon", "Saldana", "ramon.saldana@upr.edu", "Urb El Cerezal", "ramelephant11", "arroz777", "c", "d", "e"),
	new User("Josue", "Rodriguez", "josue.rodriguez19@upr.edu", "habana", "jr", "123", "c", "d", "e")	
);

var userNextId = 0;
for (var i=0; i < userList.length;++i){
	userList[i].id = userNextId++;
}

var categoryNextId = 0;
for (var i=0; i < categoryList.length;++i){
	categoryList[i].id = categoryNextId++;
}

var productNextId = 0;
for (var i=0; i < productList.length;++i){
	productList[i].id = productNextId++;
}

var aProduct = productList[3];


//added by hector
var movies = require("./movies.js");
var Movies = movies.Movies;
var bids = require("./bids.js");
var Bids = bids.Bids;


//added by hector
var moviesList = new Array(
	new Movies("Iron Man 3", "2:15", "2013", "Tony Stark", "19.99"),
	new Movies("Fast And Furious 6", "2:10", "2013", "Toretto", "21.99")
);
var moviesNextId = 0;
for(var i = 0; i < moviesList.length; ++i){
	moviesList[i].id = moviesNextId++;
}
//added by Hector
var bidsList = new Array(
	new Bids("21","1","500","Laptop","Won","Bidder"),
	new Bids("21","2","200","Bicycle","1 day", "Bidder"),
	new Bids("21", "3","150","TV", "3 days", "Seller")
);
var bidsNextId = 0;
for(var i = 0; i < bidsList.length; ++i){
	bidsList[i].id = bidsNextId++;
}



// REST Operations
// Idea: Data is created, read, updated, or deleted through a URL that 
// identifies the resource to be created, read, updated, or deleted.
// The URL and any other input data is sent over standard HTTP requests.
// Mapping of HTTP with REST 
// a) POST - Created a new object. (Database create operation)
// b) GET - Read an individual object, collection of object, or simple values (Database read Operation)
// c) PUT - Update an individual object, or collection  (Database update operation)
// d) DELETE - Remove an individual object, or collection (Database delete operation)

app.get('/ClassDemo4Srv/cars', function(req, res) {
	console.log("GET LOL");
	//var tom = {"make" : "Ford", "model" : "Escape", "year" : "2013", "description" : "V4 engine, 30mpg, Gray", "price" : "$18,000"};
	//var tom = new Car("Ford", "Escape", "2013", "V4 engine, 30mpg, Gray", "$18,000");
	//console.log("tom: " + JSON.stringify(tom));
	
	var client = new pg.Client(conString);
	client.connect();

	var query = client.query("SELECT * from cars");
	
	query.on("row", function (row, result) {
    	result.addRow(row);
	});
	query.on("end", function (result) {
		var response = {"cars" : result.rows};
		console.log(result.rows);
		client.end();
  		res.json(response);
 	});
});


app.get('/ICOM5016Srv/categories', function(req, res) {
	console.log("CAT");
	var response = {"categories" : categoryList};
  	res.json(response);
});


//added By Ramon, october 30, 2013
//MAIN CATEGORIES GET
//This query gets all the categories that don't have any parents; meaning the main categories.

app.get('/ICOM5016Srv/categoriesTest', function(req, res) {
	var client = new pg.Client(conString);
	client.connect();
	var query = client.query("SELECT * from categories where cparent is NULL");
	query.on("row", function (row, result) {
    	result.addRow(row);
	});
	query.on("end", function (result) {
		var response = {"categories" : result.rows};
		client.end();
  		res.json(response);
 	});
});

//Added by Ramon, october 30, 2013
//SUBCATEGORY & PRODUCTS GET
//Method for browsing through subcategories. 
//The first query gets all the children of this category. If 0 subcategories are returned
//A second query looking for the corresponding products is executed. The second query selects 
//all the products where the cid from the category selected matches the cid of the product.

app.get('/ICOM5016Srv/categories2/:categoryID', function(req, res) {
	console.log("Browse Categories Start");
	var id = req.params.categoryID;
	var client = new pg.Client(conString);
	client.connect();
	var query = client.query("SELECT * from categories where cparent = $1", [id]);
	query.on("row", function (row, result) {
    	result.addRow(row);
	});
	query.on("end", function (result) {
		if(result.rowCount == 0){
			var query1 = client.query("SELECT * from products where cid = $1", [id]);
			query1.on("row", function (row, result) {
    		result.addRow(row);
			});
			query1.on("end", function (result) {
				var theCategories = "empty";
				var response = {"products" : result.rows, "categories" : theCategories};
				client.end();
  				res.json(response);
			});
		}else{
				var response = {"categories" : result.rows};
				client.end();
  				res.json(response);
  		}
 	});

 	console.log("Browse Categories End");
});

app.get('/ICOM5016Srv/bidHistory', function(req, res) {
	var response = {"bids" : bidsList};
  	res.json(response);
});


//added by Ramon, october 30, 2013
//PRODUCT INFO GET
//Queries the databse for a product that matches the selected product id.
app.get('/ICOM5016Srv/product/:id', function(req, res) {
	var id = req.params.id;
	var client = new pg.Client(conString);
	client.connect();
	var query = client.query("SELECT * from products where pid = $1", [id]);
	query.on("row", function (row, result) {
    	result.addRow(row);
	});
	query.on("end", function (result) {
		//results.rows returns an array of products, since result.rows in this case
		//has only one element, this element is what is going to be sent to the client
		var product = result.rows[0];
		var response = {"product" : product};
		client.end();
  		res.json(response);
 	});
});

app.get('/ICOM5016Srv/categories/:categoryID', function(req, res) {
	var id = req.params.categoryID;
	if ((id < 0) || (id >= categoryNextId)){
		// not found
		res.statusCode = 404;
		res.send("Category not found.");
	}
	else {
		var target = -1;
		for (var i=0; i < categoryList.length; ++i){
			if (categoryList[i].id == id){
				target = i;
				break;	
			}
		}
		if (target == -1){
			res.statusCode = 404;
			res.send("Category not found.");
		}
		else {
			//
			if(categoryList[target].mother == "empty")
			selectedSuperCategory = categoryList[target].name
			var theCategories = new Array();
			var theProducts = new Array();
			var temp = categoryList[target].name;
			for(var j = 0; j < categoryList.length; j++)
				if(categoryList[j].mother == temp){
					theCategories.push(categoryList[j])
				}
			if(theCategories.length == 0){
					for(var j = 0; j < productList.length; j++)
						if(productList[j].cCategory == categoryList[target].name && selectedSuperCategory == productList[j].mCategory){
						theProducts.push(productList[j]);
						}
					theCategories = "empty";
					console.log(theProducts);
					console.log(selectedSuperCategory);
					var tempProducts = new Array();
					tempProducts.push(aProduct);
					tempProducts.push(aProduct);
					tempProducts.push(aProduct);
					tempProducts.push(aProduct);
					tempProducts.push(aProduct);
					tempProducts.push(aProduct);

					var response = {"products" : tempProducts , "categories": theCategories};
  					res.json(response);	

			}else{	
			console.log(theCategories);
			var response = {"categories" : theCategories};
  			res.json(response);
  			}
  		}	
	}
});

app.get('/ICOM5016Srv/something', function(req, res) {
	var response = { "users" : userList};
	res.json(response);
});


app.post('/ICOM5016Srv/bid', function(req, res) {
	console.log("bidding on a product");

  	if(false) {
    	res.statusCode = 400;
    	return res.send('Error: Missing fields for user.');
  	}
  	console.log("succesful bid");
  	res.json(true);
});

//Added by Ramon
app.post('/ICOM5016Srv/user1', function(req, res) {
	console.log("Register User: Step 1 Start");
  	if(!req.body.hasOwnProperty('firstname') || !req.body.hasOwnProperty('lastname')
  	|| !req.body.hasOwnProperty('phone')) {
    	res.statusCode = 400;
    	return res.send('Error: Missing fields for user.');
  	}
  	var firstname = req.body.firstname;
  	var lastname = req.body.lastname;
  	var phone = req.body.phone;
 	var client = new pg.Client(conString);
	client.connect();
	var query1 = client.query("INSERT INTO users (firstname, lastname, phonenum) VALUES(\'" + firstname  +  "\',\'" + lastname  +"\',\'" + phone +"\')   RETURNING userid;");
	query1.on("row", function (row, result) {
		result.addRow(row);

	});
	query1.on("end", function (result) {
		var response = {"id" : result.rows[0].userid};
		client.end();
		res.json(response);
 	});
	console.log("Register User: Step 1 End");	
});

app.post('/ICOM5016Srv/user2/:id', function(req, res) {
	console.log("Register User: Step 2 Start");
	var id = req.params.id;
  	if(!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('password') || !req.body.hasOwnProperty('email')) {
    	res.statusCode = 400;
    	return res.send('Error: Missing fields for user.');
  	}
	var username = req.body.username;
  	var password = req.body.password;
  	var email = req.body.email;
 	var client = new pg.Client(conString);
	client.connect();
	var query1 = client.query("INSERT INTO account (username, password, email, typeaccount, userid) VALUES(\'" + username  +  "\',\'" + password  +"\',\'" + email +"\', \'"+ "user" +"\', \'"+ id +"\')   RETURNING accountid;");
	query1.on("row", function (row, result) {
		result.addRow(row);
	});
	query1.on("end", function (result) {
		var response = {"id" : result.rows[0].accountid};
		client.end();
		res.json(response);
 	});	
  	console.log("Register User: Step 2 End");
});

app.post('/ICOM5016Srv/user3', function(req, res) {
	console.log("POST 3");

  	if(!req.body.hasOwnProperty('accountNumber') || !req.body.hasOwnProperty('billingAddress')||!req.body.hasOwnProperty('CCinfo')) {
    	res.statusCode = 400;
    	return res.send('Error: Missing fields for user.');
  	}
	console.log("POST 3");
	
	var currentCar = userList.pop();
	currentCar.accountNumber = req.body.accountNumber;
	currentCar.billingAddress = req.body.billingAddress;
	currentCar.CCinfo = req.body.CCinfo;
	userList.push(currentCar);


  	res.json(true);
});

// REST Operation - HTTP GET to read a user based on its id - JR

//added by Josue, november 3, 2013
//USER  GET
//Queries the databse for a user that matches the selected user id.
//FALTA POR TERMINAR PARA HACER NATURAL JOINT CON DATA CONCRETA
app.get('/ICOM5016Srv/users/:id', function(req, res) {
    var id = req.params.id;
    var client = new pg.Client(conString);
    client.connect();
    console.log("1p");
    var query = client.query("select * from account where accountid = $1", [id]);
    query.on("row", function (row, result) {
        console.log("2p");
        result.addRow(row);
        console.log(result.rows);
    });
    query.on("end", function (result) {
        //results.rows returns an array of products, since result.rows in this case
        //has only one element, this element is what is going to be sent to the client
        console.log("hello 1");
        var account = result.rows[0];
        console.log("hello 2");
        var response = {"account" : account};
        console.log("hello 3");
        client.end();
            console.log("3p");
          res.json(response);
     });
});


// REST Operation - HTTP PUT to updated a user based on its id - JR (ayuda de Ramon)
app.put('/ICOM5016Srv/temp/:id', function(req, res) {
var id = req.params.id;
console.log("PUT user: " + id);

if ((id < 0) || (id >= userNextId)){
// not found

res.statusCode = 404;
res.send("User not found.");
}
else if(!req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('mail')
  || !req.body.hasOwnProperty('password') || !req.body.hasOwnProperty('accountNumber') || !req.body.hasOwnProperty('billingAddress') 
  || !req.body.hasOwnProperty('CCinfo')) {
    res.statusCode = 400;
   
    return res.send('Error: Missing fields for user.');
  }
else {
var target = -1;
for (var i=0; i < userList.length; ++i){
if (userList[i].id == id){

target = i;
break;	
}
}
if (target == -1){
res.statusCode = 404;

res.send("User not found.");	
}	
else {

var theUser= userList[target];
theUser.email = req.body.email;
theUser.mail = req.body.mail;
theUser.password = req.body.password;
theUser.accountNumber = req.body.accountNumber;
theUser.billingAdress = req.body.billingAdress;
theUser.CCinfo = req.body.CCinfo;
var response = {"user" : theUser};
  res.json(response);	
  }
}
});

// REST Operation - HTTP PUT to updated a product based on its id - JR 
app.put('/ICOM5016Srv/UpdateProduct/:id', function(req, res) {
var id = req.params.id;
console.log("PUT Product: " + id);

if ((id < 0) || (id >= productNextId)){
// not found
res.statusCode = 404;
res.send("User not found.");
}
else if(!req.body.hasOwnProperty('pName') || !req.body.hasOwnProperty('iPrice')
  || !req.body.hasOwnProperty('bPrice') || !req.body.hasOwnProperty('Description') || !req.body.hasOwnProperty('model') 
  || !req.body.hasOwnProperty('brand')) {
    res.statusCode = 400;
    return res.send('Error: Missing fields for user.');
  }
else {
var target = -1;
for (var i=0; i < productList.length; ++i){
if (productList[i].id == id){
target = i;
break;	
}
}
if (target == -1){
res.statusCode = 404;
res.send("Product not found.");	
}	
else {
var theProduct= productList[target];
theProduct.pName = req.body.pName;
theProduct.iPrice = req.body.iPrice;
theProduct.bPrice = req.body.bPrice;
theProduct.Description = req.body.Description;
theProduct.model = req.body.model;
theProduct.brand = req.body.brand;
var response = {"product" : theProduct};
  res.json(response);	
  }
}
});


// REST Operation - HTTP POST to add a new product - JR 4/10/13
app.post('/ICOM5016Srv/products/:id', function(req, res) {
	console.log("Selling Form Start");
  	if(!req.body.hasOwnProperty('pName') || !req.body.hasOwnProperty('model')
  	|| !req.body.hasOwnProperty('brand') || !req.body.hasOwnProperty('dimensions')   
  	|| !req.body.hasOwnProperty('desc') || !req.body.hasOwnProperty('photo')
  	|| !req.body.hasOwnProperty('iPrice') || !req.body.hasOwnProperty('bPrice')) {
    	res.statusCode = 400;
    	return res.send('Error: Missing fields for product.');
  	}
  	var pname = req.body.pName;
  	var pmodel = req.body.model;
  	var pbrand = req.body.brand;
  	var pdimensions = req.body.dimensions;
  	var pdescription = req.body.desc;
  	var pimage_filename = req.body.photo;
  	var pinstant_price = req.body.iPrice;
  	var userid = req.params.id;
  	var myCat = req.body.select0;
  	var auction2 = req.body.checkbox2;
  	console.log(auction2);
  	var auction3 = req.body.checkbox3;
  	console.log(auction3);
 	var client = new pg.Client(conString);
    client.connect();
  	var query1 = client.query("INSERT INTO products (pname, pinstant_price, pmodel, pbrand, pdescription, pimage_filename, pdimensions, userid, pcategory, cid) VALUES(\'" + pname  +  "\',\'" + pinstant_price  +"\',\'" + pmodel +"\',\'" + pbrand +"\',\'" + pdescription +"\',\'" + pimage_filename +"\',\'" + pdimensions +"\',\'" + userid +"\',\'" + 1 +"\',\'" + myCat +"\');");
	query1.on("row", function (row, result) {
	});
	query1.on("end", function (result) {
		client.end();
 	});
  	res.json(true);
  	console.log("Selling Form End");
});

// REST Operation - HTTP GET to read all selling products - JR 4/10/13
app.get('/Icom5016Srv/sellingproducts/:userid', function(req, res) {
	var watching;
	var buying;
	var selling;
	var userid = req.params.userid;

	var client = new pg.Client(conString);
	client.connect();

	//WATCHING QUERY
	var query1 = client.query("select distinct pid, pname, pinstant_price, pmodel, pbrand, pdescription, pimage_filename, pdimensions, pcategory, cid, userid from auction natural join products natural join bid where buyerid = '" + userid + "' order by pname");
	query1.on("row", function (row, result) {
    	result.addRow(row);
	});
	query1.on("end", function (result) {
		watching = result.rows;
		console.log("watching query");
		console.log(watching);
 	});

 	//BUYING QUERY
	var query2 = client.query("select distinct pid, pname, pinstant_price, pmodel, pbrand, pdescription, pimage_filename, pdimensions, pcategory, cid, userid from productsold natural join products where buyerid = '" + userid + "' order by pname");
	query2.on("row", function (row, result) {
    	result.addRow(row);
	});
	query2.on("end", function (result) {
		buying = result.rows;
		console.log("buying query");
		console.log(buying);
 	});

	//SELLING QUERY
 	var query3 = client.query("select * from products where userid = '" + userid + "' order by pname");
	query3.on("row", function (row, result) {
    	result.addRow(row);
	});
	query3.on("end", function (result) {
		selling = result.rows;
		console.log("selling query");
 		var response = {"watching" : watching, "selling" : selling, "buying": buying };
 		client.end();
		res.json(response);	
 	});
	
});

//fase3h
app.get('/ICOM5016Srv/rating/:rate/:pid/:sellerid/:buyerid/:price', function(req, res) {
  console.log("Entered rate");
	var rate = req.params.rate;      
	var pid = req.params.pid;
	var sellerid = req.params.sellerid;
	var buyerid = req.params.buyerid;
	var price = req.params.price;
	var orderid;
	var avgrating;
	console.log("post rate: " + rate + "" + pid + "" + sellerid + "" + buyerid + "" + price);
	var client = new pg.Client(conString);
	client.connect();
	
	var query1 = client.query("select orderid from orders where pid = '" + pid + "'");
	query1.on("row", function (row, result) {
    	result.addRow(row);
	});
	query1.on("end", function (result) {
		orderid = result.rows[0].orderid;
		console.log("rate: " + rate );
 			console.log("orderid: " + orderid);

var query2 = client.query("insert into productsold(pid, sellerid, buyerid,daysold, price, orderid, rating) VALUES('" + pid + "', '" + sellerid + "', '" +  buyerid + "', (select current_date), '" + price + "', '" + orderid + "', '" + rate + "')");
	query2.on("row", function (row, result) {
    	result.addRow(row);
	});
	query2.on("end", function (result) {
		
		console.log("Add rating complete");
 		
 		
			
 	});

var query3 = client.query("select avg(rating) as avgrating from productsold where sellerid = '" + sellerid + "'");
	query3.on("row", function (row, result) {
    	result.addRow(row);
	});
	query3.on("end", function (result) {
		avgrating = result.rows[0].avgrating;
		console.log("get avg for user complete");
 		
	var query4 = client.query("UPDATE users SET avgrating = '" + avgrating + "' where userid = '" + sellerid + "'");
	query4.on("row", function (row, result) {
    	result.addRow(row);
	});
	query4.on("end", function (result) {
		
		console.log("set avg for user complete");

			
 	});	
			
 	});
var query5 = client.query("DELETE FROM products WHERE pid = '" + pid + "'");
	query5.on("row", function (row, result) {
    	result.addRow(row);
	});
	query5.on("end", function (result) {
		
		console.log("set avg for user complete");
 		
		
 		client.end();
			
 	});	


res.json(true);
 	});
	
	
});



//Added by Hector
//Modified by Ramon, october 30, 2013
//SEARCH BAR GET
//Queries the database for products who's pname match or 
//are "like" the string written in the search bar.

app.get('/ICOM5016Srv/search/:searchWord', function(req, res) {

var searchWord = req.params.searchWord;
console.log("search");
	var client = new pg.Client(conString);
	client.connect();
	var query = client.query("SELECT * from products where pname ilike '%"+searchWord+"%'");
	query.on("row", function (row, result) {
    	result.addRow(row);
	});
	query.on("end", function (result) {
		var response = {"products" : result.rows};
		console.log(result.rows);
		client.end();
  		res.json(response);
 	});
});


app.get('/ICOM5016Srv/selling_form_get_categories', function(req, res) {
	console.log("Selling Form Get Categories Start");
	var client = new pg.Client(conString);
	client.connect();
	var query = client.query("SELECT * from categories");
	query.on("row", function (row, result) {
    	result.addRow(row);
	});
	query.on("end", function (result) {
		var response = {"categories" : result.rows};
		client.end();
  		res.json(response);
 	});
 	console.log("Selling Form Get Categories End");
});

//Added by Hector
app.get('/ICOM5016Srv/movie/:id', function(req, res) {
	var id = req.params.id;
		console.log("Get Movie by id");

	if ((id < 0) || (id >= moviesNextId)){
		// not found
		res.statusCode = 404;
		res.send("not found.");
	}
	else {
		var target = -1;
		for (var i=0; i < moviesList.length; ++i){
			if (moviesList[i].id == id){
				target = i;
				break;	
			}
		}
		if (target == -1){
			res.statusCode = 404;
			res.send("Movie not found.");
		}
		else {
			console.log("Server: Get Category");
			var response = {"movie" : moviesList[target]};
  			res.json(response);	
  		}	
	}
});

//Added by Hector
app.post('/ICOM5016Srv/addCategory', function(req, res) {
	console.log("Server: addCategory");
	
	//alert("Category Added");
  	res.json(true);
});
//added by Hector
app.del('/ICOM5016Srv/deleteCategory/:id', function(req, res) {
		console.log("Server: Delete Category");

  			res.json(true);
  				
	
});
//added by Hector
app.put('/ICOM5016Srv/modifyUser/:id', function(req, res) {
			console.log("Server: ModifyUser");
  			res.json(true);		
  	
});


//added by Hector
app.get('/ICOM5016Srv/bids', function(req, res) {
	console.log("getting bids");
	var response = {"bids" : bidsList};
  	res.json(response);
});

app.get('/ICOM5016Srv/bids/:id', function(req, res) {
	var id = req.params.id;
		console.log("getting bid by id");

	if ((id < 0) || (id >= bidsNextId)){
		// not found
		res.statusCode = 404;
		res.send("not found.");
	}
	else {
		var target = -1;
		for (var i=0; i < bidsList.length; ++i){
			if (bidsList[i].id == id){
				target = i;
				break;	
		}
		}
		if (target == -1){
			res.statusCode = 404;
			res.send("Bid not found.");
		}
		else {
			var response = {"bid" : bidsList[target]};
  			res.json(response);	
  		}	
	}
});


// REST Operation - HTTP DELETE to delete a user based on its id
app.del('/ICOM5016/deleteUser/:id', function(req, res) {
	var id = req.params.id;
		console.log("DELETE user: " + id);

	if ((id < 0) || (id >= userNextId)){
		// not found
		res.statusCode = 404;
		res.send("User not found.");
	}
	else {
		var target = -1;
		for (var i=0; i < userList.length; ++i){
			if (userList[i].id == id){
				target = i;
				break;	
			}
		}
		if (target == -1){
			res.statusCode = 404;
			res.send("User not found.");			
		}	
		else {
			userList.splice(target, 1);
  			res.json(true);
  		}		
	}
});


//added by Ramon, november 3, 2013
//USER AUTHENTICATION GET
app.post('/ICOM5016Srv/authenticate', function(req, res) {
	console.log("start authentication");
  	if(!req.body.hasOwnProperty('user_name') || !req.body.hasOwnProperty('password2')) {
    	res.statusCode = 400;
    	return res.send('Error: Missing fields for user.');
  	}
	var username = req.body.user_name;
	var password = req.body.password2;
	var match = false;
  	var client = new pg.Client(conString);
	client.connect();
	var query = client.query("SELECT * from account natural join users where username = $1 and password = $2", [username, password]);
	query.on("row", function (row, result) {
    	result.addRow(row);
	});
	query.on("end", function (result) {
			if(result.rowCount > 0){
				var response = {"user" : result.rows[0]};
				match = true;
			}
		client.end();
		if(match){
		console.log("end authentication");
		res.json(response);
	}
		else{	
			res.statusCode = 400;
    		return res.send('No match found');
		}
 	});
});

//added by Ramon modified by hector cause he is better 
//this query gets the shopping cart items of the current user
app.get('/ICOM5016Srv/getCart/:userid', function(req, res) {
	console.log("getCart()");
	var client = new pg.Client(conString);
	client.connect();
	var userid = req.params.userid;
	//this query needs to be changed accordingly
	var query = client.query("select * from shopping_cart natural join products where buyerid = '" + userid + "'");
	query.on("row", function (row, result) {
    	result.addRow(row);
	});
	query.on("end", function (result) {
		var response = {"products" : result.rows};
		console.log("end getCart()");
		client.end();
  		res.json(response);
 	});
});

app.get('/ICOM5016Srv/UserInfo/:id', function(req, res) {
	var cc;
	var shipping;
	var billing;
	console.log("user info start");
	var id = req.params.id;
	var client = new pg.Client(conString);
	client.connect();

	//CREDIT CARD QUERY
	var query1 = client.query("SELECT * from creditcard natural join users natural join account  where userid = $1", [id]);
	query1.on("row", function (row, result) {
    	result.addRow(row);
	});
	query1.on("end", function (result) {
		cc = result.rows;
		console.log(cc);
 	});

	//SHIPPING ADRESS QUERY
	var query2 = client.query("SELECT * from shipping_adress natural join users natural join account  where userid = $1", [id]);
	query2.on("row", function (row, result) {
    	result.addRow(row);
	});
	query2.on("end", function (result) {
		shipping = result.rows;
		console.log(shipping);
 	});

 	//BILLING ADRESS QUERY
 	var query3 = client.query("SELECT * from billing_adress natural join users natural join account  where userid = $1", [id]);
	query3.on("row", function (row, result) {
    	result.addRow(row);
	});
	query3.on("end", function (result) {
		billing = result.rows;
		var response = {"creditcard" : cc, "shipping": shipping, "billing" : billing};
		console.log(response);
		console.log("user info end");
		client.end();
  		res.json(response);
 	});


});

//added by ramon
app.get('/ICOM5016Srv/SellerInfo/:id', function(req, res) {
	console.log("Seller Info Start");
	var id = req.params.id;
	console.log("ID" + id);
	var seller;
	var otherProducts;
	var sellerid;
	var client = new pg.Client(conString);
	client.connect();
	//this query needs to be changed accordingly
	var query = client.query("SELECT * from products natural join account natural join users where pid = $1", [id]);
	query.on("row", function (row, result) {
    	result.addRow(row);
	});
	query.on("end", function (result) {
		seller = result.rows;
		console.log(result.rows);
		sellerid = result.rows[0].userid;

		var query2 = client.query("SELECT * from products where userid = '" + sellerid + "'");
		query2.on("row", function (row, result) {
    		result.addRow(row);
		});
		query2.on("end", function (result) {
		otherProducts = result.rows;
		console.log(result.rows);
		var response = {"seller" : seller, "otherProducts": otherProducts};
		console.log("Seller Info End");
		console.log(response);
		client.end();
  		res.json(response);
 	});
 	});
});

app.get('/ICOM5016Srv/BidHistory/:id', function(req, res) {
	console.log("bid history product start");
	var id = req.params.id;
	var client = new pg.Client(conString);
	client.connect();
	//this query needs to be changed accordingly
	var query = client.query("SELECT * from auction natural join bid  where pid = $1", [id]);
	query.on("row", function (row, result) {
    	result.addRow(row);
	});
	query.on("end", function (result) {
		console.log(" PRODUCT ID NIGGA " + id);
		var response = {"bidHistory" : result.rows};
		console.log(response);
		console.log("end bid history product");
		client.end();
  		res.json(response);
 	});
});






//added by Hector////////////////////////////////////////////////////////////////////////////////////////////////
//This function is to get the total sales by month, week or day//////////////////////////////////////////////////
app.get('/ICOM5016Srv/totalsales/:year/:month/:day/:radio', function(req, res) {
			
	var year = req.params.year;
	var month = req.params.month;
	var day = req.params.day; 
	var radio = req.params.radio;
	console.log("day: " + day);
	console.log("Month: " + month);
	console.log("year: " + year);

			console.log("Server: Get total sales");
  	var client = new pg.Client(conString);
	client.connect();
	if(radio == "day"){
			console.log("radio button day");
		
			var daysold = year + "-" + month + "-" + day;
			var query = client.query("Select Count(*) as count From productsold Where daysold = '" + daysold + "'");
			query.on("row", function (row, result) {
    			result.addRow(row);
			});
			query.on("end", function (result) {
			console.log("count: " + result.rows[0].count);
			var response = {"totalsales" : result.rows};
			client.end();
  			res.json(response);
 	});	
			
		
		
	
	}
	else if(radio == "week"){
		console.log("radio button week");
		
			var daysold = year + "-" + month + "-" + day;
			var query = client.query("SELECT count(*) AS count FROM productsold WHERE EXTRACT(Week from daysold) = (SELECT EXTRACT(week FROM DATE '" + daysold + "'))");
			query.on("row", function (row, result) {
    			result.addRow(row);
			});
			query.on("end", function (result) {
			console.log("count: " + result.rows[0].count);
			var response = {"totalsales" : result.rows};
			client.end();
  			res.json(response);
			});
	}
	else{
		console.log("radio button month");
		
			
			var query = client.query("SELECT Count(*) AS count FROM productsold WHERE EXTRACT(Year from daysold) = '" + year + "' AND EXTRACT(Month from daysold) = '" + month + "'");
			query.on("row", function (row, result) {
    			result.addRow(row);
			});
			query.on("end", function (result) {
			console.log("count: " + result.rows[0].count);
			var response = {"totalsales" : result.rows};
			client.end();
  			res.json(response);
			});
	}
	
});


//added by Hector////////////////////////////////////////////////////////////////////////////////////////////////
//This function is to get the total sales by Product month, week or day//////////////////////////////////////////////////
app.get('/ICOM5016Srv/totalsalesProduct/:year/:month/:day/:radio', function(req, res) {
			
	var year = req.params.year;
	var month = req.params.month;
	var day = req.params.day; 
	var radio = req.params.radio;
	console.log("day: " + day);
	console.log("Month: " + month);
	console.log("year: " + year);

			console.log("Server: Get total sales By Product");
  	var client = new pg.Client(conString);
	client.connect();
	if(radio == "day"){
			console.log("radio button day");
		
			var daysold = year + "-" + month + "-" + day;
			var query = client.query("SELECT pname AS product, count(*) AS total FROM products NATURAL JOIN productsold WHERE daysold = '" + daysold + "' GROUP BY product ORDER BY product");
			query.on("row", function (row, result) {
    			result.addRow(row);

			});

			query.on("end", function (result) {
			var response = {"totalsalesProduct" : result.rows};
			client.end();
  			res.json(response);
 	});	
			
		
		
	
	}
	else if(radio == "week"){
		console.log("radio button week");
		
			var daysold = year + "-" + month + "-" + day;
			var query = client.query("SELECT pname AS product, count(*) AS total FROM products NATURAL JOIN productsold WHERE EXTRACT(Week from daysold) = (SELECT EXTRACT(week FROM DATE '" + daysold + "')) GROUP BY product ORDER BY product");
			query.on("row", function (row, result) {
    			result.addRow(row);
			});
			query.on("end", function (result) {
			
			var response = {"totalsalesProduct" : result.rows};
			client.end();
  			res.json(response);
			});
	}
	else{
		console.log("radio button month");
		
			
			var query = client.query("SELECT pname AS product, count(*) AS total FROM products NATURAL JOIN productsold WHERE EXTRACT(Year from daysold) = '" + year + "' AND EXTRACT(Month from daysold) = '" + month + "' GROUP BY product ORDER BY product");
			query.on("row", function (row, result) {
    			result.addRow(row);
			});
			query.on("end", function (result) {
			var response = {"totalsalesProduct" : result.rows};
			client.end();
  			res.json(response);
			});
	}
	
});


//added by Hector//////////////////////////////////////////////////////////////////////////////////////////////////////////
//This function is to get the total Revenue by Product month, week or day//////////////////////////////////////////////////
app.get('/ICOM5016Srv/totalrevenueProduct/:year/:month/:day/:radio', function(req, res) {
			
	var year = req.params.year;
	var month = req.params.month;
	var day = req.params.day; 
	var radio = req.params.radio;
	console.log("day: " + day);
	console.log("Month: " + month);
	console.log("year: " + year);

			console.log("Server: Get total Revenue by Product");
  	var client = new pg.Client(conString);
	client.connect();
	if(radio == "day"){
			console.log("radio button day");
		
			var daysold = year + "-" + month + "-" + day;
			var query = client.query("SELECT pname AS product, sum(price) AS revenue FROM products NATURAL JOIN productsold WHERE daysold = '" + daysold  + "' GROUP BY product ORDER BY product");
			query.on("row", function (row, result) {
    			result.addRow(row);
			});
			query.on("end", function (result) {
			var response = {"totalrevenueProduct" : result.rows};
			client.end();
  			res.json(response);
 	});	
			
		
		
	
	}
	else if(radio == "week"){
		console.log("radio button week");
		
			var daysold = year + "-" + month + "-" + day;
			var query = client.query("SELECT pname AS product, sum(price) AS revenue FROM products NATURAL JOIN productsold WHERE EXTRACT(Week from daysold) = (SELECT EXTRACT(week FROM DATE '" + daysold + "')) GROUP BY product ORDER BY product");
			query.on("row", function (row, result) {
    			result.addRow(row);
			});
			query.on("end", function (result) {
			
			var response = {"totalrevenueProduct" : result.rows};
			client.end();
  			res.json(response);
			});
	}
	else{
		console.log("radio button month");
		
			
			var query = client.query("SELECT pname AS product, sum(price) AS revenue FROM products NATURAL JOIN productsold WHERE EXTRACT(Year from daysold) = '" + year + "' AND EXTRACT(Month from daysold) = '" + month + "' GROUP BY product ORDER BY product");
			query.on("row", function (row, result) {
    			result.addRow(row);
			});
			query.on("end", function (result) {
			var response = {"totalrevenueProduct" : result.rows};
			client.end();
  			res.json(response);
			});
	}
	
});

app.get('/ICOM5016Srv/Order/:id/:uid', function(req, res) {
	var id = req.params.id;
	var uid = req.params.uid;
	var order;
	var billing;
	// INSERT INTO users (firstname, lastname, phonenum) VALUES(\'" + firstname  +  "\',\'" + lastname  +"\',\'" + phone +"\')   RETURNING userid;"
	console.log("order get start");
	var client = new pg.Client(conString);
	client.connect();
	var query1 = client.query("INSERT INTO orders (pid, accountid) VALUES(\'"+ id +"\', \'"+ uid +"\') RETURNING orderid, pid, accountid");
	query1.on("row", function (row, result) {
    	result.addRow(row);
	});
	query1.on("end", function (result) {
		order = result.rows[0];
 	});
	var query2 = client.query("SELECT * from creditcard natural join account natural join users where userid = $1", [uid]);
	query2.on("row", function (row, result) {
    	result.addRow(row);
	});
	query2.on("end", function (result) {
		billing = result.rows;
		var response = {"order" : order, "billing": billing};
		client.end();
		console.log(order);
		console.log(billing)
		console.log("order end");
  		res.json(response);
 	});


});

//added by Ramon
//ESTO SIRVE LKJSLJGDLKGDFJGL
app.get('/ICOM5016Srv/Invoice/:id/:orderid', function(req, res) {
	console.log("invoice start");
	var id = req.params.id;
	var orderid = req.params.id;
	var client = new pg.Client(conString);
	var accountid;
	var invoiceInfo;
	client.connect();
	var query = client.query("INSERT INTO invoice (orderid, duedate, invdate, billid, totalprice) VALUES(\'"+ orderid +"\', \'"+ "2013-06-20" +"\', \'"+ "2013-06-20" +"\', \'"+ 1 +"\', \'"+ 3.99 +"\') RETURNING invid, totalprice, billid, duedate, invdate ");
	query.on("row", function (row, result) {
    	result.addRow(row);
	});
	query.on("end", function (result) {
		invoiceInfo = result.rows[0];
		accountid = result.rows[0].accountid;
		var query1 = client.query("select * from shipping_adress where accountid = $1", [accountid]);
		query1.on("row", function (row, result) {
    		result.addRow(row);
	});
	query1.on("end", function (result) {
		var response = {"invoice": invoiceInfo , "shipping": result.rows[0]};
		client.end();
		console.log(response);
		console.log("order end");
  		res.json(response);
 	});
 	});
	

	console.log("invoice end");
});


//added by hector
//this gets the order products from the shopping cart that the user wants to buy
app.get('/ICOM5016Srv/OrderCart/:userid', function(req, res) {
	console.log("entered Order Cart");
	var client = new pg.Client(conString);
	client.connect();
	var userid = req.params.userid;
	var orderProducts;
	var billing;
	//this query needs to be changed accordingly
	var query = client.query("select * from shopping_cart natural join products where buyerid = '" + userid + "'");
	query.on("row", function (row, result) {
    	result.addRow(row);
	});
	query.on("end", function (result) {
		orderProducts = result.rows;
 	});
	
	var query2 = client.query("SELECT * from creditcard natural join account natural join users where userid = '" + userid + "'");
	query2.on("row", function (row, result) {
    	result.addRow(row);
	});
	query2.on("end", function (result) {
		billing = result.rows;
		var response = {"OrderCart" : orderProducts, "billing": billing};
		client.end();
  		res.json(response);
 	});
});










app.post('/ICOM5016Srv/addcreditcard/:id', function(req, res) {
var id = req.params.id;
  
console.log("Add Credit Card Start");
  if(!req.body.hasOwnProperty('crednum') || !req.body.hasOwnProperty('secnum')
  || !req.body.hasOwnProperty('expdate')) {
    res.statusCode = 400;
    return res.send('Error: Missing fields for user.');
  }
   
  var crednum = req.body.crednum;
  var secnum = req.body.secnum;
  var expdate = req.body.expdate;
 var client = new pg.Client(conString);
client.connect();
var query1 = client.query("INSERT INTO creditcard (accountid, crednum, secnum, expdate) VALUES(\'" + id  +  "\',\'" + crednum  +  "\',\'"  + secnum + "\',\'" + expdate +"\')   RETURNING credid, accountid;");
query1.on("row", function (row, result) {
result.addRow(row);
   
});
query1.on("end", function (result) {
var response = {"id" : result.rows[0].credid, "accountid" : result.rows[0].accountid};
client.end();
res.json(response);
     });
console.log("Credit Card Added");   
});


app.post('/ICOM5016Srv/addshippingaddress/:id', function(req, res) {

var id = req.params.id;
   
console.log("Add Shipping Address Start");
  if(!req.body.hasOwnProperty('urb') || !req.body.hasOwnProperty('numhouse')
  || !req.body.hasOwnProperty('street') || !req.body.hasOwnProperty('city')
  || !req.body.hasOwnProperty('zipcode') || !req.body.hasOwnProperty('country')) {
    res.statusCode = 400;
    
    return res.send('Error: Missing fields for user.');
  }
    
  var urb = req.body.urb;
  var numhouse = req.body.numhouse;
  var street = req.body.street;
  var city = req.body.city;
  var zipcode = req.body.zipcode;
  var country = req.body.country;
     var client = new pg.Client(conString);
client.connect();
var query1 = client.query("INSERT INTO shipping_adress (accountid, urb, numhouse, street, city, zipcode, country) VALUES(\'" + id  +  "\',\'" + urb  +  "\',\'"  + numhouse + "\',\'" + street + "\',\'" +  city +  "\',\'"  + zipcode + "\',\'" + country +"\')   RETURNING shipid;");
query1.on("row", function (row, result) {
result.addRow(row);
   
});
query1.on("end", function (result) {
var response = {"id" : result.rows[0].shipid};
client.end();
res.json(response);
     });
console.log("Shipping Address Added");   
});

app.post('/ICOM5016Srv/addbillingaddress/:id/:cdid', function(req, res) {

var id = req.params.id;
var cid = req.params.cdid;
console.log("Add Billing Address Start");
  if(!req.body.hasOwnProperty('urb') || !req.body.hasOwnProperty('numhouse')
  || !req.body.hasOwnProperty('street') || !req.body.hasOwnProperty('city')
  || !req.body.hasOwnProperty('zipcode') || !req.body.hasOwnProperty('country')) {
    res.statusCode = 400;
  
    return res.send('Error: Missing fields for user.');
  }
    
  var urb = req.body.urb;
  var numhouse = req.body.numhouse;
  var street = req.body.street;
  var city = req.body.city;
  var zipcode = req.body.zipcode;
  var country = req.body.country;
     var client = new pg.Client(conString);
client.connect();
var query1 = client.query("INSERT INTO billing_adress (accountid, urb, numhouse, street, city, zipcode, country, credid) VALUES(\'" + id  +  "\',\'" + urb  +  "\',\'"  + numhouse + "\',\'" + street + "\',\'" +  city +  "\',\'"  + zipcode + "\',\'" + country + "\',\'" + cid +"\')   RETURNING billid;");
query1.on("row", function (row, result) {
result.addRow(row);
   
});
query1.on("end", function (result) {
var response = {"id" : result.rows[0].billid};
client.end();
res.json(response);
     });
console.log("Billing Address Added");   
});







app.get('/ICOM5016Srv/getcreditcard/:id', function(req, res) {
    var cc;

    console.log("credit card star");
    var id = req.params.id;
    var client = new pg.Client(conString);
    client.connect();
console.log("credit card star1");
    //CREDIT CARD QUERY
    var query1 = client.query("SELECT * from creditcard natural join account where userid = $1", [id]);
    query1.on("row", function (row, result) {
        result.addRow(row);
    });
    console.log("credit card star2");
    query1.on("end", function (result) {
        console.log("credit card star5");
        cc = result.rows;
        console.log("credit card star6");
        console.log(cc);
        console.log("credit card star3");
        var response = {"creditcard" : cc};
        console.log(response);
        console.log("credit card end");
        client.end();
          res.json(response);
     });
   

});



app.get('/ICOM5016Srv/getshippingaddress/:id', function(req, res) {
    var cc;

    console.log("shipping address star");
    var id = req.params.id;
    var client = new pg.Client(conString);
    client.connect();
console.log("credit card star1");
    //CREDIT CARD QUERY
    var query1 = client.query("SELECT * from shipping_adress natural join account where userid = $1", [id]);
    query1.on("row", function (row, result) {
        result.addRow(row);
    });
    console.log("credit card star2");
    query1.on("end", function (result) {
        console.log("credit card star5");
        cc = result.rows;
        console.log("credit card star6");
        console.log(cc);
        console.log("credit card star3");
        var response = {"shipping_adress" : cc};
        console.log(response);
        console.log("shipping address end");
        client.end();
          res.json(response);
     });
   

});


app.get('/ICOM5016Srv/putCart/:buyerid/:pid', function(req, res) {
	console.log("put in cart");
	var client = new pg.Client(conString);
	client.connect();
	var buyerid = req.params.buyerid;
	var pid = req.params.pid;
	//this query needs to be changed accordingly
	var query = client.query("insert into shopping_cart(pid,buyerid) VALUES('" + pid + "', '" + buyerid + "')");
	query.on("row", function (row, result) {
    	result.addRow(row);
	});
	query.on("end", function (result) {
		
		console.log("end put in cart");
		client.end();
  		res.json(true);
 	});
});


// Server starts running when listen is called.
app.listen(process.env.PORT || 3412);
console.log("server listening");


