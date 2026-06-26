// ==================== DATA STORAGE ====================
const state = {
    isAdminLoggedIn: false,
    currentPage: 'home',
    products: [],
    notes: [],
    aboutContent: 'Welcome to Ehika Fashion. Our journey began with a simple vision: to redefine luxury fashion for the modern aesthetic. Every piece in our collection is carefully curated to embody elegance, quality, and timeless style.',
    brandLogo: null,
    promoItems: [],
    paymentMethods: [],
    // Admin credentials
    adminEmail: 'ehikafashions@gmail.com',
    adminPassword: '456654'
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    loadDataFromStorage();
    initializeApp();
    window.addEventListener('scroll', handleScroll);
});

function initializeApp() {
    renderNavigation();
    renderAboutContent();
    loadProducts();
    loadNotes();
    loadPromoBar();
}

// ==================== LOCAL STORAGE ====================
function saveDataToStorage() {
    localStorage.setItem('ehika_fashion_data', JSON.stringify({
        products: state.products,
        notes: state.notes,
        aboutContent: state.aboutContent,
        brandLogo: state.brandLogo,
        promoItems: state.promoItems,
        paymentMethods: state.paymentMethods
    }));
}

function loadDataFromStorage() {
    const saved = localStorage.getItem('ehika_fashion_data');
    if (saved) {
        const data = JSON.parse(saved);
        state.products = data.products || [];
        state.notes = data.notes || [];
        state.aboutContent = data.aboutContent || state.aboutContent;
        state.brandLogo = data.brandLogo || null;
        state.promoItems = data.promoItems || [];
        state.paymentMethods = data.paymentMethods || [];
    }
}

// ==================== NAVIGATION ====================
function renderNavigation() {
    const userMenuContent = document.getElementById('userMenuContent');
    
    if (state.isAdminLoggedIn) {
        userMenuContent.innerHTML = `
            <a onclick="openAdminDashboard()" class="font-lora font-medium block w-full px-4 py-3 hover:bg-neutral-50 hover:text-gold transition">Admin Dashboard</a>
            <button onclick="logout()" class="font-lora font-medium block w-full px-4 py-3 hover:bg-neutral-50 hover:text-gold transition text-left border-t border-neutral-200">Logout</button>
        `;
    } else {
        userMenuContent.innerHTML = `
            <a onclick="showLoginModal()" class="font-lora font-medium block w-full px-4 py-3 hover:bg-neutral-50 hover:text-gold transition">Login</a>
            <a onclick="showSignupModal()" class="font-lora font-medium block w-full px-4 py-3 hover:bg-neutral-50 hover:text-gold transition border-t border-neutral-200">Signup</a>
        `;
    }
}

function handleScroll() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 10) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}

function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    menu.classList.toggle('hidden');
    document.addEventListener('click', (e) => {
        if (!e.target.closest('[onclick*="toggleUserMenu"]') && !e.target.closest('#userMenu')) {
            menu.classList.add('hidden');
        }
    });
}

function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    searchBar.classList.toggle('hidden');
}

// ==================== PAGE NAVIGATION ====================
function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
    
    // Reset search and menu
    document.getElementById('searchBar').classList.add('hidden');
    document.getElementById('userMenu').classList.add('hidden');
    
    // Show selected page
    const pageMap = {
        'home': 'homePage',
        'shop': 'shopPage',
        'about': 'aboutPage',
        'product-detail': 'productDetailPage'
    };
    
    if (pageMap[page]) {
        document.getElementById(pageMap[page]).classList.remove('hidden');
        state.currentPage = page;
    }
    
    // Render content for specific pages
    if (page === 'shop') {
        renderShopPage();
    } else if (page === 'home') {
        renderHomePage();
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== HOME PAGE ====================
function renderHomePage() {
    renderFeaturedProducts();
}

function renderFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    const featured = state.products.slice(0, 3);
    
    container.innerHTML = featured.map(product => `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" class="product-image">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">$${parseFloat(product.price).toFixed(2)}</p>
                <p class="product-description">${product.description.substring(0, 80)}...</p>
                <button onclick="viewProductDetail('${product.id}')" class="w-full py-2 border border-neutral-900 text-neutral-900 font-lora font-medium rounded hover:bg-neutral-900 hover:text-white transition">
                    View Details
                </button>
            </div>
        </div>
    `).join('');
}

// ==================== SHOP PAGE ====================
function renderShopPage() {
    const container = document.getElementById('productGrid');
    
    if (state.products.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center text-neutral-500 py-12">No products available yet.</p>';
        return;
    }
    
    container.innerHTML = state.products.map(product => `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" class="product-image">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">$${parseFloat(product.price).toFixed(2)}</p>
                <p class="product-description">${product.description.substring(0, 80)}...</p>
                <button onclick="viewProductDetail('${product.id}')" class="w-full py-2 border border-neutral-900 text-neutral-900 font-lora font-medium rounded hover:bg-neutral-900 hover:text-white transition">
                    View Details
                </button>
            </div>
        </div>
    `).join('');
}

