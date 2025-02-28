// Back 2 Top Button
let mybutton = document.getElementById("b2t");
        
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// Animation on Scroll

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visibleScrollAnimation');  
      } 
    });
});
  
const serviceCards = document.querySelectorAll('.hiddenScrollAnimation');
  
serviceCards.forEach(card => {
    observer.observe(card);
});


// Hamburger Menu

const hamburgerElement = document.getElementById('hamburger-btn');
const navMenuElement = document.querySelector('.hiddenNavMenu');

hamburgerElement.addEventListener('click', function(){
    navMenuElement.classList.toggle('visibleNavMenu')
    
    if (hamburgerElement.classList.contains('fa-bars')) {
        hamburgerElement.classList.remove('fa-bars');
        hamburgerElement.classList.add('fa-times');
    } else {
        hamburgerElement.classList.remove('fa-times');
        hamburgerElement.classList.add('fa-bars');
    }
});

// Quantity Buttons

function addQnt(el){
    let qnt = parseInt(el.previousElementSibling.innerHTML);
    let element = el;

    qnt++;
    element.previousElementSibling.innerHTML = qnt;
}

function lessQnt(el){
    let qnt = parseInt(el.nextElementSibling.innerHTML);
    let element = el;
    if(qnt > 0){
        qnt--;
    }
    element.nextElementSibling.innerHTML = qnt;
}

// Add to Cart

let cart = [];
let totalCost = 0;
let delivery = 5;

function addToCart(btn){
    const productCard = btn.closest('.productCard');
    const productName = productCard.querySelector('h3').innerHTML;
    const productPrice = parseFloat(productCard.querySelector('.productTotal').innerHTML);
    const productImage = productCard.querySelector('img').src;
    const productQuantity = parseInt(productCard.querySelector('#qnt').innerHTML);

    if(productQuantity > 0){
        const existingProduct = cart.find(item => item.name === productName);

        if(existingProduct){
            existingProduct.quantity += productQuantity;
            existingProduct.total += productPrice * productQuantity;
        }else{
            const product = {
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: productQuantity,
                total: productPrice * productQuantity,
            };
            cart.push(product);
        }
        if(totalCost >= 50){
            delivery = 0;
        }
        totalCost += productPrice * productQuantity + delivery;
        updateCart();

        productCard.querySelector('#qnt').innerHTML = '0';
    }else{
        alert("Quantity must be greater than 0");
    }

    const cartButton = document.querySelector('.hiddenCart');
    cartButton.classList.add('animated');
    setTimeout(function(){
        cartButton.classList.remove('animated');
    }, 500);
}

function updateCart(){
    const cartContainer = document.querySelector('.summary');
    const totalElement = document.querySelector('#total');
    const deliveryElement = document.querySelector('#delivery');

    cartContainer.innerHTML = '';

    cart.forEach((item) => {
        const productDiv = document.createElement('div');
        productDiv.classList.add("summaryProduct");

        productDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="summaryDetails">
                <p>${item.name}</p>
                <p>$ ${item.price}</p>
            </div>
            <p>x ${item.quantity}</p>
            <p>$ <span>${item.total.toFixed(2)}</span></p>
            <button class="minusBtn"><i class="fa-solid fa-minus"></i></button>
            <button class="plusBtn"><i class="fa-solid fa-plus"></i></button>
        `;

        cartContainer.appendChild(productDiv);

        const plusBtn = productDiv.querySelector('.plusBtn');
        plusBtn.addEventListener('click', () => {
            updateQuantity(item, 1);
        });

        const minusBtn = productDiv.querySelector('.minusBtn');
        minusBtn.addEventListener('click', () => {
            updateQuantity(item, -1);
        });
    });

    

    if(totalCost >= 50){
        deliveryElement.innerHTML = 'FREE';
        totalElement.innerHTML = totalCost.toFixed(2);
    }else{
        deliveryElement.innerHTML = '5 $';
        totalElement.innerHTML = parseFloat(totalCost.toFixed(2));
    }
}

function updateQuantity(prodName, change){
    const product = cart.find(item => item.name === prodName.name);

    if(product){
        product.quantity += change;
        product.total = product.price * product.quantity;
    }

    if(product.quantity <= 0){
        showDeleteConfirmation(prodName);
        return 0;
    }
    recalculateTotal();
    updateCart();
    
}

function showDeleteConfirmation(productElement){
    let deleteConfirmation = document.querySelector(".deleteContainer");
    deleteConfirmation.style.display = "flex";

    function deleteProduct(){
        const indexToRemove = cart.findIndex(item => item.name === productElement.name);
        if(indexToRemove !== -1) {
            cart.splice(indexToRemove,1);
            recalculateTotal();
            updateCart();
        }
        deleteConfirmation.style.display = 'none';
    }

    document.getElementById("deleteYes").addEventListener("click", deleteProduct);

    document.getElementById("deleteNo").addEventListener("click" , function(){
        deleteConfirmation.style.display = "none";
    })
}



function recalculateTotal() {
    totalCost = 0;
    cart.forEach(item => {
        totalCost += item.total ;
    });
}

document.querySelectorAll('#add2cart').forEach(button => {
    button.addEventListener('click', function(){
        addToCart(this);
    });
});



document.querySelector('.hiddenCart').addEventListener('click', function(){
    const cartContainer = document.querySelector('.cartContainer');

    cartContainer.classList.toggle("showCart");
    cartContainer.style = 'z-index: 3'
});