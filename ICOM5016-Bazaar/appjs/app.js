
//Global variables

var currentSignedIn = "";
var currentCategory = {};
var currentProducts = {};
var selectedProduct = {};
var currentUser = {};
var view = 1;
var shoppingCartIDs = new Array();
var myBidHistory = {};
var currentBid = {};
var watching = {};
var buying = {};
var selling = {};
var userBillingAdress = {};
var userPaymentOptions = {};
var userShippingAdress = {};

//new variables
var shoppingCart;



//adds a product to the cart
function addToCart(){
    shoppingCartIDs.push(selectedProduct);
    alert("The product was added to your shopping cart!");
}


function removeFromCart(id){
	document.location.href = "#cart_page";

	for(var i=0; i < shoppingCartIDs.length; i++) {
	
		if(shoppingCartIDs[i].id == id){
			shoppingCartIDs.splice(i,1);
			break;
		}
			//shoppingCartIDs.pop();

	}
	
	  var productList = shoppingCartIDs;
      var len = productList.length;
	  var list = $("#cartlist");
            list.empty();
            var product;
            for (var i=0; i < len; ++i){
                product = productList[i];
              list.append("<li><a onclick=viewProduct(" + product.pid + ")>" + 
					"<H6>" + product.pname + " " + "</H6>" + "<img src="+product.pimage_filename+" />" + 
					"<p><strong> Condition:" + " " + product.pdescription+ "</strong></p>" + 
					"<p style=\"color: blue\"class=\"ui-li-aside\">$" + product.pinstant_price + " <br>"+
					"</a></li>");

			}
            list.listview("refresh");    
	$.mobile.navigate("#cart_page");
}


//shows the list of products in your cart
$(document).on('pagebeforeshow', "#cart_page", function( event, ui ) {
			$.mobile.changePage.defaults.allowSamePageTransition = true;
            var productList = shoppingCart;
            var len = productList.length;
            var list = $("#cartlist");
            list.empty();
            var product;
            for (var i=0; i < len; ++i){
                product = productList[i];
             list.append("<li><a onclick=viewProduct(" + product.pid + ")>" + 
					"<H6>" + product.pname + " " + "</H6>" + "<img src="+product.pimage_filename+" />" + 
					"<p><strong> Condition:" + " " + product.pdescription+ "</strong></p>" + 
					"<p style=\"color: blue\"class=\"ui-li-aside\">$" + product.pinstant_price + " <br>"+
					"</a></li>");

			}
            list.listview("refresh");    
});

// //shows personal info of the user
// $(document).on('pagebeforeshow', "#profile_page", function( event, ui ) {
//     var list3 = $("#name_user_profile");
//     list3.empty();
//     list3.append(currentUser.firstname + " " + currentUser.lastname);
//     $("#myEmail").empty()
//     $("#myEmail").append("Email: " +  currentUser.email); 
//     $("#userid").empty()
//     $("#userid").append("ID: " +  currentUser.userid); 
// });

//browsing categories
function Browse(categoryID){
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/categories2/" + categoryID,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			currentCategory = data.categories;
			currentProducts = data.products;
			$.mobile.loading("hide");
			$.mobile.navigate("#browse_view"+ view);
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Category not found.");
			}
			else {
				alert("Internal Server Error.");
			}
		}
	});
}

//viewing bid history
function viewBidHistory(){
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/bidHistory",
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			myBidHistory = data.bids;
			$.mobile.loading("hide");
			$.mobile.navigate("#bid_history");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Category not found.");
			}
			else {
				alert("Internal Server Error.");
			}
		}
	});
}

//creates te browsing categories
$(document).on('pagebeforeshow', "#browse_index", function( event, ui ) {
	console.log("Jose");
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/categoriesTest",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var categoriesList = data.categories;
			var len = categoriesList.length;
			var list = $("#myListView");
			list.empty();
			var category;
			for (var i=0; i < len; ++i){
				category = categoriesList[i];
				list.append("<li><a onclick=Browse(" + category.cid + ")>" + category.cname + "</a></li>");
			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

//view product
function viewProduct(id){
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/product/" + id,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			selectedProduct = data.product;
			$.mobile.loading("hide");
			$.mobile.navigate("#product-page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Category not found.");
			}
			else {
				alert("Internal Server Error.");
			}
		}
	});
}

//viewing browse category
$(document).on('pagebeforeshow', "#browse_view1", function( event, ui ) {
			view = 2;
			if(currentCategory == "empty"){

			var productList = currentProducts;
			var len = productList.length;
			var list = $("#myBrowseView1");
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				list.append("<li><a onclick=viewProduct(" + product.pid + ")>" + 
					"<H6>" + product.pname + " " + "</H6>" + "<img src="+product.pimage_filename+" />" + 
					"<p><strong> Condition:" + " " + product.pdescription+ "</strong></p>" + 
					"<p style=\"color: blue\"class=\"ui-li-aside\">$" + product.pinstant_price + " <br>"+
					"</a></li>");

			
			}
			list.listview("refresh");	

			}else{
			var categoriesList = currentCategory;
			var len = categoriesList.length;
			var list = $("#myBrowseView1");
			list.empty();
			var category;
			for (var i=0; i < len; ++i){
				category = categoriesList[i];
				list.append("<li><a onclick=Browse("+category.cid+")>" + category.cname + "</a></li>");
			}
			list.listview("refresh");	
		}

});

