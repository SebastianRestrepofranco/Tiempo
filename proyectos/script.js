// ========================================
// ESENCIA & TIEMPO - SCRIPT COMPLETO CORREGIDO
// Widget WhatsApp + Carrito de Compras + Menú Móvil
// ========================================

// Variables globales del sistema
let cart = JSON.parse(localStorage.getItem('esenciaTiempoCart') || '[]');
let favorites = JSON.parse(localStorage.getItem('esencia_favorites') || '[]');

// Configuración de WhatsApp
const WHATSAPP_CONFIG = {
    phoneNumber: "573223375700",
    baseUrl: "https://wa.me/",
    businessName: "Esencia & Tiempo",
    welcomeMessage: "¡Gracias por contactarnos! Te atenderemos enseguida."
};

// ========================================
// INICIALIZACIÓN DEL SITIO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 Esencia & Tiempo - Inicializando...');
    
    // Cargar carrito desde localStorage primero
    loadCartFromStorage();
    
    // Inicializar funcionalidades principales
    initializeNavigation();
    initializeCart();
    initializeWhatsAppWidget();
    initializeProductButtons();
    
    // Actualizar contador del carrito al cargar
    updateCartCount();
    
    console.log('✅ Sitio web inicializado correctamente');
    console.log('📦 Carrito cargado con', cart.length, 'productos');
});

// ========================================
// NAVEGACIÓN MEJORADA Y CORREGIDA
// ========================================

function initializeNavigation() {
    console.log('🔧 Inicializando navegación...');
    
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const body = document.body;
    
    console.log('📱 Botón móvil encontrado:', mobileMenuBtn ? 'SÍ' : 'NO');
    console.log('📋 Nav links encontrado:', navLinks ? 'SÍ' : 'NO');
    
    if (mobileMenuBtn && navLinks) {
        // Event listener principal del botón hamburguesa
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🍔 Botón hamburguesa clickeado');
            
            // Toggle del menú
            navLinks.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Cambiar icono del botón
            if (navLinks.classList.contains('active')) {
                mobileMenuBtn.innerHTML = '✕';
                console.log('📂 Menú abierto');
            } else {
                mobileMenuBtn.innerHTML = '☰';
                console.log('📁 Menú cerrado');
            }
        });
        
        // Cerrar menú al hacer click en un enlace
        const navLinksItems = navLinks.querySelectorAll('a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                console.log('🔗 Enlace clickeado, cerrando menú');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
                mobileMenuBtn.innerHTML = '☰';
            });
        });
        
        // Cerrar menú con tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                console.log('⌨️ Escape presionado, cerrando menú');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
                mobileMenuBtn.innerHTML = '☰';
            }
        });
        
        // Cerrar menú al redimensionar ventana
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                console.log('📐 Ventana redimensionada, cerrando menú');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
                mobileMenuBtn.innerHTML = '☰';
            }
        });
        
        // Cerrar menú al hacer click en el overlay (en el fondo)
        navLinks.addEventListener('click', function(e) {
            if (e.target === navLinks) {
                console.log('🖱️ Click en overlay, cerrando menú');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
                mobileMenuBtn.innerHTML = '☰';
            }
        });
        
        console.log('✅ Navegación móvil configurada correctamente');
    } else {
        console.error('❌ Error: No se encontraron elementos de navegación');
        console.log('Verificando elementos...');
        console.log('mobile-menu-btn:', document.getElementById('mobile-menu-btn'));
        console.log('nav-links:', document.getElementById('nav-links'));
    }
    
    // Sub-navegación para productos
    initializeSubNavigation();
}

function initializeSubNavigation() {
    const subNavBtns = document.querySelectorAll('.sub-nav-btn');
    const subSections = document.querySelectorAll('.sub-section');
    
    console.log('🔀 Sub-navegación encontrada:', subNavBtns.length, 'botones');
    
    subNavBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = btn.getAttribute('data-target');
            console.log('🎯 Cambiando a sección:', target);
            
            // Remover clase active de todos los botones y secciones
            subNavBtns.forEach(b => b.classList.remove('active'));
            subSections.forEach(s => s.classList.remove('active'));
            
            // Agregar clase active al botón clickeado y su sección correspondiente
            btn.classList.add('active');
            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.classList.add('active');
                console.log('✅ Sección activada:', target);
            } else {
                console.error('❌ Sección no encontrada:', target);
            }
        });
    });
}

