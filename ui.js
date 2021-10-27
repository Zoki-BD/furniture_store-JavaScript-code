class UI {
   constructor() {
      this.productsDOM = document.querySelector(".products-center");
      this.buttonsDOM = [];
      this.cart = [];
      this.cartItems = document.querySelector(".cart-items");
      this.cartTotal = document.querySelector(".cart-total");
      this.cartContent = document.querySelector(".cart-content");
      this.cartOverlay = document.querySelector(".cart-overlay");
      this.cartDOM = document.querySelector(".cart");
      this.cartBtn = document.querySelector(".cart-btn");
      this.closeCartBtn = document.querySelector(".close-cart");
      this.clearCartBtn = document.querySelector(".clear-cart");
      this.modal = document.querySelector('.modal fade');

   }

   displayProducts(products) {
      let result = "";

      products.forEach((product) => {
         result += `
          <article class="product">
          <div class="img-container">
            <img
              src="${product.image}"
              alt="product"
              class="product-img"
            />
            <!-- data-id e slicno na onCLick,za da znae koj element da raboti so kopceto -->
            <button class="bag-btn" data-id="${product.id}">
              <i class="fas fa-shopping-cart"></i>
              add to cart
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>${product.price}</h4>
        </article>
         `;
      });
      this.productsDOM.innerHTML = result;
   }

   getBagsButtons() {
      //preku spread metodot na JS kreirame odma array na buttons
      const buttons = [...document.querySelectorAll(".bag-btn")];

      this.buttonsDOM = buttons;

      buttons.forEach((button) => {
         let id = button.dataset.id;


         let inCart = this.cart.find((item) => item.id === id);

         if (inCart) {

            button.innerText = "In Cart";
            button.disabled = true;
         }


         button.addEventListener("click", (e) => {
            e.target.innerText = "In cart";
            e.target.disabled = true;


            let cartItem = { ...Storage.getProduct(id), amount: 1 };

            this.cart = [...this.cart, cartItem];

            Storage.saveCart(this.cart);
            this.setCartValues(this.cart);
            this.addCartItem(cartItem);
            this.showCart();
         });
      });
   }
   setCartValues(cart) {
      //deklar.2 novi props so default 0 value
      let tempTotal = 0;
      let itemsTotal = 0;
      cart.map((item) => {

         tempTotal += item.price * item.amount;
         itemsTotal += item.amount;
      });


      this.cartTotal.innerText = parseFloat(tempTotal.toFixed(2));//for 2 decimals
      this.cartItems.innerHTML = itemsTotal;
   }

   addCartItem(item) {
      const div = document.createElement("div");

      div.innerHTML = `
           <img src=${item.image} alt="product" />
              <div>
                <h4>${item.title}</h4>
                <h5>$${item.price}</h5>
                <span class="remove-item" data-id=${item.id}>remove</span>
				<a href="#" data-toggle="modal" data-target="#recipe" data-id="${item.id}" class="btn btn-success " >
				View Product
		   </a>
              </div>
              <div>
                <i class="fas fa-chevron-up" data-id=${item.id}></i>
                <p class="item-amount">${item.amount}</p>
                <i class="fas fa-chevron-down" data-id=${item.id}></i>
              </div>
         `;

      div.classList.add("cart-item");
      this.cartContent.appendChild(div);
   }

   showCart() {
      this.cartDOM.classList.add("showCart");
      this.cartOverlay.classList.add("transparentBcg");
   }


   setupAPP() {

      this.cart = Storage.getCart();


      this.setCartValues(this.cart);


      this.populateCart(this.cart);


      this.cartBtn.addEventListener("click", () => {
         this.showCart();
      });


      this.closeCartBtn.addEventListener("click", () => {
         this.hideCart();
      });
   }

   populateCart(cart) {
      cart.forEach((item) => {
         this.addCartItem(item);
      });
   }


   hideCart() {
      this.cartDOM.classList.remove("showCart");
      this.cartOverlay.classList.remove("transparentBcg");
   }


   cartLogic() {
      //clear cart button
      this.clearCartBtn.addEventListener("click", () => this.clearCart());
      //cart funcionality. increase decrease.

      this.cartContent.addEventListener("click", (e) => {
         if (e.target.classList.contains("remove-item")) {
            let removeItem = e.target;
            let id = removeItem.dataset.id;
            this.cartContent.removeChild(removeItem.parentElement.parentElement);
            this.removeItem(id);
         } else if (e.target.classList.contains("fa-chevron-up")) {
            let addAmount = e.target;
            let id = addAmount.dataset.id;
            let tempItem = this.cart.find((item) => item.id === id);
            tempItem.amount = tempItem.amount + 1;
            Storage.saveCart(this.cart);
            this.setCartValues(this.cart);
            addAmount.nextElementSibling.innerText = tempItem.amount;
         } else if (e.target.classList.contains("fa-chevron-down")) {
            let lowerAmount = e.target;
            let id = lowerAmount.dataset.id;
            let tempItem = this.cart.find((item) => item.id === id);
            tempItem.amount = tempItem.amount - 1;
            if (tempItem.amount > 0) {
               Storage.saveCart(this.cart);
               this.setCartValues(this.cart);
               lowerAmount.previousElementSibling.innerText = tempItem.amount;
            } else {

               this.cartContent.removeChild(lowerAmount.parentElement.parentElement);
               this.removeItem(id);
            }
         }
         else if (e.target.classList.contains("btn btn-success")) {
            console.log(e.target.classList.contains("btn btn-success"))
         }

      });
   }

   clearCart() {
      let cartItems = this.cart.map((item) => item.id);
      cartItems.forEach((id) => this.removeItem(id));


      while (this.cartContent.children.length > 0) {
         this.cartContent.removeChild(this.cartContent.children[0]);
      }
      this.hideCart();
   }


   removeItem(id) {
      this.cart = this.cart.filter((item) => item.id !== id);
      this.setCartValues(this.cart);

      Storage.saveCart(this.cart);

      let button = this.getSingleButton(id); //to show add no inCart
      button.disabled = false;
      button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
   }
   getSingleButton(id) {
      return this.buttonsDOM.find((button) => button.dataset.id === id);
   }
}