//viewing browse category
$(document).on('pagebeforeshow', "#browse_view2", function( event, ui ) {
			view = 1;
			if(currentCategory == "empty"){
			var productList = currentProducts;
			var len = productList.length;
			var list = $("#myBrowseView2");
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				list.append("<li><a onclick=viewProduct(" + product.pid + ")>" + 
					"<H6>" + product.pname + " " + "</H6>" + "<img src="+product.pimage_filename+" />" + 
					"<p><strong> Condition:" + " " + product.pdescription+ "</strong></p>" + 
					"<p style=\"color: blue\"class=\"ui-li-aside\">$" + product.pinstant_price + " <br>"+
					"</a></li>");

			
			}
			list.listview("refresh");			
			}else{
			var categoriesList = currentCategory;
			var len = categoriesList.length;
			var list = $("#myBrowseView2");
			list.empty();
			var category;
			for (var i=0; i < len; ++i){
				category = categoriesList[i];
				list.append("<li><a onclick=Browse("+category.cid+")>" + category.cname + "</a></li>");
			}
			list.listview("refresh");	
			}
});




//puts the information of the product in the page
$(document).on('pagebeforeshow', "#product-page", function( event, ui ) {
	$("#theImage").empty();
	$("#theImage").append("<img width='50%' src=" + selectedProduct.pimage_filename +">");
	$("#pname").empty();
	$("#pname").append("Product Name: " + selectedProduct.pname);
	$("#pinstant_price").empty();
	$("#pinstant_price").append("Price: " + selectedProduct.pinstant_price);
	$("#pdesc").empty();
	$("#pdesc").append("Description: " + selectedProduct.pdescription);
	$("#pmodel").empty();
	$("#pmodel").append("Model: " + selectedProduct.pmodel);
	$("#pbrand").empty();
	$("#pbrand").append("Brand: " + selectedProduct.pbrand);
});



//welcomes the user
$(document).on('pagebeforeshow', "#home_page", function( event, ui ) {
	var list = $("#home");
	list.empty();
	list.append("<a>Welcome " +currentUser.firstname +"!</a>");	
});

////////////////////////////////////////////////////////////////////////////////////////////////
/// Functions Called Directly from Buttons ///////////////////////



function ConverToJSON(formData){
	var result = {};
	$.each(formData, 
		function(i, o){
			result[o.name] = o.value;
	});
	return result;
}


//creates an user
function SaveUser(){

	var temp1 = $("#firstname").val();
	var temp2 = $("#lastname").val();
	var temp3 = $("#email").val();
	var temp4 = $("#mail").val();
	if(temp1 == "" || temp2 == "" || temp3 == "" || temp4 == ""){
		alert("invalid input");	
	}
	else{
	$.mobile.loading("show");
	var form = $("#user-form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newUser = ConverToJSON(formData);
	console.log("New Car: " + JSON.stringify(newUser));
	var newUserJSON = JSON.stringify(newUser);
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/user1",
		method: 'post',
		data : newUserJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#username_form");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Data could not be added!");
		}
	});
}
}

function SaveUserName(){
	$.mobile.loading("show");
	var form = $("#username-form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newUser = ConverToJSON(formData);
	console.log("New Car: " + JSON.stringify(newUser));
	var newUserJSON = JSON.stringify(newUser);
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/user2",
		method: 'post',
		data : newUserJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#credit_page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Data could not be added!");
		}
	});
}

function SaveAccountInfo(){
	$.mobile.loading("show");
	var form = $("#credit-form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newUser = ConverToJSON(formData);
	console.log("New Car: " + JSON.stringify(newUser));
	var newUserJSON = JSON.stringify(newUser);
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/user3",
		method: 'post',
		data : newUserJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#confirmed_registration");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Data could not be added!");
		}
	});
}

//JR 4/10/13
function SaveProduct(){
	$.mobile.loading("show");
	var form = $("#selling-form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newProduct = ConverToJSON(formData);
	console.log("New Product: " + JSON.stringify(newProduct));
	var newProductJSON = JSON.stringify(newProduct);
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/products",
		method: 'post',
		data : newProductJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#selling_form_message");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Data could not be added!");
		}
	});


}

function bid(){
	$.mobile.loading("show");
	var form = $("#bidAmount");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newProduct = ConverToJSON(formData);
	console.log("New Product: " + JSON.stringify(newProduct));
	var newProductJSON = JSON.stringify(newProduct);
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/bid",
		method: 'post',
		data : newProductJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			//alert("Bid successful");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Data could not be added!");
		}
	});
}


//Deprecated
function authenticate(){
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/something",
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){

			var userList = data.users;
			var len = userList.length;
			var isValidUser = 0;
			var username = $("#user_name").val();
			var password = $("#password2").val();
			for (var i=0; i < len; ++i){
				if(userList[i].username == username && userList[i].password == password){
				currentUser = userList[i];
				isValidUser = 1;
			}
			}
			if(isValidUser == 1){
			currentSignedIn = username;
			$.mobile.loading("hide");
			$.mobile.navigate("#home_page");
		} else{
			$.mobile.loading("hide");
			alert("not valid username & password combination");
		}
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
			}
			else {
				alert("Internalf Server Error.");
			}
		}
	});
}

