// Utility functions
const Utils = {
    // Show notification
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 4px;
            z-index: 10000;
            animation: fadeInUp 0.5s ease;
            max-width: 300px;
            font-weight: bold;
        `;
        
        const colors = {
            success: '#d4edda',
            error: '#f8d7da',
            info: '#d1ecf1',
            warning: '#fff3cd'
        };
        
        const textColors = {
            success: '#155724',
            error: '#721c24',
            info: '#0c5460',
            warning: '#856404'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.style.color = textColors[type] || textColors.info;
        notification.style.border = `1px solid ${textColors[type]}20`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    },

    // Format price
    formatPrice: function(price) {
        return price.toLocaleString('ru-RU') + ' ₽';
    },

    // Get category name
    getCategoryName: function(category) {
        const categories = {
            'protective': 'Защита',
            'vehicles': 'Транспорт',
            'electronics': 'Электроника',
            'aviation': 'Авиация'
        };
        return categories[category] || category;
    },

    // Validate email
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate phone
    validatePhone: function(phone) {
        const re = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return re.test(phone);
    },

    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Get status text
    getStatusText: function(status) {
        const statuses = {
            'pending': 'Обрабатывается',
            'shipped': 'Отправлен',
            'delivered': 'Доставлен',
            'cancelled': 'Отменен'
        };
        return statuses[status] || status;
    }
};

// Make functions available globally
window.Utils = Utils;