// ========================================
// WIDGET WHATSAPP
// ========================================

function initializeWhatsAppWidget() {
    createWhatsAppWidget();
    setTimeout(showWelcomeNotification, 8000);
}

function createWhatsAppWidget() {
    // Crear estilos del widget
    const widgetStyles = `
        <style>
        /* Widget WhatsApp */
        .whatsapp-float-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
            font-size: 2rem;
            z-index: 10000;
            transition: all 0.3s ease;
            border: none;
            animation: bounce 2s infinite;
        }

        .whatsapp-float-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 35px rgba(37, 211, 102, 0.6);
        }

        .whatsapp-float-btn .pulse-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 3px solid #25d366;
            border-radius: 50%;
            animation: pulse-ring 2s infinite;
        }

        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }

        @keyframes pulse-ring {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.3); opacity: 0; }
        }

        .online-status {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 20px;
            height: 20px;
            background: #4caf50;
            border: 3px solid white;
            border-radius: 50%;
            animation: online-pulse 2s infinite;
        }

        @keyframes online-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        /* Responsive */
        @media (max-width: 768px) {
            .whatsapp-float-btn {
                width: 65px;
                height: 65px;
                font-size: 1.8rem;
                bottom: 15px;
                right: 15px;
            }
        }
        </style>
    `;

    // Insertar estilos
    document.head.insertAdjacentHTML('beforeend', widgetStyles);

    // Crear botón flotante principal
    const floatBtn = document.createElement('button');
    floatBtn.className = 'whatsapp-float-btn';
    floatBtn.id = 'whatsappFloatBtn';
    floatBtn.innerHTML = `
        <div class="pulse-ring"></div>
        <i class="fab fa-whatsapp"></i>
        <div class="online-status"></div>
    `;

    // Agregar al DOM
    document.body.appendChild(floatBtn);

    // Configurar event listener
    floatBtn.addEventListener('click', () => {
        const message = `Hola! Me interesa conocer más sobre sus productos de Esencia & Tiempo. ¿Podrían ayudarme?`;
        sendWhatsAppMessage('general', message);
    });
}