function authenticateNew(){
	$.mobile.loading("show");
	var form = $("#userAndPass_form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newProduct = ConverToJSON(formData);
	console.log("New Product: " + JSON.stringify(newProduct));
	var newProductJSON = JSON.stringify(newProduct);
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/authenticate",
		method: 'post',
		data : newProductJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			currentUser = data.user;
			$.mobile.loading("hide");
			$.mobile.navigate("#home_page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("No match found!!!");
		}
	});


}



function signOut(){
currentSignedIn = "";
view = 1;
$.mobile.navigate("#welcome_page");
}



$(document).on('pagebeforeshow', "#my_profile_editor", function( event, ui ) {
// currentCar has been set at this point
$("#upd-email").val(currentUser.email);
$("#upd-mail").val(currentUser.mail);
$("#upd-password").val(currentUser.password);
$("#upd-accountNumber").val(currentUser.accountNumber);
$("#upd-billingAddress").val(currentUser.billingAddress);
$("#upd-CCinfo").val(currentUser.CCinfo);
});


function GetUser(){
id = currentUser.id;
$.mobile.loading("show");
$.ajax({
url : "http://localhost:3412/ICOM5016Srv/users/" + id,
method: 'get',
contentType: "application/json",
dataType:"json",
success : function(data, textStatus, jqXHR){
currentUser = data.user;
$.mobile.loading("hide");
$.mobile.navigate("#my_profile_editor");
},
error: function(data, textStatus, jqXHR){
console.log("textStatus: " + textStatus);
$.mobile.loading("hide");
if (data.status == 404){
alert("User not found.");
}
else {
alert("Internal Server Error.");
}
}
});
}

function UpdateUser(){ 
$.mobile.loading("show");
var form = $("#user-view-form");
var formData = form.serializeArray();
console.log("form Data: " + formData);
var updUser = ConverToJSON(formData);
updUser.id = currentUser.id;
console.log("Updated User: " + JSON.stringify(updUser));
var updUserJSON = JSON.stringify(updUser);
$.ajax({
url : "http://localhost:3412/ICOM5016Srv/temp/" + updUser.id,
method: 'put',
data : updUserJSON,
contentType: "application/json",
dataType:"json",
success : function(data, textStatus, jqXHR){
currentUser = data.user;
$.mobile.loading("hide");
$.mobile.navigate("#profile_page");
},
error: function(data, textStatus, jqXHR){
console.log("textStatus: " + textStatus);
$.mobile.loading("hide");
if (data.status == 404){
alert("Data could not be updated!");
}
else {
alert("Internal Error.");	
}
}
});
}


function UpdateProduct(){ 
$.mobile.loading("show");
var form = $("#productForm");
var formData = form.serializeArray();
console.log("form Data: " + formData);
var updProduct = ConverToJSON(formData);
updProduct.id = selectedProduct.id;
console.log("Updated Product: " + JSON.stringify(updProduct));

var updProductJSON = JSON.stringify(updProduct);
$.ajax({
url : "http://localhost:3412/ICOM5016Srv/UpdateProduct/" + updProduct.id,
method: 'put',
data : updProductJSON,
contentType: "application/json",
dataType:"json",
success : function(data, textStatus, jqXHR){
CurrentProduct = data.product;
$.mobile.loading("hide");
$.mobile.navigate("#MyZaar");
},
error: function(data, textStatus, jqXHR){
console.log("textStatus: " + textStatus);
$.mobile.loading("hide");
if (data.status == 404){
alert("Data could not be updated!");
}
else {
alert("Internal Error.");	
}
}
});
}

