# Dynamic Accent Colors Feature

## Overview
The To-Do List app now supports dynamic accent colors that allow users to personalize their experience with different color themes.

## Available Themes
- 🔵 **Blue Ocean** - Classic blue gradient (default)
- 🟣 **Purple Galaxy** - Rich purple tones
- 🟢 **Forest Green** - Natural green shades
- 🟠 **Sunset Orange** - Warm orange hues
- 🩷 **Cherry Blossom** - Soft pink colors
- 🔷 **Ocean Teal** - Cool teal tones

## How to Use
1. Navigate to the main To-Do List page (home.html)
2. Look for the theme selector dropdown in the top navigation bar
3. Select your preferred color theme from the dropdown
4. The theme will be applied instantly and saved for future visits

## Technical Implementation
- **CSS Custom Properties** - Uses CSS variables for dynamic theming
- **Background Gradients** - Three-color gradients that change with themes
- **Glassmorphism Effects** - Semi-transparent header and footer with backdrop blur
- **Theme Persistence** - Preference saved in localStorage
- **Smooth Transitions** - 0.5s ease transitions for background changes
- **Cross-Page Consistency** - Theming works across all pages (login, signup, main app)

## Affected Elements
The following UI elements adapt to the selected theme:
- **Background Gradients** - Full page background changes with theme
- **Add Task button** - Uses theme colors for gradient
- **Form focus states** - Search, sort, and input fields
- **Complete task button** - Adapts to theme colors
- **Navigation elements** - Header and footer with glassmorphism effect
- **Button hover effects** - All interactive elements
- **Logo and branding** - Theme-aware color schemes

## Browser Support
This feature works in all modern browsers that support CSS custom properties:
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 16+

## Files Modified
- `home.html` - Added theme selector and JavaScript functionality
- `login.html` - Updated to use CSS variables
- `index.html` - Updated to use CSS variables  
- `assets/css/style.css` - Added CSS custom properties and theme variations

## Future Enhancements
- Additional color themes
- Dark/light mode integration with themes
- Custom color picker for advanced users
- Theme preview before selection