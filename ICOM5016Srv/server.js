// Express is the web framework 
var express = require('express');
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

app.get('/ICOM5016Srv/categories', function(req, res) {
	console.log("CAT");
	var response = {"categories" : categoryList};
  	res.json(response);
});

app.get('/ICOM5016Srv/bidHistory', function(req, res) {
	var response = {"bids" : bidsList};
  	res.json(response);
});

app.get('/ICOM5016Srv/product/:id', function(req, res) {
	var id = req.params.id;
		console.log("hello ramon!");

	if ((id < 0) || (id >= productNextId)){
		// not found
		res.statusCode = 404;
		res.send("not found.");
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
			res.send("Car not found.");
		}
		else {
			var response = {"product" : productList[target]};
  			res.json(response);	
  		}	
	}
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

app.post('/ICOM5016Srv/user1', function(req, res) {
	console.log("POST 1");

  	if(!req.body.hasOwnProperty('firstname') || !req.body.hasOwnProperty('lastname')
  	|| !req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('mail')) {
    	res.statusCode = 400;
    	return res.send('Error: Missing fields for user.');
  	}

  	var newUser = new User(req.body.firstname, req.body.lastname, req.body.email, req.body.mail, "","","","","");
  	newUser.id = userNextId++;
  	console.log("New LOL: " + JSON.stringify(newUser));
  	userList.push(newUser);
  	res.json(true);
});

app.post('/ICOM5016Srv/user2', function(req, res) {
	console.log("POST 2");

  	if(!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('password')) {
    	res.statusCode = 400;
    	return res.send('Error: Missing fields for user.');
  	}
	console.log("POST 3");
	
	var currentCar = userList.pop();
	currentCar.username = req.body.username;
	currentCar.password = req.body.password;
	userList.push(currentCar);

  	console.log("New LOL: " + JSON.stringify(currentCar));
  	res.json(true);
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

  	console.log("New LOL: " + JSON.stringify(currentCar));
  	res.json(true);
});

// REST Operation - HTTP GET to read a user based on its id - JR
app.get('/ICOM5016Srv/users/:id', function(req, res) {
var id = req.params.id;
console.log("GET user: " + id);

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
var response = {"user" : userList[target]};
 
  res.json(response);	
 

  }	
}
});

// REST Operation - HTTP PUT to updated a user based on its id - JR (ayuda de Ramon)
app.put('/ICOM5016Srv/temp/:id', function(req, res) {
var id = req.params.id;
console.log("PUT user: " + id);

if ((id < 0) || (id >= userNextId)){
// not found
console.log("1");
res.statusCode = 404;
res.send("User not found.");
}
else if(!req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('mail')
  || !req.body.hasOwnProperty('password') || !req.body.hasOwnProperty('accountNumber') || !req.body.hasOwnProperty('billingAddress') 
  || !req.body.hasOwnProperty('CCinfo')) {
    res.statusCode = 400;
    console.log("2");
    return res.send('Error: Missing fields for user.');
  }
else {
var target = -1;
for (var i=0; i < userList.length; ++i){
if (userList[i].id == id){
console.log("3");
target = i;
break;	
}
}
if (target == -1){
res.statusCode = 404;
console.log("4");
res.send("User not found.");	
}	
else {
console.log("5");
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
app.post('/ICOM5016Srv/products', function(req, res) {

  	if(!req.body.hasOwnProperty('pName') || !req.body.hasOwnProperty('model')
  	|| !req.body.hasOwnProperty('brand') || !req.body.hasOwnProperty('dimensions')   
  	|| !req.body.hasOwnProperty('desc') || !req.body.hasOwnProperty('photo')
  	|| !req.body.hasOwnProperty('iPrice') || !req.body.hasOwnProperty('bPrice')) {
    	res.statusCode = 400;
    	return res.send('Error: Missing fields for product.');
  	}
  	var newProduct = new Product(req.body.pName, req.body.iPrice, req.body.bPrice, req.body.desc, req.body.model, req.body.photo, req.body.brand, req.body.dimensions );
  	console.log("New Selling Product: " + JSON.stringify(newProduct));
  	newProduct.id = productNextId++;
  	productList.push(newProduct);
  	res.json(true);
});

// REST Operation - HTTP GET to read all selling products - JR 4/10/13
app.get('/Icom5016Srv/sellingproducts', function(req, res) {
	console.log("GET");
	var response = {"products" : productList};
  	res.json(response);
});



// Server starts running when listen is called.
app.listen(process.env.PORT || 3412);
console.log("server listening");


app.post('/ICOM5016Srv/rating', function(req, res) {
    console.log("rating the damn user");

      if(!req.body.hasOwnProperty('radio')) {
        res.statusCode = 400;
        console.log(req.body.radio);
        console.log("huehuehuehuehue");
        return res.send('Error: Missing fields for user.');
      }

  //    var newUser = new User(req.body.firstname, req.body.lastname, req.body.email, req.body.mail, "","","","","");
  //    newUser.id = userNextId++;
  //    console.log("New LOL: " + JSON.stringify(newUser));
  //    userList.push(newUser);
      res.json(true);
});



//Added by Hector
app.get('/ICOM5016Srv/movies', function(req, res) {
	console.log("GET Movies List");
	console.log("Movies list length " + productList.length);
	var response = {"products" : productList};
  	res.json(response);
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
app.get('/ICOM5016Srv/reports', function(req, res) {
			
			console.log("Server: Get Reports");
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