//list de sell items 4/10/13
$(document).on('pagebeforeshow', "#MyZaar", function( event, ui ) {
	console.log("Jose");
	$.ajax({
		url : "http://localhost:3412/Icom5016Srv/sellingproducts/" + currentUser.userid,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			watching = data.watching;
			buying = data.buying;
			selling = data.selling;

			var productList = watching;
			var len = productList.length;
			var list = $("#selling-list");
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				
			list.append("<li><a onclick=viewProduct(" + product.pid + ")>" + 
					"<H6>" + product.pname + " " + "</H6>" + "<img src="+product.pimage_filename+" />" + 
					"<p><strong> Condition:" + " " + product.pdescription+ "</strong></p>" + 
					"<p style=\"color: blue\"class=\"ui-li-aside\">$" + product.pinstant_price + " <br>"+
					"</a></li>");

			}
			list.listview("refresh");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});


// $(document).on('pagebeforeshow', "#profile_page", function( event, ui ) {
// 	console.log("Jose");
// 	$.ajax({
// 		url : "http://localhost:3412/Icom5016Srv/sellingproducts",
// 		contentType: "application/json",
// 		success : function(data, textStatus, jqXHR){
// 			var productList = data.products;
// 			var len = productList.length;
// 			var list = $("#also_selling-list");
// 			list.empty();
// 			var product;
// 			for (var i=0; i < len; ++i){
// 				product = productList[i];
// 				list.append("<li><a onclick=viewProduct(" + product.id + ")>" + 
// 					"<h2>" + product.pName + " " + product.brand +  "</h2>" + "<img src="+product.photo+" />" + 
// 					"<p>" + product.model + "</p>" +
// 					"<p><strong> Condition: </strong></p>" + 
// 					"<p class=\"ui-li-aside\">" + product.iPrice + " <br>"+ product.bPrice+ "</p>" +
// 					"</a></li>");
// 			}
// 			list.listview("refresh");	
// 		},
// 		error: function(data, textStatus, jqXHR){
// 			console.log("textStatus: " + textStatus);
// 			alert("Data not found!");
// 		}
// 	});
// });

//added by Ramon
//LONGEST METHOD EVER
$(document).on('pagebeforeshow', "#profile_page", function( event, ui ) {
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/UserInfo/" + currentUser.userid,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			userBillingAdress = data.billing;
			userPaymentOptions = data.creditcard;
			userShippingAdress = data.shipping;

			//first stuff
			var list3 = $("#name_user_profile");
    		list3.empty();
    		list3.append(currentUser.firstname + " " + currentUser.lastname);
    		$("#myEmail").empty();
    		$("#myEmail").append("Email: " +  currentUser.email); 
    		$("#userid").empty();
    		$("#userid").append("ID: " +  currentUser.userid);
    		$("#myfirstname").empty();
    		$("#myfirstname").append("First Name: " +  currentUser.firstname);
    		$("#mylastname").empty();
    		$("#mylastname").append("Last Name: " +  currentUser.lastname);

			//second stuff 
    		var paymentTypeList = userPaymentOptions;
			var len = paymentTypeList.length;
			var list = $("#paymentOptions");
			list.empty();
			var payment;
			for (var i=0; i < len; ++i){
				payment = paymentTypeList[i];	
			list.append("<li>" + 
					"<h2>" + "Credit #: " + payment.crednum + " Sec Num: " + payment.secnum +  "</h2>" + 
					"<p>" + "Exp Date: " + payment.expdate + "</p>" + 
					"</li>");
			}
			list.listview("refresh");

			//third stuff
			var shippingAdressList = userShippingAdress;
			var len = shippingAdressList.length;
			var list = $("#shippingAdresses");
			list.empty();
			var adress;
			for (var i=0; i < len; ++i){
				adress = shippingAdressList[i];	
			list.append("<li>" + 
					"<p>" + "Urb: " + adress.urb + " Street: " + adress.street +  "</p>" + 
					"<p>" + "City: " + adress.city + "</p>" +
					"<p>" + adress.numhouse + "</p>" + 
					"<p>" + adress.zipcode + "</p>" + 
					"<p>" + adress.country + "</p>" + 
					"</li>");
			}
			list.listview("refresh");	

			//fourth stuff
			var billingAdressList = userBillingAdress;
			var len = billingAdressList.length;
			var list = $("#billingAdresses");
			list.empty();
			var billAdress;
			for (var i=0; i < len; ++i){
				billAdress = billingAdressList[i];	
			list.append("<li>" + 
					"<p>" + "Urb: " + billAdress.urb + " Street: " + billAdress.street +  "</p>" + 
					"<p>" + "City: " + billAdress.city + "</p>" +
					"<p>" + billAdress.numhouse + "</p>" + 
					"<p>" + billAdress.zipcode + "</p>" + 
					"<p>" + billAdress.country + "</p>" + 
					"</li>");
			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			
		}
	});
});






$(document).on('pagebeforeshow', "#checkOut_page", function( event, ui ) {
    var list1 = $("#adress_cart");
    list1.empty();
    list1.append(currentUser.billingAddress);

    var list3 = $("#name_cart");
    list3.empty();
    list3.append(currentUser.firstname + " " + currentUser.lastname);

    var list2 = $("#tbody_cart");
    list2.empty();
    products = shoppingCartIDs;
    for(var i = 0; i < products.length; i++){
    list2.append("<tr>" + 
          "<th>"+ products[i].pName +"</th>" +
          "<td> 1 </td>" +
          "<td>" +products[i].iPrice+"</td>" +
          "<td>"+ products[i].iPrice +"</td>" +
        "</tr>");
    }    
});

$(document).on('pagebeforeshow', "#BIN_invoice", function( event, ui ) {
 
    var list1 = $("#adress_BIN");
    list1.empty();
    list1.append(currentUser.billingAddress);

    var list3 = $("#name_BIN");
    list3.empty();
    list3.append(currentUser.firstname + " " + currentUser.lastname);

    var list2 = $("#tbody_BIN");
    list2.empty();
    list2.append("<tr>" + 
          "<th>"+ selectedProduct.pName +"</th>" +
          "<td> 1 </td>" +
          "<td>" +selectedProduct.iPrice+"</td>" +
          "<td>" +selectedProduct.iPrice+"</td>" +
        "</tr>");    
});

function rateUser(){
alert("Thank you for rating!");
$.mobile.loading("show");
    var form = $("#rate_form");
    var formData = form.serializeArray();
    var newCar = ConverToJSON(formData);
    var newCarJSON = JSON.stringify(newCar);
   
    $.ajax({
        url : "http://localhost:3412/ICOM5016Srv/rating",
        method: 'post',
        data : newCarJSON,
        contentType: "application/json",
        dataType:"json",
        success : function(data, textStatus, jqXHR){
            $.mobile.loading("hide");
        },
        error: function(data, textStatus, jqXHR){
            console.log("textStatus: " + textStatus);
            $.mobile.loading("hide");
            alert("Data could not be added!");
        }
    });

}

