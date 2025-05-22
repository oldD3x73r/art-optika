

//Cart Open Close

let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");

//Open cart
cartIcon.onclick = () => {
  cart.classList.add("active");
};

//Close Cart
closeCart.onclick = () => {
  cart.classList.remove("active");
};

//Add to cart
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

//making function

function ready() {
  //remove item from cart
  var removeCartButtons = document.getElementsByClassName("cart-remove");
  for (var i = 0; i < removeCartButtons.length; i++) {
    var button = removeCartButtons[i];
    button.addEventListener("click", removeCartItem);
  }
  // Quantity Change
  var quantityInputs = document.getElementsByClassName("cart-quantity");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }
  //add to cart
  var addCart = document.getElementsByClassName("add-cart");
  for (var i = 0; i < addCart.length; i++) {
    var button = addCart[i];
    button.addEventListener("click", addCartClicked);
  }
  loadCartItems();
}

//remove Cart Item
function removeCartItem(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.remove();
  updatetotal();
  saveCartItems();
}
//Quantity Change
function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updatetotal();
  saveCartItems();
  updateCartIcon();
}

// fn za proveru da li je element vec u korpi
function checkIfElementInCart(title) {
  const cartItems = localStorage.getItem("cartItems");
  if (cartItems) {
    const cartItemsArray = JSON.parse(cartItems);

    // .find() vraca element ako ga nadje, ako ne vraca undefined
    const elementAlreadyInCart = cartItemsArray.find(
      // morao sam da dodam toLowerCase() jer je u localsotrage velikim slovima iz nekog razloga,
      // tu ga izjednacis i generalno kad uporedjujes stringove ako nisi siguran uvek ih prebacis u isti case a mozes i cak .trim() da dodas da izbacis razmake ako ih ima znaci tipa bilo bi .trim().toLowerCase() ili obrnuto
      (e) => e.title.toLowerCase() === title.toLowerCase()
    );
    if (elementAlreadyInCart) {
      return true;
    }
  }
  return false;
}

//Add Cart Funcion
function addCartClicked(event) {
  var button = event.target;
  var shopProducts = button.parentElement;
  var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
  var price = shopProducts.getElementsByClassName("price")[0].innerText;
  var productImg = shopProducts.getElementsByClassName("product-img")[0].src;

  // ovde odmah proveravamo da li je element vec u korpi
  const elementAlreadyInCart = checkIfElementInCart(title);
  if (elementAlreadyInCart) {
    // ako nije shourt circuit ceo if i nece se izvrsiti, uvek gledas da ga short circuitujes jer citljivije je
    alert("You have already added this item to cart");
    return;
  }

  addProductToCart(title, price, productImg);
  updatetotal();
  saveCartItems();
  updateCartIcon();
}

function addProductToCart(title, price, productImg) {
  var cartShopBox = document.createElement("div");
  cartShopBox.classList.add("cart-box");
  var cartItems = document.getElementsByClassName("cart-content")[0];
  var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
  for (var i = 0; i < cartItemsNames.length; i++) {
    if (cartItemsNames[i].innerText == title) {
      alert("you have already added this item to cart");
      return;
    }
  }
  var cartBoxContent = `

  <img src="${productImg}" alt="" class="cart-img"/>
  <div class="detail-box">
    <div class="cart-product-title">${title}</div>
    <div class="cart-price">${price}</div>
    <input type="number" name="" id="" value="1" class="cart-quantity"/>
  </div>

  <i class="bx bx-trash-alt cart-remove" ></i>`;
  cartShopBox.innerHTML = cartBoxContent;
  cartItems.append(cartShopBox);
  cartShopBox
    .getElementsByClassName("cart-remove")[0]
    .addEventListener("click", removeCartItem);
  cartShopBox
    .getElementsByClassName("cart-quantity")[0]
    .addEventListener("change", quantityChanged);
  saveCartItems();
  updateCartIcon();
}