function sendWhatsAppMessage(category, message) {
    const fullMessage = `${message}\n\n---\nCategoría: ${category.charAt(0).toUpperCase() + category.slice(1)}\nEnviado desde: ${window.location.origin}`;
    const encodedMessage = encodeURIComponent(fullMessage);
    const whatsappUrl = `${WHATSAPP_CONFIG.baseUrl}${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Mostrar notificación
    showNotification('🚀 Redirigiendo a WhatsApp...', 'success');
    
    // Tracking
    trackEvent('whatsapp_message_sent', category);
}

// ========================================
// CARRITO DE COMPRAS
// ========================================

function initializeCart() {
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart');
    const continueShoppingBtn = document.getElementById('continue-shopping');
    const checkoutBtn = document.getElementById('btn-checkout');
    const clearCartBtn = document.getElementById('clear-cart');

    // Event listeners del carrito
    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCartModal);
    }

    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', closeCartModal);
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', processCheckout);
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    // Cerrar modal al hacer click en el overlay
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                closeCartModal();
            }
        });
    }

    // Configurar métodos de pago
    setupPaymentMethods();
    
    console.log('🛒 Carrito inicializado correctamente');
}

function openCart() {
    console.log('🛒 Abriendo carrito...');
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.classList.add('active');
        cartModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        renderCartItems();
        updateCartDisplay();
        console.log('✅ Carrito abierto con', cart.length, 'productos');
    }
}

function closeCartModal() {
    console.log('🛒 Cerrando carrito...');
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.classList.remove('active');
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function addToCart(title, price, gender = '') {
    console.log('🛒 Agregando al carrito:', title, price, gender);
    
    const product = {
        id: Date.now() + Math.random(),
        title: title,
        price: price,
        gender: gender,
        image: title.toLowerCase().includes('reloj') ? '⌚' : '🌸',
        quantity: 1,
        timestamp: new Date().toISOString()
    };

    // Verificar si el producto ya existe
    const existingProductIndex = cart.findIndex(item => 
        item.title === title && item.gender === gender
    );

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
        showNotification(`✅ ${title} cantidad actualizada (${cart[existingProductIndex].quantity})`, 'success');
        console.log('📦 Producto existente, cantidad actualizada:', cart[existingProductIndex].quantity);
    } else {
        cart.push(product);
        showNotification(`✅ ${title} agregado al carrito`, 'success');
        console.log('📦 Nuevo producto agregado al carrito');
    }

    // Guardar en localStorage y actualizar
    saveCartToStorage();
    updateCartCount();
    
    // Si el carrito está abierto, actualizar vista
    const cartModal = document.getElementById('cart-modal');
    if (cartModal && cartModal.style.display === 'flex') {
        renderCartItems();
        updateCartDisplay();
    }
    
    // Animación del botón del carrito
    animateCartButton();
}

function removeFromCart(productId) {
    console.log('🗑️ Eliminando producto del carrito:', productId);
    
    const productIndex = cart.findIndex(item => item.id == productId);
    if (productIndex !== -1) {
        const productName = cart[productIndex].title;
        cart.splice(productIndex, 1);
        
        saveCartToStorage();
        updateCartCount();
        renderCartItems();
        updateCartDisplay();
        
        showNotification(`🗑️ ${productName} eliminado del carrito`, 'info');
        console.log('✅ Producto eliminado correctamente');
    } else {
        console.error('❌ Producto no encontrado:', productId);
    }
}

function updateQuantity(productId, newQuantity) {
    console.log('🔄 Actualizando cantidad:', productId, newQuantity);
    
    const product = cart.find(item => item.id == productId);
    if (product && newQuantity > 0) {
        product.quantity = parseInt(newQuantity);
        
        saveCartToStorage();
        updateCartCount();
        updateCartDisplay();
        
        console.log('✅ Cantidad actualizada:', product.title, '=', newQuantity);
    } else if (newQuantity <= 0) {
        removeFromCart(productId);
    } else {
        console.error('❌ Producto no encontrado para actualizar:', productId);
    }
}

function clearCart() {
    if (cart.length === 0) {
        showNotification('ℹ️ El carrito ya está vacío', 'info');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        console.log('🗑️ Vaciando carrito...');
        cart = [];
        saveCartToStorage();
        updateCartCount();
        renderCartItems();
        updateCartDisplay();
        showNotification('🗑️ Carrito vaciado', 'info');
        console.log('✅ Carrito vaciado correctamente');
    }
}

function saveCartToStorage() {
    try {
        localStorage.setItem('esenciaTiempoCart', JSON.stringify(cart));
        console.log('💾 Carrito guardado en localStorage:', cart.length, 'productos');
    } catch (error) {
        console.error('❌ Error guardando carrito:', error);
        showNotification('⚠️ Error guardando carrito', 'error');
    }
}

function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('esenciaTiempoCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            console.log('📦 Carrito cargado:', cart.length, 'productos');
        }
    } catch (error) {
        console.error('❌ Error cargando carrito:', error);
        cart = [];
    }
}

function animateCartButton() {
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.classList.add('bounce');
        setTimeout(() => cartBtn.classList.remove('bounce'), 1000);
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    console.log('🔢 Actualizando contador del carrito:', count);
    
    if (cartCount) {
        cartCount.textContent = count;
        if (count > 0) {
            cartCount.classList.remove('hidden');
        } else {
            cartCount.classList.add('hidden');
        }
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) {
        console.error('❌ Contenedor del carrito no encontrado');
        return;
    }

    console.log('🎨 Renderizando carrito con', cart.length, 'productos');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
                <p>¡Agrega algunos productos increíbles!</p>
            </div>
        `;
        return;
    }

    const cartHTML = cart.map(item => {
        const itemPrice = parseFloat(item.price.replace('$', '').replace(',', ''));
        const itemTotal = itemPrice * item.quantity;
        
        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">${item.image}</div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-info">
                        <span class="cart-item-gender ${item.gender === 'Hombre' ? 'for-men' : 'for-women'}">${item.gender}</span>
                        <span class="cart-item-price">${item.price}</span>
                    </div>
                    <div class="cart-item-total">Total: ${formatPrice(itemTotal)}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="qty-btn qty-decrease" data-id="${item.id}" data-action="decrease">-</button>
                        <input type="number" class="qty-input" value="${item.quantity}" min="1" 
                               data-id="${item.id}" onchange="handleQuantityChange(${item.id}, this.value)">
                        <button class="qty-btn qty-increase" data-id="${item.id}" data-action="increase">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}" title="Eliminar producto">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    cartItemsContainer.innerHTML = cartHTML;
    
    // Agregar event listeners a los botones después de renderizar
    addCartEventListeners();
}