//added by Hector
//modified by Ramon

function Search(){

var searchWord = $("#search-basic").val();

$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/search/" + searchWord,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			//alert("success");
			var productList = data.products;
			
			var len = productList.length;
			
			var list = $("#movies-list");
		
			//alert("Movie: " + moviesList[0].movieName);
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				
			list.append("<li><a onclick=viewProduct(" + product.pid + ")>" + 
					"<H6>" + product.pname + " " + "</H6>" + "<img src="+product.pimage_filename+" />" + 
					"<p><strong> Condition:" + " " + product.pdescription+ "</strong></p>" + 
					"<p style=\"color: blue\"class=\"ui-li-aside\">$" + product.pinstant_price + " <br>"+
					"</a></li>");

			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
}



//Added by Hector
function AddNewCategory(){
	$.mobile.loading("show");
	var form = $("#createCategory_form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newCategory = ConverToJSON(formData);
	console.log("New Category: " + JSON.stringify(newCategory));
	var newCategoryJSON = JSON.stringify(newCategory);
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/addCategory",
		method: 'post',
		data : newCategoryJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert("AddNewCategory Success");
			$.mobile.navigate("#adminPage");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Data could not be added!");
		}
	});
}


//added by Hector
function DeleteCategory(){
$.mobile.loading("show");
	var id = 0;
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/deleteCategory/" + id,
		method: 'delete',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert("Delete Category Success");
			$.mobile.navigate("#adminPage");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Category not found.");
			}
			else {
				alter("Internal Server Error.");
			}
		}
	});


}

function ModifyUser(){
$.mobile.loading("show");
	var form = $("#ModifyUser_form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var updUser = ConverToJSON(formData);
	var id = 0;
	console.log("Updated User: " + JSON.stringify(updUser));
	var updUserJSON = JSON.stringify(updUser);
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/modifyUser/" + id,
		method: 'put',
		data : updUserJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert("Modify User Success");
			$.mobile.navigate("#adminPage");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Data could not be updated!");
			}
			else {
				alert("Internal Error.");		
			}
		}
	});
}

//added by Hector
$(document).on('pagebeforeshow', "#bids_listPage", function( event, ui ) {

	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/bids",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			
			var bidsList = data.bids;
			
			var len = bidsList.length;
			
			var list = $("#bids-list");
			
			list.empty();
			var bid;
			
			for (var i=0; i < len; ++i){
				bid = bidsList[i];
				list.append("<li><a>" +
					"<h2> Product: " + bid.productName + " ID: " + bid.productID +  "</h2>" +
					"<p><strong> Price: " + bid.bidPrice + "</strong></p>" +
					"<p>" + bid.bidProgress + "</p>" +
					"<p> You are a " + bid.bidType + "</p>" +
					"</a></li>");
			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});


function GetBid(id){
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/bids/" + id,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			currentBid = data.bid;
			$.mobile.loading("hide");
			//$.mobile.navigate("#");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Bid not found.");
			}
			else {
				alert("Internal Server Error.");
			}
		}
	});
}


function deleteUser(){
	$.mobile.loading("show");
	var id = currentUser.id;
	$.ajax({
		url : "http://localhost:3412/ICOM5016/deleteUser/" + id,
		method: 'delete',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#welcome_page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("User not found.");
			}
			else {
				alter("Internal Server Error.");
			}
		}
	});
}


//Added By Ramon
//gets the products that are being watched by the currents user

function myWatching(){
			//alert("watching start");
			var productList = watching;
			var len = productList.length;
			var list = $("#selling-list");
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
			product = productList[i];	
			list.append("<li><a onclick=viewProduct(" + product.pid + ")>" + 
					"<H6>" + product.pname + " " + "</H6>" + "<img src="+product.pimage_filename+" />" + 
					"<p><strong> Condition:" + " " + product.pdescription+ "</strong></p>" + 
					"<p style=\"color: blue\"class=\"ui-li-aside\">$" + product.pinstant_price + " <br>"+
					"</a></li>");

			}
			list.listview("refresh");	
			//alert("watching done");
}

//Added By Ramon
//gets the products that are being purchased by the currents user

function myBuying(){
	var productList = buying;
			var len = productList.length;
			var list = $("#selling-list");
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
			product = productList[i];	
	    	list.append("<li><a onclick=viewProduct(" + product.pid + ")>" + 
					"<H6>" + product.pname + " " + "</H6>" + "<img src="+product.pimage_filename+" />" + 
					"<p><strong> Condition:" + " " + product.pdescription+ "</strong></p>" + 
					"<p style=\"color: blue\"class=\"ui-li-aside\">$" + product.pinstant_price + " <br>"+
					"</a></li>");

			}
			list.listview("refresh");	

		//alert("buying done");




}


