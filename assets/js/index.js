APIdata = fetch("https://fakestoreapi.com/products/")
  .then((res) => res.json())
  //   Loader Goes Here 
  .then((data) => {

    const productContainer = document.getElementById('product-container');

    for (let i = 0; i < data.length; i++) {
      const product = data[i];    //All Products 
      const productDiv = document.createElement('div');
      productDiv.classList.add(`product${i}`);
      productDiv.classList.add(`productDiv`);
      productDiv.innerHTML = `
    <div class='product'> 
    <img class='product-image' src="${product.image}" alt="img">
    <h1>${product.title}</h1> <h6 class='price'>$ ${product.price}</h6>
    <div class ="desc hide-desc"> 
    <p>${product.description}</p>
    <p>Rating: ${product.rating.rate} </p>
    <p>Count:${product.rating.count} </p>
    </div>
    <div class ="func-btn">
    <div class ="add-to-cart button"> <button class="cart-btn">Add To Cart</button> </div> 
    <div class ="show-desc button"> <button>Show More</button> </div> 
    </div>
    </div> 
    `;

      productContainer.appendChild(productDiv);
    }

    // Add event listener to "Show More" button
    const showMoreBtns = document.querySelectorAll('.show-desc button');
    showMoreBtns.forEach((button) => {
      button.addEventListener('click', () => {
        const productDiv = button.closest('.product');
        const desc = productDiv.querySelector('.desc');
        desc.classList.toggle('show-desc');
        desc.classList.toggle('hide-desc');
        button.innerText = desc.classList.contains('show-desc') ? 'Show Less' : 'Show More';
      });
    });


    // Add To Cart Functions

    const addToCartButtons = document.querySelectorAll('.cart-btn');
    //All 20 Cart Buttons

    addToCartButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        // selecting only the button clicked
        addToCart(e, button);
      });
    });

    // Initialize cart items array and total
    let cartItemsArray = [];
    let total = 0;

    //Main Function
    function addToCart(e) {
      // Get product details
      //selects the closest div with class product 
      const productDiv = e.target.closest('.product');
      //title from the product div
      const title = productDiv.querySelector('h1').textContent;
      //price from the product div 
      const price = productDiv.querySelector('.price').textContent;
      //image from the product div
      const image = productDiv.querySelector('.product-image').src;

      // If the item already exists increment the value
      const existingItem = findCartItem(title)
      if (existingItem) {
        updateCartItem(existingItem)
      }
      // If the item does not exist new item obj created
      else {
        const numericPrice = parseFloat(price.replace('$', ''));
        const item = {
          title,
          price,
          image,
          itemPrice: numericPrice,
          counter: 1,
          itemTotal: numericPrice,
        }
        // Pushes the item obj to the function
        addCartItem(item)
      }
      // Displaying The Cart 
      showCart()
    }

    // Function To Check if the item exists in existing array
    function findCartItem(title) {
      // find method: if true returns the value else false
      return cartItemsArray.find(item => item.title === title)
    }

    // If Item Already Exists 
    function updateCartItem(item) {
      item.counter++;
      item.itemTotal = item.itemPrice * item.counter;
      total += item.itemPrice;
      updateTotal();
      // Call function to update the counter value in HTML
      updateCartItemCounter(item);
    }

    function updateCartItemCounter(item) {
      // To Get item's div using data-title attribute
      const itemDiv = document.getElementById(`${item.title}`);
      // to Get the counter element
      const counterSpan = itemDiv.querySelector('#counter');
      // To Update the counter value in HTML
      counterSpan.textContent = item.counter;
    }


    // Adding New Item To Cart
    function addCartItem(item) {
      // item obj pushed to array
      cartItemsArray.push(item)
      // Creates itemDiv Element with the item obj value 
      const itemDiv = createCartItemElement(item)
      // itemDiv Added To cart-items div
      appendCartItemElement(itemDiv)
      total += item.itemTotal;
      updateTotal();
      showCart()
    }

    //To Add itemDiv To cart-items div
    function appendCartItemElement(itemDiv) {
      const cartItems = document.getElementById('cart-items');
      cartItems.appendChild(itemDiv);
    }

    // To Update Total Value For When Each New Item Added To Array
    function updateTotal() {
      //Reset total before updating
      total = 0;
      // forEach in array to add all price values
      cartItemsArray.forEach(item => {
        total += item.itemTotal
      });
      // Get HTML Total Div
      const totalDiv = document.querySelector('.total-sum')
      totalDiv.textContent = `Total: $${total.toFixed(2)}`
    }

    // itemDiv HTML Element 
    function createCartItemElement(item) {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item-cart');
      itemDiv.setAttribute('id', `${item.title}`)
      itemDiv.innerHTML = `<div class='container'>
        <img class='cart-img' src=${item.image} /> 
        <div class="title">${item.title}</div>
        <div class="c-price">${item.price}</div>
        <div class="qty-counter">
          <span>
            <button id='minus'>-</button>
            <span id='counter'>${item.counter}</span>
            <button id='plus'>+</button>
          </span>
        </div>
      </div>`;

      // Getting All Plus Minus & Counter Elements
      const minusBtn = itemDiv.querySelector('#minus');
      const plusBtn = itemDiv.querySelector('#plus');
      const counterSpan = itemDiv.querySelector('#counter');

      minusBtn.addEventListener('click', () => {
        if (item.counter > 1) {
          item.counter--;
          item.itemTotal = item.itemPrice * item.counter;
          total -= item.itemPrice;
          updateTotal();
          // Update counter value in HTML
          counterSpan.textContent = item.counter;
        } else {
          removeCartItem(item, itemDiv);
        }
      });

      plusBtn.addEventListener('click', () => {
        item.counter++;
        item.itemTotal = item.itemPrice * item.counter;
        total += item.itemPrice;
        updateTotal();
        // To Update counter value in HTML
        counterSpan.textContent = item.counter;
      });

      return itemDiv;
    }


    // Function To Remove The Cart Item
    function removeCartItem(item, itemDiv) {
      // To Get The Index Of The item to remove
      const index = cartItemsArray.findIndex(i => i.title === item.title)
      // splicing from the array
      cartItemsArray.splice(index, 1)
      // Removing the div with the item
      itemDiv.remove()
      // updating total value 
      total -= item.itemTotal;
      updateTotal()
      // If No item is found in the array close cart 
      if (cartItemsArray.length === 0) {
        closeCart()
      }
    }

    // Called When An item is added to cart 
    function showCart() {
      const cart = document.getElementById('cart-products');
      cart.style.display = 'block';
    }


    //Called When 
    function hideCart() {
      const hidecart = document.querySelector('.hide-cart');
      if (hidecart) {
        hidecart.classList.add('hide-cart')
      }
    }

    // Get the close button element
    const closeButton = document.querySelector('.close-cart')
    // console.log(closeButton)

    // Add event listener to the close button
    closeButton.addEventListener('click', closeCart);

    // Function to close the cart
    function closeCart() {
      console.log('closeCart Function called')
      const cart = document.querySelector('#cart-products')
      cart.style.display = 'none'
    }

    // Searching Using The Nav-Search 

    const searchMenu = document.getElementById('search-menu')

    searchMenu.addEventListener('input', function (e) {
      // To get the search term from the input 
      const searchTerm = this.value.toLowerCase()
      // Filtering The Fetched Products Based On The Search Term
      const filteredProducts = data.filter(function (product) {
        return product.title.toLowerCase().includes(searchTerm)
      })
      // To display only the filtered Products
      updateProductDisplay(filteredProducts)

    })

    // Function To update the display on search
    function updateProductDisplay(products) {
      const productContainer = document.getElementById('product-container');
      productContainer.innerHTML = ''; // Clear existing products

      // Creating Divs For All The Matching Search Results 
      products.forEach(function (product) {
        // Creating The  HTML Element Of The Result 
        const productElement = createProductElement(product);
        // Appending Result To The Main Div 
        productContainer.appendChild(productElement);
      });
    }

    function createProductElement(product) {
      const productDiv = document.createElement('div');
      productDiv.classList.add('productDiv');
    
      const title = document.createElement('h1');
      title.textContent = product.title;
      productDiv.appendChild(title);
    
      const price = document.createElement('div');
      price.classList.add('price');
      price.textContent = product.price;
      productDiv.appendChild(price);
    
      const image = document.createElement('img');
      image.classList.add('product-image'); // Added class name 'product-image'
      image.src = product.image;
      productDiv.appendChild(image);


      // // Add to Cart button
      // const addToCartButton = document.createElement('button');
      // addToCartButton.textContent = 'Add to Cart';
      // addToCartButton.classList.add('add-to-cart');
      // productDiv.appendChild(addToCartButton);

      // // Show More button
      // const showMoreButton = document.createElement('button');
      // showMoreButton.textContent = 'Show More';
      // showMoreButton.classList.add('show-more');
      // productDiv.appendChild(showMoreButton);

      return productDiv;
    }

  }).catch((err => console.log(err)));