function addCartEventListeners() {
    // Event listeners para botones de cantidad
    document.querySelectorAll('.qty-decrease').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = btn.getAttribute('data-id');
            const currentQty = parseInt(document.querySelector(`input[data-id="${productId}"]`).value);
            updateQuantity(productId, currentQty - 1);
        });
    });

    document.querySelectorAll('.qty-increase').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = btn.getAttribute('data-id');
            const currentQty = parseInt(document.querySelector(`input[data-id="${productId}"]`).value);
            updateQuantity(productId, currentQty + 1);
        });
    });

    // Event listeners para botones de eliminar
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = btn.getAttribute('data-id');
            removeFromCart(productId);
        });
    });
}

function handleQuantityChange(productId, newValue) {
    const quantity = parseInt(newValue);
    if (quantity > 0) {
        updateQuantity(productId, quantity);
    } else {
        removeFromCart(productId);
    }
}

function updateCartDisplay() {
    const totalSection = document.getElementById('cart-total-section');
    const customerForm = document.getElementById('customer-form');
    const paymentOptions = document.getElementById('payment-options');
    const checkoutBtn = document.getElementById('btn-checkout');
    const clearCartBtn = document.getElementById('clear-cart');

    console.log('💰 Actualizando display del carrito...');

    if (cart.length > 0) {
        const subtotal = calculateSubtotal();
        
        // Mostrar total
        if (totalSection) {
            totalSection.style.display = 'block';
            const subtotalElement = document.getElementById('cart-subtotal');
            const totalElement = document.getElementById('cart-total');
            
            if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal);
            if (totalElement) totalElement.textContent = formatPrice(subtotal);
        }

        // Mostrar formulario y opciones
        if (customerForm) customerForm.style.display = 'block';
        if (paymentOptions) paymentOptions.style.display = 'block';
        if (checkoutBtn) checkoutBtn.style.display = 'flex';
        if (clearCartBtn) clearCartBtn.style.display = 'flex';
        
        console.log('✅ Total calculado:', formatPrice(subtotal));
    } else {
        // Ocultar elementos cuando el carrito está vacío
        if (totalSection) totalSection.style.display = 'none';
        if (customerForm) customerForm.style.display = 'none';
        if (paymentOptions) paymentOptions.style.display = 'none';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        if (clearCartBtn) clearCartBtn.style.display = 'none';
        
        console.log('ℹ️ Carrito vacío - elementos ocultos');
    }
}

function calculateSubtotal() {
    const subtotal = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', '').replace(',', ''));
        return sum + (price * item.quantity);
    }, 0);
    
    console.log('🧮 Subtotal calculado:', subtotal);
    return subtotal;
}

function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(price);
}

function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            // Remover selección previa
            paymentMethods.forEach(m => m.classList.remove('selected'));
            
            // Seleccionar método actual
            method.classList.add('selected');
            
            // Marcar radio button
            const radio = method.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });
}

