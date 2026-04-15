// Cart functionality
const Cart = {
    items: [],
    
    // Initialize cart
    init: function() {
        this.loadFromStorage();
        this.updateUI();
    },
    
    // Add item to cart
    addToCart: function(productId, quantity = 1) {
        const product = Products.data.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        this.updateUI();
        this.saveToStorage();
        Utils.showNotification(`${product.title} добавлен в корзину`, 'success');
    },
    
    // Update cart UI
    updateUI: function() {
        this.updateCartCount();
        this.updateCartItems();
    },
    
    // Update cart count
    updateCartCount: function() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    },
    
    // Update cart items in modal
    updateCartItems: function() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItems) return;
        
        cartItems.innerHTML = '';
        
        if (this.items.length === 0) {
            cartItems.innerHTML = '<p>Корзина пуста</p>';
            if (cartTotal) cartTotal.textContent = '0 ₽';
            return;
        }
        
        let total = 0;
        
        this.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            // Extract numeric price
            const price = parseInt(item.price.replace(/[^\d]/g, ''));
            const itemTotal = price * item.quantity;
            total += itemTotal;
            
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${item.price}</div>
                    <div class="cart-item-quantity">
                        <button class="decrease-quantity" data-id="${item.id}">-</button>
                        <input type="number" value="${item.quantity}" min="1" class="item-quantity" data-id="${item.id}">
                        <button class="increase-quantity" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">&times;</button>
            `;
            cartItems.appendChild(cartItem);
        });
        
        // Format total with commas
        if (cartTotal) {
            cartTotal.textContent = Utils.formatPrice(total);
        }
        
        this.attachCartEventListeners();
    },
    
    // Attach event listeners to cart items
    attachCartEventListeners: function() {
        document.querySelectorAll('.decrease-quantity').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                Cart.updateItemQuantity(id, -1);
            });
        });
        
        document.querySelectorAll('.increase-quantity').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                Cart.updateItemQuantity(id, 1);
            });
        });
        
        document.querySelectorAll('.item-quantity').forEach(input => {
            input.addEventListener('change', function() {
                const id = parseInt(this.getAttribute('data-id'));
                const quantity = parseInt(this.value);
                if (quantity < 1) {
                    this.value = 1;
                    Cart.updateItemQuantity(id, 0, 1);
                } else {
                    Cart.updateItemQuantity(id, 0, quantity);
                }
            });
        });
        
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                Cart.removeFromCart(id);
            });
        });
    },
    
    // Update item quantity
    updateItemQuantity: function(productId, change, setQuantity = null) {
        const item = this.items.find(item => item.id === productId);
        if (!item) return;
        
        if (setQuantity !== null) {
            item.quantity = setQuantity;
        } else {
            item.quantity += change;
        }
        
        if (item.quantity < 1) {
            this.removeFromCart(productId);
        } else {
            this.updateUI();
            this.saveToStorage();
        }
    },
    
    // Remove item from cart
    removeFromCart: function(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateUI();
        this.saveToStorage();
        Utils.showNotification('Товар удален из корзины', 'info');
    },
    
    // Calculate cart total
    calculateTotal: function() {
        return this.items.reduce((total, item) => {
            const price = parseInt(item.price.replace(/[^\d]/g, ''));
            return total + (price * item.quantity);
        }, 0);
    },
    
    // Clear cart
    clear: function() {
        this.items = [];
        this.updateUI();
        this.saveToStorage();
    },
    
    // Save cart to localStorage
    saveToStorage: function() {
        localStorage.setItem('mabutaCart', JSON.stringify(this.items));
    },
    
    // Load cart from localStorage
    loadFromStorage: function() {
        const savedCart = localStorage.getItem('mabutaCart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
    },
    
    // Handle checkout
    handleCheckout: function() {
        if (!Auth.currentUser) {
            document.getElementById('authModal').style.display = 'block';
            Utils.showNotification('Пожалуйста, войдите в систему для оформления заказа', 'info');
            return;
        }
        
        if (this.items.length === 0) {
            Utils.showNotification('Корзина пуста', 'error');
            return;
        }
        
        const order = {
            id: Date.now(),
            userId: Auth.currentUser.id,
            date: new Date().toISOString(),
            items: [...this.items],
            total: this.calculateTotal(),
            status: 'pending',
            address: Auth.currentUser.addresses.find(addr => addr.isDefault) || Auth.currentUser.addresses[0]
        };
        
        Orders.addOrder(order);
        this.clear();
        document.getElementById('cartModal').style.display = 'none';
        Utils.showNotification('Заказ успешно оформлен!', 'success');
        
        // Update account data if on account page
        if (document.getElementById('account').style.display === 'block') {
            Auth.updateAccountData();
        }
    }
};

// Make Cart available globally
window.Cart = Cart;