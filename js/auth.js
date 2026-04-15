// Authentication and user management
const Auth = {
    currentUser: null,
    users: JSON.parse(localStorage.getItem('mabutaUsers')) || [],
    
    // Initialize auth
    init: function() {
        this.checkAuthStatus();
        this.updateUI();
    },
    
    // Check if user is logged in
    checkAuthStatus: function() {
        const savedUser = localStorage.getItem('mabutaCurrentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    },
    
    // Update user interface
    updateUI: function() {
        const userActions = document.getElementById('userActions');
        
        if (this.currentUser) {
            userActions.innerHTML = `
                <div class="user-profile" id="userProfile">
                    <div class="user-avatar">${this.currentUser.name.charAt(0).toUpperCase()}</div>
                    <span>${this.currentUser.name}</span>
                    <div class="user-menu">
                        <div class="user-menu-item" data-action="profile">Личный кабинет</div>
                        <div class="user-menu-item" data-action="orders">Мои заказы</div>
                        <div class="user-menu-item" data-action="logout">Выйти</div>
                    </div>
                </div>
            `;
            
            this.attachUserMenuListeners();
        } else {
            userActions.innerHTML = `
                <button class="auth-btn" id="loginBtn">Войти</button>
                <button class="auth-btn" id="registerBtn">Регистрация</button>
            `;
            
            document.getElementById('loginBtn').addEventListener('click', () => {
                document.getElementById('authModal').style.display = 'block';
                this.switchAuthTab('login');
            });
            
            document.getElementById('registerBtn').addEventListener('click', () => {
                document.getElementById('authModal').style.display = 'block';
                this.switchAuthTab('register');
            });
        }
    },
    
    // Attach user menu listeners
    attachUserMenuListeners: function() {
        const userProfile = document.getElementById('userProfile');
        if (!userProfile) return;
        
        userProfile.addEventListener('click', function(e) {
            e.stopPropagation();
            document.querySelector('.user-menu').classList.toggle('active');
        });
        
        document.querySelectorAll('.user-menu-item').forEach(item => {
            item.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                Auth.handleUserMenuAction(action);
            });
        });
        
        // Close user menu when clicking elsewhere
        document.addEventListener('click', function() {
            const userMenu = document.querySelector('.user-menu');
            if (userMenu) userMenu.classList.remove('active');
        });
    },
    
    // Handle user menu actions
    handleUserMenuAction: function(action) {
        switch (action) {
            case 'profile':
                this.showAccountSection();
                this.switchAccountTab('profile');
                break;
            case 'orders':
                this.showAccountSection();
                this.switchAccountTab('orders');
                break;
            case 'logout':
                this.handleLogout();
                break;
        }
    },
    
    // Show account section
    showAccountSection: function() {
        document.querySelectorAll('section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById('account').style.display = 'block';
        this.updateAccountData();
    },
    
    // Switch auth tab
    switchAuthTab: function(tabName) {
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}Form`).classList.add('active');
    },
    
    // Handle login
    handleLogin: function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('mabutaCurrentUser', JSON.stringify(user));
            this.updateUI();
            document.getElementById('authModal').style.display = 'none';
            Utils.showNotification('Успешный вход!', 'success');
        } else {
            Utils.showNotification('Неверный email или пароль', 'error');
        }
    },
    
    // Handle registration
    handleRegister: function(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        if (password !== confirmPassword) {
            Utils.showNotification('Пароли не совпадают', 'error');
            return;
        }
        
        if (!Utils.validateEmail(email)) {
            Utils.showNotification('Введите корректный email', 'error');
            return;
        }
        
        if (!Utils.validatePhone(phone)) {
            Utils.showNotification('Введите корректный телефон', 'error');
            return;
        }
        
        if (this.users.find(u => u.email === email)) {
            Utils.showNotification('Пользователь с таким email уже существует', 'error');
            return;
        }
        
        const newUser = {
            id: Date.now(),
            name,
            email,
            phone,
            password,
            registrationDate: new Date().toISOString(),
            addresses: [],
            orders: []
        };
        
        this.users.push(newUser);
        localStorage.setItem('mabutaUsers', JSON.stringify(this.users));
        
        this.currentUser = newUser;
        localStorage.setItem('mabutaCurrentUser', JSON.stringify(newUser));
        this.updateUI();
        document.getElementById('authModal').style.display = 'none';
        Utils.showNotification('Регистрация успешна!', 'success');
    },
    
    // Handle logout
    handleLogout: function() {
        this.currentUser = null;
        localStorage.removeItem('mabutaCurrentUser');
        this.updateUI();
        Utils.showNotification('Вы вышли из системы', 'info');
        
        // Return to home page
        document.querySelectorAll('section').forEach(section => {
            section.style.display = 'block';
        });
        document.getElementById('account').style.display = 'none';
    },
    
    // Update account data
    updateAccountData: function() {
        if (!this.currentUser) return;
        
        // Update welcome message
        document.getElementById('accountWelcome').textContent = `Добро пожаловать, ${this.currentUser.name}`;
        
        // Update stats
        const userOrders = Orders.getUserOrders(this.currentUser.id);
        document.getElementById('totalOrders').textContent = userOrders.length;
        document.getElementById('pendingOrders').textContent = userOrders.filter(o => o.status === 'pending').length;
        document.getElementById('totalSpent').textContent = Utils.formatPrice(userOrders.reduce((sum, order) => sum + order.total, 0));
        document.getElementById('userSince').textContent = new Date(this.currentUser.registrationDate).getFullYear();
        
        // Update profile form
        document.getElementById('profileName').value = this.currentUser.name;
        document.getElementById('profileEmail').value = this.currentUser.email;
        document.getElementById('profilePhone').value = this.currentUser.phone;
        if (this.currentUser.birthdate) {
            document.getElementById('profileBirthdate').value = this.currentUser.birthdate;
        }
        
        // Update orders table
        this.updateOrdersTable();
        
        // Update addresses
        this.updateAddressesList();
    },
    
    // Update orders table
    updateOrdersTable: function() {
        const ordersTable = document.getElementById('ordersTable');
        const userOrders = Orders.getUserOrders(this.currentUser.id);
        
        if (userOrders.length === 0) {
            ordersTable.innerHTML = '<tr><td colspan="5" style="text-align: center;">У вас пока нет заказов</td></tr>';
            return;
        }
        
        ordersTable.innerHTML = userOrders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${new Date(order.date).toLocaleDateString('ru-RU')}</td>
                <td>${Utils.formatPrice(order.total)}</td>
                <td><span class="status status-${order.status}">${Utils.getStatusText(order.status)}</span></td>
                <td><button class="btn" onclick="Auth.viewOrderDetails(${order.id})">Подробнее</button></td>
            </tr>
        `).join('');
    },
    
    // View order details
    viewOrderDetails: function(orderId) {
        const order = Orders.getOrder(orderId);
        if (order) {
            alert(`Детали заказа #${order.id}\nСтатус: ${Utils.getStatusText(order.status)}\nСумма: ${Utils.formatPrice(order.total)}\nДата: ${new Date(order.date).toLocaleDateString('ru-RU')}`);
        }
    },
    
    // Update addresses list
    updateAddressesList: function() {
        const addressList = document.getElementById('addressList');
        
        if (!this.currentUser.addresses || this.currentUser.addresses.length === 0) {
            addressList.innerHTML = '<p>У вас нет сохраненных адресов</p>';
            return;
        }
        
        addressList.innerHTML = this.currentUser.addresses.map((address, index) => `
            <div class="address-card">
                ${address.isDefault ? '<span class="default-address">Основной</span>' : ''}
                <h4>${address.name}</h4>
                <p>${address.street}</p>
                <p>${address.city}, ${address.postalCode}</p>
                <p>${address.country}</p>
                <div class="address-actions">
                    <button class="address-action" onclick="Auth.editAddress(${index})">✏️</button>
                    <button class="address-action" onclick="Auth.deleteAddress(${index})">🗑️</button>
                    ${!address.isDefault ? `<button class="address-action" onclick="Auth.setDefaultAddress(${index})">⭐</button>` : ''}
                </div>
            </div>
        `).join('');
    },
    
    // Add new address
    addNewAddress: function() {
        const address = {
            name: 'Новый адрес',
            street: 'ул. Примерная, д. 1',
            city: 'Москва',
            postalCode: '123456',
            country: 'Россия',
            isDefault: this.currentUser.addresses.length === 0
        };
        
        if (!this.currentUser.addresses) {
            this.currentUser.addresses = [];
        }
        
        this.currentUser.addresses.push(address);
        this.saveUserData();
        this.updateAddressesList();
        Utils.showNotification('Адрес добавлен', 'success');
    },
    
    // Edit address
    editAddress: function(index) {
        const newStreet = prompt('Введите новый адрес:', this.currentUser.addresses[index].street);
        if (newStreet) {
            this.currentUser.addresses[index].street = newStreet;
            this.saveUserData();
            this.updateAddressesList();
            Utils.showNotification('Адрес обновлен', 'success');
        }
    },
    
    // Delete address
    deleteAddress: function(index) {
        if (confirm('Удалить этот адрес?')) {
            this.currentUser.addresses.splice(index, 1);
            this.saveUserData();
            this.updateAddressesList();
            Utils.showNotification('Адрес удален', 'success');
        }
    },
    
    // Set default address
    setDefaultAddress: function(index) {
        this.currentUser.addresses.forEach(addr => addr.isDefault = false);
        this.currentUser.addresses[index].isDefault = true;
        this.saveUserData();
        this.updateAddressesList();
        Utils.showNotification('Основной адрес изменен', 'success');
    },
    
    // Handle profile update
    handleProfileUpdate: function(e) {
        e.preventDefault();
        this.currentUser.name = document.getElementById('profileName').value;
        this.currentUser.email = document.getElementById('profileEmail').value;
        this.currentUser.phone = document.getElementById('profilePhone').value;
        this.currentUser.birthdate = document.getElementById('profileBirthdate').value;
        
        this.saveUserData();
        this.updateUI();
        Utils.showNotification('Профиль обновлен', 'success');
    },
    
    // Handle password change
    handlePasswordChange: function(e) {
        e.preventDefault();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        
        if (currentPassword !== this.currentUser.password) {
            Utils.showNotification('Текущий пароль неверен', 'error');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            Utils.showNotification('Новые пароли не совпадают', 'error');
            return;
        }
        
        this.currentUser.password = newPassword;
        this.saveUserData();
        document.getElementById('securityForm').reset();
        Utils.showNotification('Пароль изменен', 'success');
    },
    
    // Save user data
    saveUserData: function() {
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = this.currentUser;
            localStorage.setItem('mabutaUsers', JSON.stringify(this.users));
            localStorage.setItem('mabutaCurrentUser', JSON.stringify(this.currentUser));
        }
    },
    
    // Switch account tab
    switchAccountTab: function(tabName) {
        document.querySelectorAll('.account-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.account-content').forEach(content => {
            content.classList.remove('active');
        });
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}Content`).classList.add('active');
    }
};

// Orders management
const Orders = {
    orders: JSON.parse(localStorage.getItem('mabutaOrders')) || [],
    
    // Add new order
    addOrder: function(order) {
        this.orders.push(order);
        localStorage.setItem('mabutaOrders', JSON.stringify(this.orders));
    },
    
    // Get user orders
    getUserOrders: function(userId) {
        return this.orders.filter(order => order.userId === userId);
    },
    
    // Get order by ID
    getOrder: function(orderId) {
        return this.orders.find(order => order.id === orderId);
    }
};

// Make Auth and Orders available globally
window.Auth = Auth;
window.Orders = Orders;