//Added By Ramon
//gets the products that are being sold by the currents user
function mySelling(){
var productList = selling;
			var len = productList.length;
			var list = $("#selling-list");
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
			product = productList[i];	
		    list.append("<li><a onclick=viewProduct(" + product.pid + ")>" + 
					"<H6>" + product.pname + " " + "</H6>" + "<img src="+product.pimage_filename+" />" + 
					"<p><strong> Condition:" + " " + product.pdescription+ "</strong></p>" + 
					"<p style=\"color: blue\"class=\"ui-li-aside\">$" + product.pinstant_price + " <br>"+
					"</a></li>");

			}
			list.listview("refresh");	

			//alert("selling done");
}

function getCart(){
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/getCart/" + currentUser.userid,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			shoppingCart = data.products;
			//alert(shoppingCart[0].pname);
			$.mobile.loading("hide");
			$.mobile.navigate("#cart_page");
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Shopping cart items where not found.");
			}
			else {
				alert("Internal Server Error. Method: getCart()");
			}
		}
	});
}

$(document).on('pagebeforeshow', "#seller_profile_page", function( event, ui ) {
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/SellerInfo/" + selectedProduct.pid,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var otherProducts = data.otherProducts;
			var seller = data.seller[0];
    		$("#selleremail").empty();
    		$("#selleremail").append("Email: " +  seller.email); 
    		$("#selleruserid").empty();
    		$("#selleruserid").append("ID: " +  seller.userid);
    		$("#sellerfirstname").empty();
    		$("#sellerfirstname").append("First Name: " +  seller.firstname);
    		$("#sellerlastname").empty();
    		$("#sellerlastname").append("Last Name: " +  seller.lastname);
			var len = otherProducts.length;
			var list = $("#seller-products");
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
			product = otherProducts[i];	
		    list.append("<li><a onclick=viewProduct(" + product.pid + ")>" + 
					"<H6>" + product.pname + " " + "</H6>" + "<img src="+product.pimage_filename+" />" + 
					"<p><strong> Condition:" + " " + product.pdescription+ "</strong></p>" + 
					"<p style=\"color: blue\"class=\"ui-li-aside\">$" + product.pinstant_price + " <br>"+
					"</a></li>");

			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			alert("Doesn't Work");
		}
	});
});

