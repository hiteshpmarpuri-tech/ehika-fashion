# Ehika Fashion - Luxury E-Commerce Website

A complete, modern, and luxurious e-commerce platform for high-end fashion with a secure admin dashboard and public storefront.

## Features

### 🎨 Design & UI/UX
- **Minimalist & Elegant**: Sophisticated color palette with deep blacks, whites, creams, and gold accents
- **Typography**: Playfair Display for headings, Lora for body text
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Smooth Animations**: Elegant transitions and hover effects

### 🛍️ Public Storefront
- **Homepage**: Hero banner with featured products
- **Shop Page**: Full product grid with filtering capabilities
- **Product Detail Pages**: Detailed product information with images
- **About Page**: Dynamically editable content
- **Search Functionality**: Quick product search
- **Announcements Section**: Dynamic notes/updates from admin
- **Responsive Navigation**: Minimalist header with logo, search, and user menu

### 🔐 Admin Dashboard
- **Secure Authentication**: Admin-only access with password protection
- **Product Management**:
  - Add new products with title, price, description, and images
  - Edit existing products
  - Delete products
  - Auto-saves to local storage
  
- **Logo Management**:
  - Upload and manage brand logo
  - Responsive image handling
  - Preview before saving
  
- **About Page Editor**:
  - Rich text area for content editing
  - Real-time updates on public page
  
- **Announcements/Notes**:
  - Create and manage announcements
  - Display on public pages
  - Admin can delete notes
  
- **Promo Bar Customization**:
  - Add customizable promo items
  - Set colors for each item
  - Dynamic text display
  
- **Payment Methods Management**:
  - Add payment options
  - Manage payment details
  - Support for multiple payment methods

### 💾 Data Persistence
- LocalStorage-based persistence
- Auto-save on all changes
- No backend required (frontend-only)

## Project Structure

```
ehika-fashion/
├── index.html          # Main HTML structure
├── styles.css          # Custom CSS with Tailwind
├── app.js             # JavaScript application logic
└── README.md          # Documentation
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server or installation required

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hiteshpmarpuri-tech/ehika-fashion.git
```

2. Open `index.html` in your web browser

3. That's it! The website is now running locally

## Admin Access

### Login Credentials
- **Username**: Admin (any username works)
- **Password**: `admin123`

### Accessing Admin Dashboard
1. Click the User Icon in the top-right navigation
2. Click "Login"
3. Enter the password: `admin123`
4. Click "Admin Dashboard" in the user menu

## Usage

### Adding Products
1. Open Admin Dashboard
2. Go to "Products" tab
3. Fill in product details (title, price, description)
4. Select product image
5. Click "Add Product"

### Uploading Logo
1. Open Admin Dashboard
2. Go to "Logo" tab
3. Click to upload logo image
4. Click "Save Logo"

### Editing About Page
1. Open Admin Dashboard
2. Go to "About Page" tab
3. Edit content in text area
4. Click "Save Changes"

### Creating Announcements
1. Open Admin Dashboard
2. Go to "Notes" tab
3. Type announcement text
4. Click "Add Note"
5. Notes appear in "Latest Updates" section on homepage

### Managing Promo Bar
1. Open Admin Dashboard
2. Go to "Promo Icons" tab
3. Enter promo text and select color
4. Click "Add Item"
5. Promo items display in top navigation bar

### Managing Payment Methods
1. Open Admin Dashboard
2. Go to "Payments" tab
3. Enter payment method name, icon class, and details
4. Click "Add Payment Method"

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom styling with Tailwind CSS
- **JavaScript (Vanilla)**: No frameworks required
- **Font Awesome**: Icons and UI elements
- **Google Fonts**: Playfair Display & Lora
- **LocalStorage API**: Data persistence

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Features Roadmap

- [ ] Shopping cart functionality
- [ ] Checkout system
- [ ] Payment gateway integration
- [ ] User accounts & wishlist
- [ ] Product reviews & ratings
- [ ] Email notifications
- [ ] Backend API integration
- [ ] Database implementation
- [ ] Analytics dashboard

## Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --gold: #D4AF37;      /* Change gold accent color */
    --dark: #1a1a1a;      /* Change dark color */
    --light: #f5f5f5;     /* Change light color */
}
```

### Changing Fonts
Modify the Google Fonts import in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap" rel="stylesheet">
```

### Changing Admin Password
In `app.js`, find the `showLoginModal()` function:
```javascript
if (adminPassword === 'your-new-password') {
    // ...
}
```

## Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## Security Notes

⚠️ **Important**: This is a frontend-only application with basic authentication. For production:
- Implement proper backend authentication
- Use encrypted passwords
- Implement JWT tokens
- Add CORS protection
- Use HTTPS
- Implement rate limiting
- Add input validation and sanitization

## License

MIT License - Feel free to use this project for personal and commercial purposes.

## Support

For issues or questions, please create an issue on GitHub.

## Credits

Built with ❤️ for Ehika Fashion

---

**Version**: 1.0.0  
**Last Updated**: 2024