//Update total
function updatetotal() {
  var cartContent = document.getElementsByClassName("cart-content")[0];
  var cartBoxes = cartContent.getElementsByClassName("cart-box"); // Promenio sam ovaj red
  var total = 0;

  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var priceElement = cartBox.getElementsByClassName("cart-price")[0];
    var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    var price = parseFloat(priceElement.innerText.replace("$", ""));
    var quantity = quantityElement.value;
    total += price * quantity;
  }
  // If number is not whole
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("total-price")[0].innerText = "$" + total;
  //save total to localStorage
  localStorage.setItem("cartTotal", total);
}

//Keep item in cart on refresh

function saveCartItems() {
  var cartContent = document.getElementsByClassName("cart-content")[0];
  var cartBoxes = cartContent.getElementsByClassName("cart-box");
  var cartItems = [];

  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var titleElement = cartBox.getElementsByClassName("cart-product-title")[0];
    var priceElement = cartBox.getElementsByClassName("cart-price")[0]; // Promenjena linija ovde
    var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    var productImg = cartBox.getElementsByClassName("cart-img")[0].src;

    var item = {
      title: titleElement.innerText,
      price: priceElement.innerText,
      quantity: quantityElement.value,
      productImg: productImg,
    };
    cartItems.push(item);
  }
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

//loads in cart
function loadCartItems() {
  var cartItems = localStorage.getItem("cartItems");
  if (cartItems) {
    cartItems = JSON.parse(cartItems);

    for (var i = 0; i < cartItems.length; i++) {
      var item = cartItems[i];
      addProductToCart(item.title, item.price, item.productImg);

      var cartBoxes = document.getElementsByClassName("cart-box");
      var cartBox = cartBoxes[cartBoxes.length - 1];
      var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
      quantityElement.value = item.quantity;
    }
  }

  var cartTotal = localStorage.getItem("cartTotal");
  if (cartTotal) {
    document.getElementsByClassName("total-price")[0].innerText =
      "$" + cartTotal;
  }
  updateCartIcon();
}

//Quantity in Cart Icon
function updateCartIcon(){
  var cartBoxes = document.getElementsByClassName('cart-box');
  var quantity = 0;

  for(var i = 0; i < cartBoxes.length; i++){

    var cartBox = cartBoxes[i];
    var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
    quantity+= parseInt(quantityElement.value);
  }
  var cartIcon = document.querySelector('#cart-icon');
  cartIcon.setAttribute('data-quantity', quantity);
}




//dodavanje teksta
function loadAboutText() {
  fetch('about.txt')
    .then(response => response.text())
    .then(data => {
      // Postavljanje učitanog teksta u određeni kontejner
      document.getElementById('aboutTextContainer').innerText = data;
    })
    .catch(error => {
      console.error('Došlo je do greške:', error);
    });
}

// Poziv funkcije za učitavanje teksta kada se stranica učita
//window.onload = loadAboutText;

// main.js
document.addEventListener('DOMContentLoaded', function () {
  var productImages = document.querySelectorAll('.product-img');
  
  // Dodajte događaj na klik slike
  productImages.forEach(function(productImage) {
    productImage.addEventListener('click', function () {
      // Kreirajte element za prikaz velike slike
      var overlay = document.createElement('div');
      overlay.className = 'overlay';
      
      // Kreirajte element za prikaz velike slike
      var enlargedImage = document.createElement('img');
      enlargedImage.src = productImage.src;
      enlargedImage.alt = productImage.alt;
      
      // Dodajte sliku u prekrivač
      overlay.appendChild(enlargedImage);
      
      // Dodajte prekrivač na telo dokumenta
      document.body.appendChild(overlay);
      
      // Dodajte događaj za zatvaranje prekrivača na klik
      overlay.addEventListener('click', function () {
        document.body.removeChild(overlay);
      });
    });
  });
});
