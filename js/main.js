// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modules
    Cart.init();
    Auth.init();
    initCarousel();

    
    // Set up global state
    const state = {
        currentPage: 1,
        itemsPerPage: 6,
        currentFilter: 'all',
        isDarkTheme: false
    };
    
    // Initialize products
    initializeProducts(state);
    
    // Set up event listeners
    setupEventListeners(state);
    
    // Load saved theme
    loadSavedTheme(state);
});

// Initialize products
function initializeProducts(state) {
    const filteredProducts = Products.filterProducts(state.currentFilter);
    Products.renderProducts(filteredProducts, state.currentPage, state.itemsPerPage);
    Products.renderPagination(
        filteredProducts.length, 
        state.itemsPerPage, 
        state.currentPage, 
        (page) => {
            state.currentPage = page;
            initializeProducts(state);
        }
    );
}

// Set up event listeners
function setupEventListeners(state) {
    // Theme Toggle
    document.getElementById('themeToggle').addEventListener('click', () => toggleTheme(state));
    
    // Mobile Menu
    document.querySelector('.mobile-menu-btn').addEventListener('click', toggleMobileMenu);
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });
    
    // Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            setActiveFilter(filter, state);
        });
    });
    
    // Auth Tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            Auth.switchAuthTab(tabName);
        });
    });
    
    // Auth Forms
    document.getElementById('loginForm').addEventListener('submit', (e) => Auth.handleLogin(e));
    document.getElementById('registerForm').addEventListener('submit', (e) => Auth.handleRegister(e));
    document.getElementById('profileForm').addEventListener('submit', (e) => Auth.handleProfileUpdate(e));
    document.getElementById('securityForm').addEventListener('submit', (e) => Auth.handlePasswordChange(e));
    
    // Account Tabs
    document.querySelectorAll('.account-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            Auth.switchAccountTab(tabName);
        });
    });
    
    // Add Address Button
    document.getElementById('addAddressBtn').addEventListener('click', () => Auth.addNewAddress());
    
    // Modal Close Buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('productModal').style.display = 'none';
            document.getElementById('cartModal').style.display = 'none';
            document.getElementById('authModal').style.display = 'none';
        });
    });
    
    // Cart Icon
    document.getElementById('cartIcon').addEventListener('click', function() {
        document.getElementById('cartModal').style.display = 'block';
    });
    
    // Continue Shopping Button
    document.getElementById('continueShopping').addEventListener('click', function() {
        document.getElementById('cartModal').style.display = 'none';
    });
    
    // Checkout Button
    document.getElementById('checkout').addEventListener('click', () => Cart.handleCheckout());
    
    // Chat Bot
    setupChatBot();
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === document.getElementById('productModal')) {
            document.getElementById('productModal').style.display = 'none';
        }
        if (e.target === document.getElementById('cartModal')) {
            document.getElementById('cartModal').style.display = 'none';
        }
        if (e.target === document.getElementById('authModal')) {
            document.getElementById('authModal').style.display = 'none';
        }
    });
}

// Theme management
function toggleTheme(state) {
    state.isDarkTheme = !state.isDarkTheme;
    document.body.classList.toggle('dark-theme', state.isDarkTheme);
    document.getElementById('themeToggle').textContent = state.isDarkTheme ? '☀️' : '🌙';
    localStorage.setItem('mabutaTheme', state.isDarkTheme ? 'dark' : 'light');
}

function loadSavedTheme(state) {
    const savedTheme = localStorage.getItem('mabutaTheme');
    if (savedTheme === 'dark') {
        state.isDarkTheme = true;
        document.body.classList.add('dark-theme');
        document.getElementById('themeToggle').textContent = '☀️';
    }
}

// Mobile menu
function toggleMobileMenu() {
    document.querySelector('nav ul').classList.toggle('active');
}

// Navigation
function navigateToPage(page) {
    // Remove active class from all links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to clicked link
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    // Scroll to section
    if (page === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        const section = document.getElementById(page);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Close mobile menu
    document.querySelector('nav ul').classList.remove('active');
}

// Filter products
function setActiveFilter(filter, state) {
    state.currentFilter = filter;
    state.currentPage = 1;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });
    
    initializeProducts(state);
}

// Chat bot functionality
function setupChatBot() {
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const sendMessageBtn = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInput');
    
    chatToggle.addEventListener('click', () => {
        chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
    });
    
    sendMessageBtn.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    document.querySelector('.close-chat').addEventListener('click', function() {
        chatWindow.style.display = 'none';
    });
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.textContent = message;
    chatMessages.appendChild(userMessage);
    
    // Clear input
    chatInput.value = '';
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simulate bot response
    setTimeout(() => {
        const botResponse = getBotResponse(message);
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot-message';
        botMessage.textContent = botResponse;
        chatMessages.appendChild(botMessage);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('привет') || lowerMessage.includes('здравствуйте')) {
        return 'Здравствуйте! Чем могу помочь?';
    } else if (lowerMessage.includes('каталог') || lowerMessage.includes('товар')) {
        return 'У нас широкий ассортимент военного оборудования. Вы можете ознакомиться с каталогом на главной странице.';
    } else if (lowerMessage.includes('доставка')) {
        return 'Доставка осуществляется по всему миру. Сроки и стоимость зависят от региона.';
    } else if (lowerMessage.includes('цена') || lowerMessage.includes('стоимость')) {
        return 'Цены на товары указаны в карточках товаров. Для оптовых заказов предоставляются скидки.';
    } else if (lowerMessage.includes('контакт') || lowerMessage.includes('связь')) {
        return 'Наши контакты указаны в подвале сайта. Вы также можете оставить заявку, и мы свяжемся с вами.';
    } else if (lowerMessage.includes('регистрация') || lowerMessage.includes('аккаунт')) {
        return 'Для регистрации нажмите кнопку "Регистрация" в правом верхнем углу сайта.';
    } else if (lowerMessage.includes('личный кабинет')) {
        return 'В личном кабинете вы можете просматривать историю заказов, управлять профилем и адресами доставки.';
    } else {
        return 'Извините, я не совсем понял ваш вопрос. Вы можете обратиться к нашему менеджеру по телефону, указанному на сайте.';
    }
}
// Карусель
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    
    // Проверяем, существуют ли элементы карусели
    if (!track  || !prevBtn || !nextBtn || !dotsContainer) {
        console.log('Элементы карусели не найдены');
        return;
    }
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Создаем точки навигации
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', function() {
            goToSlide(index);
        });
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.carousel-dot');
    
    function goToSlide(slideIndex) {
        // Сброс анимации
        slides.forEach(function(slide) {
            slide.style.animation = 'none';
            setTimeout(function() {
                slide.style.animation = '';
            }, 10);
        });
        
        currentSlide = slideIndex;
        track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
        
        // Обновляем активную точку
        dots.forEach(function(dot, index) {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(currentSlide);
    }
    
    // Обработчики событий
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Автопрокрутка
    let autoSlideInterval = setInterval(nextSlide, 5000);
    
    // Останавливаем автопрокрутку при наведении
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', function() {
            clearInterval(autoSlideInterval);
        });
        
        carouselContainer.addEventListener('mouseleave', function() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        });
    }
    
    // Свайпы для мобильных устройств
    let startX = 0;
    let endX = 0;
    
    track.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    track.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Свайп влево
            } else {
                prevSlide(); // Свайп вправо
            }
        }
    }
    
    // Инициализация первой позиции
    goToSlide(0);
}