const cartModal = document.getElementById("cart-modal");
const clearCartModal = document.getElementById("clear-cart-modal");
const productsContainer = document.getElementById("products-container");
const dessertCards = document.getElementById("dessert-card-container");
const cartBtn = document.getElementById("cart-btn");
const closeCartBtn = document.getElementById("close-cart");
const clearCartBtn = document.getElementById("clear-cart-btn");
const confirmClearBtn = document.getElementById("confirm-clear");
const cancelClearBtn = document.getElementById("cancel-clear");
const totalNumberOfItems = document.getElementById("total-items");
const cartSubTotal = document.getElementById("subtotal");
const cartTaxes = document.getElementById("taxes");
const cartTotal = document.getElementById("total");

const products = [
  {
    id: 1,
    name: "Vanilla Cupcakes (6 Pack)",
    price: 12.99,
    category: "Cupcake",
  },
  {
    id: 2,
    name: "French Macaron",
    price: 3.99,
    category: "Macaron",
  },
  {
    id: 3,
    name: "Pumpkin Cupcake",
    price: 3.99,
    category: "Cupcake",
  },
  {
    id: 4,
    name: "Chocolate Cupcake",
    price: 5.99,
    category: "Cupcake",
  },
  {
    id: 5,
    name: "Chocolate Pretzels (4 Pack)",
    price: 10.99,
    category: "Pretzel",
  },
  {
    id: 6,
    name: "Strawberry Ice Cream",
    price: 2.99,
    category: "Ice Cream",
  },
  {
    id: 7,
    name: "Chocolate Macarons (4 Pack)",
    price: 9.99,
    category: "Macaron",
  },
  {
    id: 8,
    name: "Strawberry Pretzel",
    price: 4.99,
    category: "Pretzel",
  },
  {
    id: 9,
    name: "Butter Pecan Ice Cream",
    price: 2.99,
    category: "Ice Cream",
  },
  {
    id: 10,
    name: "Rocky Road Ice Cream",
    price: 2.99,
    category: "Ice Cream",
  },
  {
    id: 11,
    name: "Vanilla Macarons (5 Pack)",
    price: 11.99,
    category: "Macaron",
  },
  {
    id: 12,
    name: "Lemon Cupcakes (4 Pack)",
    price: 12.99,
    category: "Cupcake",
  },
];

products.forEach(({ name, id, price, category }) => {
    dessertCards.innerHTML += `
        <div class="bg-white rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-500 group">
            <div class="aspect-square bg-neutral-100 flex items-center justify-center">
                <div class="text-4xl">🧁</div>
            </div>
            <div class="p-6">
                <div class="inline-block px-3 py-1 rounded-full text-sm bg-neutral-100 text-neutral-700 mb-3">${category}</div>
                <h2 class="text-lg font-semibold mb-2">${name}</h2>
                <div class="flex justify-between items-center">
                    <p class="text-2xl font-medium">$${price}</p>
                    <button 
                        id="${id}" 
                        class="bg-black text-white px-4 py-2 rounded-full hover:bg-neutral-800 transition-all duration-300 add-to-cart-btn">
                        Add to cart
                    </button>
                </div>
            </div>
        </div>
    `;
});

class ShoppingCart {
    constructor() {
        this.items = {};  // Changed to object to track quantities
        this.total = 0;
        this.taxRate = 8.25;
    }

    addItem(id, products) {
        const product = products.find((item) => item.id === id);
        
        if (!this.items[id]) {
            this.items[id] = {
                product,
                quantity: 0
            };
        }
        
        this.items[id].quantity++;
        this.updateCart();
    }

    removeItem(id) {
        if (this.items[id] && this.items[id].quantity > 0) {
            this.items[id].quantity--;
            if (this.items[id].quantity === 0) {
                delete this.items[id];
            }
            this.updateCart();
        }
    }

    deleteItem(id) {
        if (this.items[id]) {
            delete this.items[id];
            this.updateCart();
        }
    }

    updateCart() {
        productsContainer.innerHTML = "";
        
        for (const [id, item] of Object.entries(this.items)) {
            const { product, quantity } = item;
            productsContainer.innerHTML += `
                <div id="dessert${id}" class="flex items-center justify-between bg-neutral-50 p-4 rounded-2xl">
                    <div class="flex-1">
                        <p class="font-medium">${product.name}</p>
                        <p class="text-sm text-neutral-600">$${product.price} each</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2">
                            <button 
                                class="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-200 hover:bg-neutral-300 transition-colors"
                                onclick="cart.removeItem(${id})"
                            >
                                -
                            </button>
                            <span class="w-8 text-center">${quantity}</span>
                            <button 
                                class="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-200 hover:bg-neutral-300 transition-colors"
                                onclick="cart.addItem(${id}, products)"
                            >
                                +
                            </button>
                        </div>
                        <button 
                            class="text-red-500 hover:text-red-600 transition-colors"
                            onclick="cart.deleteItem(${id})"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"></path>
                                <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        }

        this.calculateTotal();
    }

    getCounts() {
        return Object.values(this.items).reduce((sum, item) => sum + item.quantity, 0);
    }

    clearCart() {
        this.items = {};
        this.total = 0;
        this.updateCart();
        totalNumberOfItems.textContent = 0;
        clearCartModal.classList.add('hidden');
        cartModal.classList.add('hidden');
    }

    calculateTaxes(amount) {
        return parseFloat(((this.taxRate / 100) * amount).toFixed(2));
    }

    calculateTotal() {
        const subTotal = Object.values(this.items).reduce(
            (total, item) => total + (item.product.price * item.quantity), 
            0
        );
        const tax = this.calculateTaxes(subTotal);
        this.total = subTotal + tax;
        totalNumberOfItems.textContent = this.getCounts();
        cartSubTotal.textContent = `$${subTotal.toFixed(2)}`;
        cartTaxes.textContent = `$${tax.toFixed(2)}`;
        cartTotal.textContent = `$${this.total.toFixed(2)}`;
        return this.total;
    }
}

// Initialize cart and event listeners
const cart = new ShoppingCart();
const addToCartBtns = document.getElementsByClassName("add-to-cart-btn");

[...addToCartBtns].forEach((btn) => {
    btn.addEventListener("click", (event) => {
        btn.classList.add("bg-green-500");
        setTimeout(() => btn.classList.remove("bg-green-500"), 200);
        cart.addItem(Number(event.target.id), products);
    });
});

// Modal control event listeners remain the same
cartBtn.addEventListener("click", () => {
    cartModal.classList.remove('hidden');
});

closeCartBtn.addEventListener("click", () => {
    cartModal.classList.add('hidden');
});

clearCartBtn.addEventListener('click', () => {
    clearCartModal.classList.remove('hidden');
});

confirmClearBtn.addEventListener('click', () => {
    cart.clearCart();
});

cancelClearBtn.addEventListener('click', () => {
    clearCartModal.classList.add('hidden');
});

// Close modals when clicking outside
[cartModal, clearCartModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
});