$(document).on('pagebeforeshow', "#bid_history", function( event, ui ) {
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/BidHistory/" + selectedProduct.pid,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var bidList = data.bidHistory;
			var len = bidList.length;
			var list = $("#bidHistory");
			list.empty();
			var bid;
			for (var i=0; i < len; ++i){
			bid = bidList[i];	
			list.append("<li>" + 
					"<h2>" + "Bid ID #: " + bid.bidid + "</h2>" + 
					"<p>" + "Bid Price: " + bid.bidprice + "</p>" + 
					"</li>");
			}
			list.listview("refresh");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

//added by Ramon
///fetches the order from the database based on the product ID
//this method is currently a GET but in the future it probably will be a POST 
//that returns and object (not sure though)
$(document).on('pagebeforeshow', "#order_page", function( event, ui ) {
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/Order/" + selectedProduct.pid + "/" + currentUser.userid,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var theOrder = data.order;
			var theBilling = data.billing;
			$("#orderid").empty();
    		$("#orderid").append("Order ID: " +  theOrder.orderid); 
    		$("#productname").empty();
    		$("#productname").append("Product Name: " +  theOrder.pname);
    		$("#pinstantprice").empty();
    		$("#pinstantprice").append("Price: " +  theOrder.pinstant_price);
    		$("#productbrand").empty();
    		$("#productbrand").append("Product Brand: " +  theOrder.pbrand);
    		var len = theBilling.length;
    		var list = $("#temp");
			list.empty();
			var billing;
			for (var i=0; i < len; ++i){
			billing = theBilling[i];
			list.append("<input type=\"radio\" name=\"radio\" id=\"radio" + i + "\" value=\"radio" + i + "\"/>" +
			"<label for=\"radio" + i + "\">" + billing.crednum + "</label><br>"
				);
			}
			list.listview("refresh");
			// <input type="radio" name="radio" id="radio2" value="radio2"/>
   //                       <label for="radio2">2</label>
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#invoice_page", function( event, ui ) {
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/Invoice/" + selectedProduct.pid,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var invoiceInfo = data.invoice;
			var shipping = data.shipping;
			//alert(invoiceInfo.pname);
			$("#invoiceid").empty();
    		$("#invoiceid").append("Invoice ID: " +  invoiceInfo.invid); 
    		$("#productname_invoice").empty();
    		$("#productname_invoice").append("Product Name: " +  invoiceInfo.pname);
    		$("#pinstantprice_invoice").empty();
    		$("#pinstantprice_invoice").append("Price: " +  invoiceInfo.pinstant_price);
    		$("#invoice_date").empty();
    		$("#invoice_date").append("Invoice date: " +  invoiceInfo.invDate);
    		$("#due_date").empty();
    		$("#due_date").append("Due date: " +  invoiceInfo.dueDate);
    		$("#payment_invoice").empty();
    		$("#payment_invoice").append("<p>" + "Credit #: " + invoiceInfo.crednum + " Sec Num: " + invoiceInfo.secnum +  "</p>" + 
					"<p>" + "Exp Date: " + invoiceInfo.expdate + "</p>");
    		$("#billingAdress_invoice").empty();
    		$("#billingAdress_invoice").append("<h4><p> Billing Adress " + "Urb: " + invoiceInfo.urb + " Street: " + invoiceInfo.street +  "</p>" + 
					"<p>" + "City: " + invoiceInfo.city + "</p>" +
					"<p>" + invoiceInfo.numhouse + "</p>" + 
					"<p>" + invoiceInfo.zipcode + "</p>" + 
					"<p>" + invoiceInfo.country + "</p></h4>");
    		$("#shippingAdress_invoice").empty();
    		$("#shippingAdress_invoice").append("<h4><p> Shipping Adress " + "Urb: " + shipping.urb + " Street: " + shipping.street +  "</p>" + 
					"<p>" + "City: " + shipping.city + "</p>" +
					"<p>" + shipping.numhouse + "</p>" + 
					"<p>" + shipping.zipcode + "</p>" + 
					"<p>" + shipping.country + "</p></h4>");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});
















//this is the current list of info retrieved from the database for the sales report
var salesList = {};
//this is the type of data retrieved from the database either totalsales, totalsalesproduct or totalrevenueproduct
var typeData = "";
//this is the time interval that is retrieved from the database either day, month or week
var timeline = "";

//added by Hector////////////////////////////////////////////////////////////////////////////////////////////////
//This function is to get the total sales by month, week or day//////////////////////////////////////////////////
function GetTotalSales(){
$.ajax({

		url : "http://localhost:3412/ICOM5016Srv/totalsales/" + $('#Year_Report').val() + "/" + $('#Month_Report').val() + "/" +$('#Day_Report').val() + "/" + $('input:radio[name=radio]:checked').val(),
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var total = data.totalsales;
			salesList = total;
			typeData = "totalsales";
			timeline = $('input:radio[name=radio]:checked').val();

			//alert("salesList: " + salesList[0].count + "\ntypeData: " + typeData + "\ntimeline: " + timeline);
			
			$.mobile.navigate("#TotalSales_Report");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
}



//added by Hector////////////////////////////////////////////////////////////////////////////////////////////////
//This function is to get the total sales by Product month, week or day//////////////////////////////////////////////////
function GetTotalSalesProduct(){
$.ajax({

		url : "http://localhost:3412/ICOM5016Srv/totalsalesProduct/" + $('#Year_Report').val() + "/" + $('#Month_Report').val() + "/" +$('#Day_Report').val() + "/" + $('input:radio[name=radio]:checked').val(),
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var total = data.totalsalesProduct;
			var len = total.length;	
			var info = "";
			salesList = total;
			typeData = "totalsalesProduct";
			timeline = $('input:radio[name=radio]:checked').val();

				
			for (var i=0; i < len; ++i){
				info = info + "Product: " + salesList[i].product + " total: " + salesList[i].total + "\n";
			}
			//alert("Total Sales by Product: \n" + info + "\ntypeData: " + typeData + "\ntimeline: " + timeline);
			//alert("Total Sales by Product: \n" + info);
			$.mobile.navigate("#TotalSales_Report");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
}



//added by Hector////////////////////////////////////////////////////////////////////////////////////////////////
//This function is to get the total Revenue by Product month, week or day//////////////////////////////////////////////////
function GetTotalRevenueProduct(){
$.ajax({

		url : "http://localhost:3412/ICOM5016Srv/totalrevenueProduct/" + $('#Year_Report').val() + "/" + $('#Month_Report').val() + "/" +$('#Day_Report').val() + "/" + $('input:radio[name=radio]:checked').val(),
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var total = data.totalrevenueProduct;
			var len = total.length;	
			var info = "";	
			salesList = total;
			typeData = "totalrevenueProduct";
			timeline = $('input:radio[name=radio]:checked').val();

				
			for (var i=0; i < len; ++i){
				info = info + "Product: " + salesList[i].product + " total: " + salesList[i].revenue + "\n";
			}
			//alert("Total Sales by Product: \n" + info + "\ntypeData: " + typeData + "\ntimeline: " + timeline);
			//alert("Total Revenue by Product: \n" + info);
			$.mobile.navigate("#TotalSales_Report");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
}


//shows the list of sales or revenue from the database
$(document).on('pagebeforeshow', "#TotalSales_Report", function( event, ui ) {
			$.mobile.changePage.defaults.allowSamePageTransition = true;
            
            var len = salesList.length;
            var list = $("#saleslist");
	    var report = $("#reports");
            list.empty();
	    report.empty();
            var datasales;
	     
	    if(typeData == "totalsales"){
		  if(timeline == "day"){
			report.append('<h3 style="text-align: center">Total Sales By Day</h3>');
	     	  }
	    	  else if (timeline == "month"){
			report.append('<h3 style="text-align: center">Total Sales By Month</h3>');
	    	  }
	    	  else{
			report.append('<h3 style="text-align: center">Total Sales By Week</h3>');
	    	  }
			list.append('<div class="ui-bar-b">Total Sales</div>');
		 						
           	 for (var i=0; i < len; ++i){
               		 datasales = salesList[i];
               		//list.append('<li><a><h2 style="text-align: center"> Total Sales: ' + datasales.count + '</h2></a></li>');
			 list.append('<div class="ui-bar-d">' + datasales.count + '</div>');
            	 }
		 
	    }
	    else if(typeData == "totalsalesProduct"){
		  if(timeline == "day"){
			report.append('<h3 style="text-align: center">Total Sales Of Product By Day</h3>');
	     	  }
	    	  else if (timeline == "month"){
			report.append('<h3 style="text-align: center">Total Sales Of Product By Month</h3>');
	    	  }
	    	  else{
			report.append('<h3 style="text-align: center">Total Sales Of Product By Week</h3>');
	    	  }
			list.append('<div class="ui-block-a ui-bar-b">Product</div><div class="ui-block-b ui-bar-b">Total Sales</div>');
           	 for (var i=0; i < len; ++i){
               		 datasales = salesList[i];
               		//list.append('<li><a><h2 style="text-align: center"> Product: ' + datasales.product + ' Total Sales: ' + datasales.total + '</h2></a></li>');
list.append('<div class="ui-block-a ui-bar-d">' + datasales.product + '</div><div class="ui-block-b ui-bar-d">' + datasales.total + '</div>');
            	 }
		
	    }
	    else{
		  if(timeline == "day"){
			report.append('<h3 style="text-align: center">Total Revenue Of Product By Day</h3>');
	     	  }
	    	  else if (timeline == "month"){
			report.append('<h3 style="text-align: center">Total Revenue Of Product By Month</h3>');
	    	  }
	    	  else{
			report.append('<h3 style="text-align: center">Total Revenue Of Product By Week</h3>');
	    	  }
		 list.append('<div class="ui-block-a ui-bar-b">Product</div><div class="ui-block-b ui-bar-b">Total Revenue</div>');
           	 for (var i=0; i < len; ++i){
               		 datasales = salesList[i];
               		//list.append('<li><a><h2 style="text-align: center"> Product: ' + datasales.product + ' Total Revenue: ' + datasales.revenue + '</h2></a></li>');
list.append('<div class="ui-block-a ui-bar-d">' + datasales.product + '</div><div class="ui-block-b ui-bar-d">$' + datasales.revenue + '</div>');
			
            	 }
		
	    }
            //list.listview("refresh"); 
	    
	    
});



//added by hector
//this fetches the orders in the shopping cart and appends the values to the 
//order page 
$(document).on('pagebeforeshow', "#order_shopping_cart", function( event, ui ) {
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/OrderCart/" + currentUser.userid,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var orderProducts = data.OrderCart;
			var theBilling = data.billing;
			var list = $("#listview_cart");
			var len = orderProducts.length;
			list.empty();
			var product;
			//alert("pagebeforeshow " + len);
			for (var i=0; i < len; ++i){
               		 product = orderProducts[i];
			//alert(product.pname);
			 list.append("<li> <h5>Order ID:" + product.orderid + "</h5><h5>Product: " + product.pname + "<img src="+product.pimage_filename+" />" + "</h5><h5>Instant Price: " + product.pinstant_price + "</h5><h5>Brand: " + product.pbrand + "</h5></li>");
			
			}
			list.listview("refresh");
			
			var lenBill = theBilling.length;
    			var listBill = $("#temp_cart");
			listBill.empty();
			var billing;
			for (var i=0; i < lenBill; ++i){
			billing = theBilling[i];
			listBill.append("<input type=\"radio\" name=\"radio\" id=\"radio" + i + "\" value=\"radio" + i + "\"/>" +
			"<label for=\"radio" + i + "\">" + billing.crednum + "</label><br>"
				);
			}
			listBill.listview("refresh");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});




$(document).on('pagebeforeshow', "#invoice_page_cart", function( event, ui ) {
	$.ajax({
		url : "http://localhost:3412/ICOM5016Srv/InvoiceCart/" + currentUser.userid,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var invoiceInfo = data.invoice;
			var shipping = data.shipping;
			var list = $("#invoice_cartlist");
			var len = invoiceInfo.length;
			var info;
			list.empty();
		for (var i=0; i < len; ++i){
               		 info = invoiceInfo[i];
			
			 list.append("<li> <h5>Invoice ID: " + info.invid + "</h5><h5>Product Name: " + info.pname + "</h5><h5>Price: " + info.pinstant_price + "</h5></li>");
			}
			
			list.append("<li><h5>Total Price: " + info.totalprice + "</h5></li>");

			list.append("<li><h5>Invoice Date: " + info.invDate + "</h5><h5>Due Date: " + info.dueDate + "</h5></li>");

			list.append("<li><h5>Credit #: " + info.crednum + "</h5><h5>Sec Num: " + info.secnum + "</h5><h5>Exp Date: " + info.expdate + "</h5></li>");

			list.append("<li><h5>Billing Adress</h5><h5>Urb: " + info.urb + "Street: " + info.street + " " + info.numhouse  + "</h5><h5>City: " + info.city + "</h5><h5>Zipcode: " + info.zipcode + "</h5><h5>Country: " + info.country + "</h5></li>");

			list.append("<li><h5>Shipping Adress</h5><h5>Urb: " + shipping.urb + "Street: " + shipping.street + " " + shipping.numhouse  + "</h5><h5>City: " + shipping.city + "</h5><h5>Zipcode: " + shipping.zipcode + "</h5><h5>Country: " + shipping.country + "</h5></li>");

			list.listview("refresh");
			
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});