function processCheckout() {
    // Validar datos del cliente
    const customerData = validateCustomerData();
    if (!customerData) return;

    // Validar método de pago
    const paymentMethod = document.querySelector('input[name="payment"]:checked');
    if (!paymentMethod) {
        showNotification('⚠️ Selecciona un método de pago', 'warning');
        return;
    }

    // Generar mensaje para WhatsApp
    const whatsappMessage = generateOrderMessage(customerData, paymentMethod.value);
    
    // Enviar a WhatsApp
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `${WHATSAPP_CONFIG.baseUrl}${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Cerrar carrito y mostrar confirmación
    closeCartModal();
    showNotification('🎉 Pedido enviado por WhatsApp', 'success');
    
    // Opcionalmente limpiar carrito después del envío
    setTimeout(() => {
        if (confirm('¿Deseas vaciar el carrito después de enviar el pedido?')) {
            clearCart();
        }
    }, 2000);
}

function validateCustomerData() {
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const city = document.getElementById('customer-city').value.trim();

    if (!name) {
        showNotification('⚠️ Ingresa tu nombre completo', 'warning');
        return null;
    }

    if (!phone) {
        showNotification('⚠️ Ingresa tu número de teléfono', 'warning');
        return null;
    }

    if (!city) {
        showNotification('⚠️ Ingresa tu ciudad', 'warning');
        return null;
    }

    return {
        name: name,
        phone: phone,
        email: document.getElementById('customer-email').value.trim(),
        city: city,
        address: document.getElementById('customer-address').value.trim(),
        notes: document.getElementById('customer-notes').value.trim()
    };
}

function generateOrderMessage(customerData, paymentMethod) {
    const subtotal = calculateSubtotal();
    const orderNumber = Date.now();
    
    let message = `🛍️ *NUEVO PEDIDO - ESENCIA & TIEMPO*\n\n`;
    message += `📋 *Pedido #${orderNumber}*\n`;
    message += `📅 *Fecha:* ${new Date().toLocaleDateString('es-CO')}\n\n`;
    
    message += `👤 *DATOS DEL CLIENTE*\n`;
    message += `• *Nombre:* ${customerData.name}\n`;
    message += `• *Teléfono:* ${customerData.phone}\n`;
    message += `• *Ciudad:* ${customerData.city}\n`;
    
    if (customerData.email) {
        message += `• *Email:* ${customerData.email}\n`;
    }
    
    if (customerData.address) {
        message += `• *Dirección:* ${customerData.address}\n`;
    }
    
    message += `\n🛒 *PRODUCTOS PEDIDOS*\n`;
    
    cart.forEach((item, index) => {
        const itemTotal = parseFloat(item.price.replace('$', '').replace(',', '')) * item.quantity;
        message += `${index + 1}. *${item.title}*\n`;
        message += `   • Género: ${item.gender}\n`;
        message += `   • Precio: ${item.price}\n`;
        message += `   • Cantidad: ${item.quantity}\n`;
        message += `   • Subtotal: ${formatPrice(itemTotal)}\n\n`;
    });
    
    message += `💰 *TOTAL DEL PEDIDO: ${formatPrice(subtotal)}*\n\n`;
    
    message += `💳 *MÉTODO DE PAGO SELECCIONADO*\n`;
    message += `• ${getPaymentMethodName(paymentMethod)}\n\n`;
    
    if (customerData.notes) {
        message += `📝 *NOTAS ADICIONALES*\n`;
        message += `${customerData.notes}\n\n`;
    }
    
    message += `---\n`;
    message += `Enviado desde: ${window.location.origin}\n`;
    message += `¡Gracias por elegir Esencia & Tiempo! 💎`;
    
    return message;
}

function getPaymentMethodName(method) {
    const names = {
        'nequi': 'Nequi - Transferencia móvil',
        'daviplata': 'DaviPlata - Pago móvil',
        'bancolombia': 'Bancolombia - Transferencia bancaria',
        'mercadopago': 'Mercado Pago - Tarjetas y otros métodos'
    };
    return names[method] || method;
}

// ========================================
// PRODUCTOS Y BOTONES
// ========================================

