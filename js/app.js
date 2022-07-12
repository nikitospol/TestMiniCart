let carts = document.querySelectorAll('.addToCart');
let products = [
	{
		id: 1,
		name: 'Scrab for body',
		tag:'scrab',
		price:10999,
		inCart: 0
	},
	{
		id: 2,
		name: 'Perfect Body Cream',
		tag: 'cream',
		price: 12999,
		inCart: 0
	},
	{
		id: 3,
		name: 'Buster',
		tag: 'buster',
		price: 16999,
		inCart: 0
	},
	{
		id: 4,
		name: 'Дневная эссенция',
		tag: 'essence',
		price: 13999,
		inCart: 0
	}
];

carts.forEach(btn => {
	btn.addEventListener('click', () => {
		let product_item = products.find(x => x.id === parseInt(btn.dataset.id));
		cartNumbers(product_item);
		totalCost(product_item);
		if (window.matchMedia('(media:768px)').matches) {
			showCart();
		}
	});
});

function onLoadCartNumbers() {
	let productNumbers = localStorage.getItem('cartNumbers');
	if(productNumbers) {
		document.querySelector('.cart span').textContent = productNumbers;
	}
}

function cartNumbers(product, action) {
    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);

    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if( action ) {
        localStorage.setItem("cartNumbers", productNumbers - 1);
        document.querySelector('.cart span').textContent = productNumbers - 1;
    } else if( productNumbers ) {
        localStorage.setItem("cartNumbers", productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;
    } else {
        localStorage.setItem("cartNumbers", 1);
        document.querySelector('.cart span').textContent = 1;
    }
    setItems(product);
}

function setItems(product) {
	let cartItems = localStorage.getItem('productsInCart');
	cartItems = JSON.parse(cartItems);
	if (cartItems != null) {
    let currentProduct = product.tag;

		if (cartItems[currentProduct] == undefined) {
			cartItems = {
				...cartItems,
				[product.tag]: product
			}
		}
		cartItems[product.tag].inCart += 1;
	} else {
		product.inCart = 1;
		cartItems = {
			[product.tag]: product
		}
	}
	localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

function totalCost( product, action ) {
    let cart = localStorage.getItem("totalCost");

    if( action) {
        cart = parseInt(cart);

        localStorage.setItem("totalCost", cart - product.price);
    } else if(cart != null) {

        cart = parseInt(cart);
        localStorage.setItem("totalCost", cart + product.price);

    } else {
        localStorage.setItem("totalCost", product.price);
    }
}

function displayCart() {
	let cartItems = localStorage.getItem("productsInCart");
	cartItems = JSON.parse(cartItems);
	let cart = localStorage.getItem("totalCost");
  cart = parseInt(cart);
	let productContainer = document.querySelector(".products");
	if (cartItems && productContainer ) {
		productContainer.innerHTML = '';
		Object.values(cartItems).map(item => {
			productContainer.innerHTML +=`
			<div class="product-wrap">
				<div class="product-mini col-4">
					<i class=" fa-solid fa-xmark " data-tag="${item.tag}"></i>
					<img src="img/${item.tag}.jpg">
					<span>${item.name}</span>
				</div>
				<div class="mini-price col-3">¥${item.price}</div>
				<div class="quantity col-2">
					<i class="fa-solid fa-chevron-left decrease" data-tag="${item.tag}"></i>
					<span>${item.inCart}</span>
					<i class="fa-solid fa-chevron-right increase" data-tag="${item.tag}"></i>
				</div>
				<div class="total col-3">
					¥${item.inCart * item.price}
				</div>
			</div>
			`;
		});
		productContainer.innerHTML += `
			<div class="mini-cart_bottom">
				<h4 class="mini-cart_txt">Итого:</h4>
				<div>
					<div class="priceTotalCurrent">¥${cart}</div>
					<div class="newCurrencies">~${(cart*0.46).toFixed(2)} ₽/ $${(cart*0.0073).toFixed(2)}/ €${(cart*0.0072).toFixed(2)}</div>
				<div.
			</div>
		`;
		productContainer.innerHTML += `
		<div class="checkout text-center" id="checkout"><a href="https://www.shiawasedo.co.jp/cart" class="btn btn-default">Перейти к оформлению заказа</a></div>
		`;
		manageQuantity();
		deleteButtons();
	}

}

function toggleCart() {
	displayCart();
	miniCart.classList.toggle('mini-cart--visible');
}

function showCart() {
	displayCart();
	miniCart.classList.add('mini-cart--visible');
}

function manageQuantity() {
	let decreaseButtons = document.querySelectorAll('.decrease');
	let increaseButtons = document.querySelectorAll('.increase');
	let currentProduct = '';
	let cartItems = localStorage.getItem('productsInCart');
	cartItems = JSON.parse(cartItems);

	decreaseButtons.forEach(btn => {
		btn.addEventListener('click', () =>{
			currentProduct = btn.dataset.tag
			if( cartItems[currentProduct].inCart > 1 ) {
				cartItems[currentProduct].inCart -= 1;
				cartNumbers(cartItems[currentProduct], "decrease");
				totalCost(cartItems[currentProduct], "decrease");
				localStorage.setItem('productsInCart', JSON.stringify(cartItems));
				displayCart();
			}
		});
	});

	increaseButtons.forEach(btn => {
		btn.addEventListener('click', () =>{
			currentProduct = btn.dataset.tag
			cartItems[currentProduct].inCart += 1;
			cartNumbers(cartItems[currentProduct]);
			totalCost(cartItems[currentProduct]);
			localStorage.setItem('productsInCart', JSON.stringify(cartItems));
			displayCart();
		});
	});
}

function deleteButtons() {
	let deleteButtons = document.querySelectorAll('.fa-xmark');
	let productNumbers = localStorage.getItem('cartNumbers');
	let cartCost = localStorage.getItem("totalCost");
	let cartItems = localStorage.getItem('productsInCart');
	cartItems = JSON.parse(cartItems);
	let productName;

	deleteButtons.forEach(btn => {
		btn.addEventListener('click', () => {
			productName = btn.dataset.tag;
			let product = products.find(x => x.tag)

			localStorage.setItem('cartNumbers', productNumbers - cartItems[productName].inCart);
			localStorage.setItem('totalCost', cartCost - ( cartItems[productName].price * cartItems[productName].inCart));

			delete cartItems[productName];
			localStorage.setItem('productsInCart', JSON.stringify(cartItems));
			let product_item = products.find(x => x.tag === productName);
			product_item.inCart = 0;

			displayCart();
			onLoadCartNumbers();
		});
	});
}


onLoadCartNumbers();

const miniCart = document.querySelector('.mini-cart');
const miniCartBtn = document.querySelector('.shoppingcart');


miniCartBtn.addEventListener('click', () => { toggleCart(); });