// ==================== PRODUCT DETAIL ====================
function viewProductDetail(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;
    
    const container = document.getElementById('productDetailContent');
    container.innerHTML = `
        <div>
            <div class="product-image-container h-96">
                <img src="${product.image}" alt="${product.title}" class="product-image">
            </div>
        </div>
        <div>
            <h1 class="text-5xl font-playfair font-bold mb-4">${product.title}</h1>
            <p class="text-3xl font-lora text-gold font-semibold mb-6">$${parseFloat(product.price).toFixed(2)}</p>
            <p class="text-lg font-lora text-neutral-700 mb-8 leading-relaxed">${product.description}</p>
            <div class="space-y-4">
                <button class="w-full px-8 py-4 bg-neutral-900 text-white font-lora font-medium rounded hover:bg-neutral-800 transition">
                    Add to Cart
                </button>
                <button class="w-full px-8 py-4 border-2 border-neutral-900 text-neutral-900 font-lora font-medium rounded hover:bg-neutral-900 hover:text-white transition">
                    Add to Wishlist
                </button>
            </div>
        </div>
    `;
    
    navigateTo('product-detail');
}

// ==================== ABOUT PAGE ====================
function renderAboutContent() {
    const aboutContent = document.getElementById('aboutContent');
    aboutContent.innerHTML = `<p class="whitespace-pre-wrap">${state.aboutContent}</p>`;
}

function updateAbout() {
    const newContent = document.getElementById('aboutTextarea').value;
    if (newContent.trim()) {
        state.aboutContent = newContent;
        renderAboutContent();
        saveDataToStorage();
        alert('About page updated successfully!');
    }
}

// ==================== NOTES/ANNOUNCEMENTS ====================
function loadNotes() {
    renderNotes();
}

function renderNotes() {
    const notesList = document.getElementById('notesList');
    
    if (state.notes.length === 0) {
        notesList.innerHTML = '<p class="text-center text-neutral-500 py-8">No announcements at the moment.</p>';
        return;
    }
    
    notesList.innerHTML = state.notes.map(note => `
        <div class="note-item">
            <p class="font-lora leading-relaxed mb-2">${note.content}</p>
            <small class="text-neutral-500">${new Date(note.createdAt).toLocaleDateString()}</small>
            ${state.isAdminLoggedIn ? `
                <button onclick="deleteNote('${note.id}')" class="ml-4 text-red-500 hover:text-red-700 text-sm font-medium transition">
                    Delete
                </button>
            ` : ''}
        </div>
    `).join('');
}

function addNote() {
    const content = document.getElementById('noteContent').value;
    if (content.trim()) {
        state.notes.unshift({
            id: Date.now().toString(),
            content: content,
            createdAt: new Date().toISOString()
        });
        document.getElementById('noteContent').value = '';
        renderNotes();
        saveDataToStorage();
        alert('Note added successfully!');
    }
}

function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        state.notes = state.notes.filter(n => n.id !== noteId);
        renderNotes();
        saveDataToStorage();
    }
}

// ==================== PRODUCTS MANAGEMENT ====================
function addProduct() {
    const title = document.getElementById('productTitle').value;
    const price = document.getElementById('productPrice').value;
    const description = document.getElementById('productDescription').value;
    const imageFile = document.getElementById('productImage').files[0];
    
    if (!title || !price || !description) {
        alert('Please fill in all fields');
        return;
    }
    
    if (!imageFile) {
        alert('Please select an image');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        state.products.push({
            id: Date.now().toString(),
            title: title,
            price: price,
            description: description,
            image: e.target.result
        });
        
        document.getElementById('productTitle').value = '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productDescription').value = '';
        document.getElementById('productImage').value = '';
        
        renderProductsList();
        renderFeaturedProducts();
        saveDataToStorage();
        alert('Product added successfully!');
    };
    reader.readAsDataURL(imageFile);
}

function renderProductsList() {
    const container = document.getElementById('productsList');
    
    if (state.products.length === 0) {
        container.innerHTML = '<p class="text-neutral-500">No products yet.</p>';
        return;
    }
    
    container.innerHTML = state.products.map(product => `
        <div class="bg-neutral-50 border border-neutral-200 rounded p-4 flex justify-between items-start">
            <div class="flex-1">
                <h4 class="font-playfair font-bold mb-2">${product.title}</h4>
                <p class="text-sm text-neutral-600 mb-1">Price: $${parseFloat(product.price).toFixed(2)}</p>
                <p class="text-sm text-neutral-600">${product.description.substring(0, 60)}...</p>
            </div>
            <div class="flex gap-2 ml-4">
                <button onclick="editProduct('${product.id}')" class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition">Edit</button>
                <button onclick="deleteProduct('${product.id}')" class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition">Delete</button>
            </div>
        </div>
    `).join('');
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        state.products = state.products.filter(p => p.id !== productId);
        renderProductsList();
        renderFeaturedProducts();
        saveDataToStorage();
    }
}