function initializeProductButtons() {
    // Botones "Comprar Ahora" en las páginas de productos
    const buyButtons = document.querySelectorAll('.buy-button');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const title = productCard.querySelector('.product-title').textContent;
                const price = productCard.querySelector('.product-price').textContent;
                const genderIndicator = productCard.querySelector('.gender-indicator');
                const gender = genderIndicator ? genderIndicator.textContent : '';
                
                addToCart(title, price, gender);
            }
        });
    });

    // Botones rápidos de agregar en la página de inicio
    const quickAddBtns = document.querySelectorAll('.quick-add-btn');
    
    quickAddBtns.forEach(button => {
        button.addEventListener('click', (e) => {
            // La funcionalidad ya está definida en el onclick del HTML
            e.preventDefault();
        });
    });
}

// ========================================
// UTILIDADES Y NOTIFICACIONES
// ========================================

function showNotification(message, type = 'success') {
    // Remover notificación existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const iconMap = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };

    notification.innerHTML = `
        <div class="icon">${iconMap[type] || '✅'}</div>
        <div>${message}</div>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, #d4af37, #f7e98e);
        color: #1a1a1a;
        padding: 1rem 1.5rem;
        border-radius: 15px;
        box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
        z-index: 10001;
        font-weight: bold;
        transform: translateX(400px);
        transition: transform 0.4s ease;
        max-width: 320px;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        font-size: 0.95rem;
    `;

    document.body.appendChild(notification);

    // Mostrar notificación
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Ocultar después de 4 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }, 4000);
}

function showWelcomeNotification() {
    showNotification('💬 ¿Necesitas ayuda? Escríbenos por WhatsApp', 'info');
}

function trackEvent(eventName, category = '') {
    console.log(`📊 Event tracked: ${eventName}`, category ? `Category: ${category}` : '');
    
    // Integración con Google Analytics (si está disponible)
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: 'whatsapp_widget',
            event_label: category
        });
    }
}

// ========================================
// FUNCIONES DE DIAGNÓSTICO
// ========================================

function diagnosticarMenuMovil() {
    console.log('\n🔍 === DIAGNÓSTICO DEL MENÚ MÓVIL ===');
    
    // Verificar elementos principales
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const navContainer = document.querySelector('.nav-container');
    
    console.log('📱 Botón móvil encontrado:', mobileMenuBtn ? '✅ SÍ' : '❌ NO');
    console.log('📋 Enlaces de navegación encontrados:', navLinks ? '✅ SÍ' : '❌ NO');
    console.log('📦 Contenedor de navegación encontrado:', navContainer ? '✅ SÍ' : '❌ NO');
    
    if (!mobileMenuBtn) {
        console.error('❌ ERROR: No se encuentra el botón con id="mobile-menu-btn"');
        console.log('💡 SOLUCIÓN: Verificar que el botón tenga el ID correcto en el HTML');
    }
    
    if (!navLinks) {
        console.error('❌ ERROR: No se encuentra el ul con id="nav-links"');
        console.log('💡 SOLUCIÓN: Verificar que el <ul> tenga el ID correcto en el HTML');
    }
    
    // Verificar estructura HTML
    if (mobileMenuBtn && navLinks) {
        console.log('✅ Estructura HTML correcta');
        
        // Probar funcionalidad
        console.log('🧪 PROBANDO FUNCIONALIDAD...');
        
        // Simular click
        try {
            mobileMenuBtn.click();
            const isOpen = navLinks.classList.contains('active');
            console.log('📂 Menú se abrió:', isOpen ? '✅ SÍ' : '❌ NO');
            
            if (isOpen) {
                // Cerrar menú
                mobileMenuBtn.click();
                const isClosed = !navLinks.classList.contains('active');
                console.log('📁 Menú se cerró:', isClosed ? '✅ SÍ' : '❌ NO');
            }
        } catch (error) {
            console.error('❌ ERROR al probar click:', error.message);
        }
    }
    
    // Verificar CSS
    const computedStyle = window.getComputedStyle(mobileMenuBtn);
    const isVisible = computedStyle.display !== 'none';
    console.log('👁️ Botón visible:', isVisible ? '✅ SÍ' : '❌ NO');
    
    // Verificar responsive
    const isMobile = window.innerWidth <= 768;
    console.log('📱 Vista móvil activa:', isMobile ? '✅ SÍ' : '❌ NO');
    
    if (!isMobile) {
        console.log('💡 TIP: Para probar el menú móvil, reduce el ancho de la ventana a menos de 768px');
    }
    
    console.log('\n🏁 === FIN DEL DIAGNÓSTICO ===\n');
}

