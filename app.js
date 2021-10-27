// const ls2 = new Storage();

function eventListeners() {
   document.addEventListener("DOMContentLoaded", () => {
      const products = new Product();
      const ui = new UI();


      ui.setupAPP();


      products
         .getproducts()
         .then((response) => {
            ui.displayProducts(response);
            Storage.saveProducts(response);

         })
         .then(() => {
            ui.getBagsButtons();
            ui.cartLogic();

         });
   });


}

eventListeners();