function editProduct(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;
    
    const newTitle = prompt('Edit title:', product.title);
    if (newTitle) product.title = newTitle;
    
    const newPrice = prompt('Edit price:', product.price);
    if (newPrice) product.price = newPrice;
    
    const newDescription = prompt('Edit description:', product.description);
    if (newDescription) product.description = newDescription;
    
    renderProductsList();
    renderFeaturedProducts();
    saveDataToStorage();
}

// ==================== LOGO MANAGEMENT ====================
function previewLogo() {
    const file = document.getElementById('logoUpload').files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('logoPreview');
        preview.innerHTML = `
            <div class="max-w-xs mx-auto">
                <img src="${e.target.result}" alt="Logo Preview" class="w-full h-20 object-contain">
            </div>
        `;
        state.brandLogo = e.target.result;
    };
    reader.readAsDataURL(file);
}

function uploadLogo() {
    if (state.brandLogo) {
        const logoImg = document.getElementById('brandLogo');
        logoImg.src = state.brandLogo;
        saveDataToStorage();
        alert('Logo uploaded successfully!');
    } else {
        alert('Please select a logo first');
    }
}

// Load logo on page load
window.addEventListener('load', () => {
    if (state.brandLogo) {
        document.getElementById('brandLogo').src = state.brandLogo;
    }
});

// ==================== PROMO BAR ====================
function loadPromoBar() {
    renderPromoBar();
}

function renderPromoBar() {
    const promoContent = document.getElementById('promoContent');
    
    if (state.promoItems.length === 0) {
        promoContent.innerHTML = '<p class="text-sm">Welcome to Ehika Fashion</p>';
        return;
    }
    
    promoContent.innerHTML = state.promoItems.map((item, index) => `
        <span style="color: ${item.color}" class="mx-4 text-sm font-lora">${item.text}</span>
    `).join('');
}

function addPromoItem() {
    const text = document.getElementById('promoText').value;
    const color = document.getElementById('promoColor').value;
    
    if (!text.trim()) {
        alert('Please enter promo text');
        return;
    }
    
    state.promoItems.push({
        id: Date.now().toString(),
        text: text,
        color: color
    });
    
    document.getElementById('promoText').value = '';
    document.getElementById('promoColor').value = '#D4AF37';
    
    renderPromoItemsList();
    renderPromoBar();
    saveDataToStorage();
    alert('Promo item added!');
}

function renderPromoItemsList() {
    const container = document.getElementById('promoItemsList');
    
    if (state.promoItems.length === 0) {
        container.innerHTML = '<p class="text-neutral-500">No promo items yet.</p>';
        return;
    }
    
    container.innerHTML = state.promoItems.map(item => `
        <div class="bg-neutral-50 border border-neutral-200 rounded p-3 flex justify-between items-center">
            <div>
                <p class="font-lora" style="color: ${item.color}">${item.text}</p>
                <small class="text-neutral-500">Color: ${item.color}</small>
            </div>
            <button onclick="deletePromoItem('${item.id}')" class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition">Delete</button>
        </div>
    `).join('');
}

function deletePromoItem(itemId) {
    state.promoItems = state.promoItems.filter(item => item.id !== itemId);
    renderPromoItemsList();
    renderPromoBar();
    saveDataToStorage();
}

// ==================== PAYMENT METHODS ====================
function addPaymentMethod() {
    const name = document.getElementById('paymentName').value;
    const icon = document.getElementById('paymentIcon').value;
    const details = document.getElementById('paymentDetails').value;
    
    if (!name.trim() || !icon.trim()) {
        alert('Please fill in required fields');
        return;
    }
    
    state.paymentMethods.push({
        id: Date.now().toString(),
        name: name,
        icon: icon,
        details: details
    });
    
    document.getElementById('paymentName').value = '';
    document.getElementById('paymentIcon').value = '';
    document.getElementById('paymentDetails').value = '';
    
    renderPaymentsList();
    saveDataToStorage();
    alert('Payment method added!');
}

