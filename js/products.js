// Products data and functionality
const Products = {
    data: [
        {
            id: 1,
            title: "Тактический жилет",
            category: "protective",
            description: "Многофункциональный балансический жилет с модульной системой крепления",
            price: "15,000 ₽",
            image: "images/taktik-gilet.jfif",
            features: [
                "Уровень защиты: NJ, IIIA",
                "Вес: 1.45 кг",
                "Совместимость с MOLLE"
            ]
        },
        {
            id: 2,
            title: "Тактическое бронирование",
            category: "vehicles",
            description: "Технолый бронетранспортер для операций повышенного риска",
            price: "12,500,000 ₽",
            image: "images/btr.jpg",
            features: [
                "Бронирование уровня В6",
                "Вместимость: 10 человек",
                "Внедорожные возможности"
            ]
        },
        {
            id: 3,
            title: "Защищенная система связи",
            category: "electronics",
            description: "Предыдущее шаброненное радиопомеханическое оборудование",
            price: "85,000 ₽",
            image: "images/r-158.jpg",
            features: [
                "256-битное шифрование",
                "Дальность связи: 50 км",
                "Водонепроницаемость IP67"
            ]
        },
        {
            id: 4,
            title: "Бронежилет 'Страйк'",
            category: "protective",
            description: "Легкий бронежилет для мобильных операций",
            price: "22,000 ₽",
            image: "images/strike.jpg",
            features: [
                "Уровень защиты: III",
                "Вес: 2.3 кг",
                "Регулируемые ремни"
            ]
        },
        {
            id: 5,
            title: "БПЛА 'Сокол'",
            category: "aviation",
            description: "Беспилотный летательный аппарат для разведки",
            price: "1,200,000 ₽",
            image: "images/sokol.png",
            features: [
                "Дальность полета: 150 км",
                "Время полета: 8 часов",
                "HD камера с ночным видением"
            ]
        },
        {
            id: 6,
            title: "Тактический шлем",
            category: "protective",
            description: "Баллистический шлем с системой крепления для оборудования",
            price: "18,500 ₽",
            image: "images/shlem.jpg",
            features: [
                "Уровень защиты: IIIA",
                "Вес: 1.2 кг",
                "Совместимость с NVG"
            ]
        },
        {
            id: 7,
            title: "Бронеавтомобиль 'Вепрь'",
            category: "vehicles",
            description: "Многоцелевой бронеавтомобиль для спецопераций",
            price: "8,500,000 ₽",
            image: "images/vepr.jpg",
            features: [
                "Бронирование уровня STANAG 4569",
                "Вместимость: 8 человек",
                "Мощность двигателя: 300 л.с."
            ]
        },
        {
            id: 8,
            title: "Система ночного видения",
            category: "electronics",
            description: "Монокуляр с цифровым усилением изображения",
            price: "65,000 ₽",
            image: "images/pnv.jpg",
            features: [
                "Увеличение: 3x",
                "Дальность обнаружения: 300 м",
                "Время работы: 8 часов"
            ]
        }
    ],

    // Render products to the grid
    renderProducts: function(filteredProducts, currentPage, itemsPerPage) {
        const productsGrid = document.getElementById('productsGrid');
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        
        productsGrid.innerHTML = '';
        
        paginatedProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                    <span class="product-category">${Utils.getCategoryName(product.category)}</span>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${product.price}</div>
                    <div class="product-actions">
                        <button class="view-details" data-id="${product.id}">Подробнее</button>
                        <button class="add-to-cart" data-id="${product.id}">В корзину</button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(productCard);
        });
        
        this.attachProductEventListeners();
    },

    // Render pagination
    renderPagination: function(totalItems, itemsPerPage, currentPage, onPageChange) {
        const pagination = document.getElementById('pagination');
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        pagination.innerHTML = '';
        
        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn';
        prevBtn.innerHTML = '&laquo;';
        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                onPageChange(currentPage - 1);
            }
        });
        pagination.appendChild(prevBtn);
        
        // Page buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', function() {
                onPageChange(i);
            });
            pagination.appendChild(pageBtn);
        }
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn';
        nextBtn.innerHTML = '&raquo;';
        nextBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                onPageChange(currentPage + 1);
            }
        });
        pagination.appendChild(nextBtn);
    },

    // Attach event listeners to product buttons
    attachProductEventListeners: function() {
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                Products.openProductModal(productId);
            });
        });
        
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                Cart.addToCart(productId);
            });
        });
    },

    // Open product modal
    openProductModal: function(productId) {
        const product = this.data.find(p => p.id === productId);
        if (!product) return;
        
        document.getElementById('modalProductImage').src = product.image;
        document.getElementById('modalProductTitle').textContent = product.title;
        document.getElementById('modalProductDescription').textContent = product.description;
        document.getElementById('modalProductPrice').textContent = product.price;
        
        const featuresList = document.getElementById('modalProductFeatures');
        featuresList.innerHTML = '';
        product.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
        
        // Set up quantity selector
        const quantityInput = document.querySelector('.quantity-input');
        quantityInput.value = 1;
        
        document.querySelector('.quantity-btn.minus').addEventListener('click', function() {
            if (quantityInput.value > 1) {
                quantityInput.value = parseInt(quantityInput.value) - 1;
            }
        });
        
        document.querySelector('.quantity-btn.plus').addEventListener('click', function() {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        });
        
        // Set up add to cart button
        const addToCartBtn = document.querySelector('.add-to-cart-modal');
        addToCartBtn.onclick = function() {
            Cart.addToCart(productId, parseInt(quantityInput.value));
            document.getElementById('productModal').style.display = 'none';
        };
        
        document.getElementById('productModal').style.display = 'block';
    },

    // Filter products by category
    filterProducts: function(category) {
        return category === 'all' 
            ? this.data 
            : this.data.filter(product => product.category === category);
    }
};

// Make Products available globally
window.Products = Products;