function verificacionRapida() {
    const elementos = {
        'mobile-menu-btn': document.getElementById('mobile-menu-btn'),
        'nav-links': document.getElementById('nav-links'),
        'cart-btn': document.getElementById('cart-btn'),
        'cart-modal': document.getElementById('cart-modal')
    };
    
    console.log('\n🔍 === VERIFICACIÓN RÁPIDA ===');
    Object.entries(elementos).forEach(([id, elemento]) => {
        console.log(`${id}:`, elemento ? '✅' : '❌');
    });
    console.log('================================\n');
}

function reconfigurarMenuMovil() {
    console.log('🔧 Reconfigurando menú móvil...');
    
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileMenuBtn && navLinks) {
        // Limpiar eventos existentes
        const newBtn = mobileMenuBtn.cloneNode(true);
        mobileMenuBtn.parentNode.replaceChild(newBtn, mobileMenuBtn);
        
        // Reconfigurar evento
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🍔 Menu button clicked!');
            
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            if (navLinks.classList.contains('active')) {
                newBtn.innerHTML = '✕';
                console.log('📂 Menú abierto');
            } else {
                newBtn.innerHTML = '☰';
                console.log('📁 Menú cerrado');
            }
        });
        
        console.log('✅ Menú reconfigurado exitosamente');
    } else {
        console.error('❌ No se pudieron encontrar los elementos necesarios');
    }
}

// ========================================
// FUNCIONES GLOBALES PARA COMPATIBILIDAD
// ========================================

// Función global para contacto directo con producto
window.contactProduct = function(productName, productPrice = '') {
    const message = `Hola! Me interesa el producto: ${productName}${productPrice ? ` (${productPrice})` : ''}. ¿Podrían darme más información?`;
    sendWhatsAppMessage('product', message);
};

// Función global para WhatsApp rápido
window.sendToWhatsApp = function(productName, inquiry = '') {
    const message = `Hola! Me interesa: ${productName}. ${inquiry}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `${WHATSAPP_CONFIG.baseUrl}${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
};

// Mantener compatibilidad con botones del HTML existente
window.addToCart = addToCart;
window.openCart = openCart;
window.sendWhatsAppMessage = sendWhatsAppMessage;
window.handleQuantityChange = handleQuantityChange;

// Funciones de diagnóstico disponibles globalmente
window.diagnosticarMenuMovil = diagnosticarMenuMovil;
window.verificacionRapida = verificacionRapida;
window.reconfigurarMenuMovil = reconfigurarMenuMovil;

// Ejecutar diagnóstico después de cargar la página
window.addEventListener('load', function() {
    setTimeout(verificacionRapida, 1000);
});

// ========================================
// LOG INICIAL
// ========================================

console.log(`
🚀 ESENCIA & TIEMPO - SISTEMA COMPLETO CARGADO
✅ Funcionalidades activas:
   • Widget WhatsApp ✅
   • Carrito de compras completo ✅
   • Sistema de notificaciones ✅
   • Navegación responsive CORREGIDA ✅
   • Menú móvil funcional ✅
   • Tracking de eventos ✅
   • Herramientas de diagnóstico ✅

📱 WhatsApp: ${WHATSAPP_CONFIG.phoneNumber}
🛒 Carrito: ${cart.length} productos
🌐 Listo para recibir consultas

🛠️ HERRAMIENTAS DE DIAGNÓSTICO:
• diagnosticarMenuMovil() - Diagnóstico completo
• verificacionRapida() - Verificación rápida de elementos
• reconfigurarMenuMovil() - Forzar reconfiguración

💡 Ejecuta cualquiera de estas funciones en la consola del navegador
`);