function renderPaymentsList() {
    const container = document.getElementById('paymentsList');
    
    if (state.paymentMethods.length === 0) {
        container.innerHTML = '<p class="text-neutral-500">No payment methods yet.</p>';
        return;
    }
    
    container.innerHTML = state.paymentMethods.map(method => `
        <div class="bg-neutral-50 border border-neutral-200 rounded p-3 flex justify-between items-center">
            <div>
                <p class="font-lora font-medium">${method.name}</p>
                <p class="text-sm text-neutral-600"><i class="${method.icon}"></i> ${method.icon}</p>
                ${method.details ? `<p class="text-sm text-neutral-500">${method.details}</p>` : ''}
            </div>
            <button onclick="deletePaymentMethod('${method.id}')" class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition">Delete</button>
        </div>
    `).join('');
}

function deletePaymentMethod(methodId) {
    state.paymentMethods = state.paymentMethods.filter(m => m.id !== methodId);
    renderPaymentsList();
    saveDataToStorage();
}

// ==================== ADMIN AUTHENTICATION ====================
function showLoginModal() {
    const loginHTML = `
        <div id="loginModalBackdrop" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h2 class="text-2xl font-playfair font-bold mb-6">Admin Login</h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-lora font-medium mb-2">Email</label>
                        <input type="email" id="adminEmailInput" placeholder="Enter email" class="w-full border border-neutral-300 rounded px-4 py-2 focus:outline-none focus:border-gold">
                    </div>
                    <div>
                        <label class="block text-sm font-lora font-medium mb-2">Password</label>
                        <input type="password" id="adminPasswordInput" placeholder="Enter password" class="w-full border border-neutral-300 rounded px-4 py-2 focus:outline-none focus:border-gold">
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button onclick="verifyAdminLogin()" class="flex-1 px-4 py-2 bg-neutral-900 text-white font-lora font-medium rounded hover:bg-neutral-800 transition">Login</button>
                        <button onclick="closeLoginModal()" class="flex-1 px-4 py-2 border border-neutral-300 text-neutral-900 font-lora font-medium rounded hover:bg-neutral-50 transition">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', loginHTML);
    document.getElementById('adminEmailInput').focus();
    
    document.getElementById('adminPasswordInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verifyAdminLogin();
    });
}

function verifyAdminLogin() {
    const email = document.getElementById('adminEmailInput').value.trim();
    const password = document.getElementById('adminPasswordInput').value;
    
    if (email === state.adminEmail && password === state.adminPassword) {
        state.isAdminLoggedIn = true;
        renderNavigation();
        closeLoginModal();
        alert('✓ Welcome Admin!');
    } else {
        alert('✗ Invalid email or password');
        document.getElementById('adminPasswordInput').value = '';
        document.getElementById('adminEmailInput').focus();
    }
}

function closeLoginModal() {
    const backdrop = document.getElementById('loginModalBackdrop');
    if (backdrop) backdrop.remove();
}

function showSignupModal() {
    alert('Signup functionality would be implemented here');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        state.isAdminLoggedIn = false;
        renderNavigation();
        closeAdminDashboard();
        alert('You have been logged out.');
    }
}

// ==================== ADMIN DASHBOARD ====================
function openAdminDashboard() {
    if (!state.isAdminLoggedIn) {
        alert('Please login as admin first');
        return;
    }
    
    document.getElementById('adminDashboard').classList.remove('hidden');
    
    // Initialize admin content
    renderProductsList();
    renderPromoItemsList();
    renderPaymentsList();
    document.getElementById('aboutTextarea').value = state.aboutContent;
    
    // Switch to first tab
    switchAdminTab('products');
    
    // Close user menu
    document.getElementById('userMenu').classList.add('hidden');
}

function closeAdminDashboard() {
    document.getElementById('adminDashboard').classList.add('hidden');
}

function switchAdminTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Remove active state from all tab buttons
    document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.classList.remove('active', 'border-b-2', 'border-neutral-900');
        btn.classList.add('border-b', 'border-neutral-200');
    });
    
    // Show selected tab
    const tabMap = {
        'products': 'productsTab',
        'logo': 'logoTab',
        'about': 'aboutTab',
        'notes': 'notesTab',
        'promo': 'promoTab',
        'payments': 'paymentsTab'
    };
    
    if (tabMap[tabName]) {
        document.getElementById(tabMap[tabName]).classList.remove('hidden');
        
        // Find and activate the corresponding button
        document.querySelectorAll('.admin-tab').forEach(btn => {
            if (btn.textContent.toLowerCase().includes(tabName.split('-')[0])) {
                btn.classList.add('active', 'border-b-2', 'border-neutral-900');
                btn.classList.remove('border-b', 'border-neutral-200');
            }
        });
    }
}

// Close dashboard on outside click
document.addEventListener('click', (e) => {
    const dashboard = document.getElementById('adminDashboard');
    if (e.target === dashboard) {
        closeAdminDashboard();
    }
});

// Keyboard shortcut: Escape to close dashboard
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAdminDashboard();
    }
});