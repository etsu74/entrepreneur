# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for a Japanese university entrepreneurship club (ZEN大学起業サークル). The site showcases club activities, member information, and provides resources for student entrepreneurs.

## Architecture

**Static Website Structure:**
- `index.html` - Main landing page with hero section, events, and documents
- `css/style.css` - All styling including responsive design and animations
- `js/script.js` - Interactive functionality and animations
- `images/` - Hero backgrounds, logo, and member photos

**Key Components:**
- **Hero Section**: Background slider with cross-fade animations between multiple background images
- **Events Section**: Horizontal scrollable button container with custom Wreath design backgrounds
- **Documents Section**: Grid of interactive PDF document cards
- **Modal System**: Image viewer for member photos with fade animations

## Key Features

**Video/Background System (script.js:27-154):**
- Initial MP4 video playback (`Firefly_537327.mp4`) with poster fallback
- Video transitions to background image slider after completion
- Cross-fade transitions between background images every 6 seconds
- Video scaling animation (1.0 to 1.1 scale over 5 seconds)

**Navigation Menu (css/style.css:827-900):**
- Fixed circular menu button in top-right corner
- Slide-in menu overlay with fade/slide animations
- Menu opens from right side covering 80% of viewport width
- JavaScript-controlled show/hide functionality (script.js:800-805)

**Enhanced Document Section:**
- Blog-style article cards with category tags and dates
- Image thumbnails for each article card
- "Load More" button with dynamic content generation (script.js:720-797)
- Category color coding and responsive card layout

**Interactive Elements:**
- Drag/touch scrolling for events container (script.js:183-258)
- Image modal for member photos with keyboard/click controls
- Smooth scroll with scroll indicator
- Improved document card hover effects with duplicate event prevention

**News/Information Section:**
- Dedicated announcements section between events and articles
- Simple list-based layout for quick updates

**Responsive Design:**
- Mobile-first approach with multiple breakpoints
- Touch device optimizations and viewport height adjustments
- Updated color scheme (#3470a5 primary blue)
- Custom scrollbar styling for horizontal scroll containers

## Development Commands

Since this is a static website with no build process, testing is done by:
- Opening `index.html` directly in a browser
- Using a local development server like `python -m http.server` or `live-server`
- Checking console for background slider debug logs and error messages

## Code Style

- Japanese comments and text content throughout
- Extensive CSS animations and transitions
- Modular JavaScript with clear function separation
- Performance optimizations with throttling/debouncing (script.js:689-713)
- Accessibility features including keyboard navigation (script.js:601-627)

## Important Notes

- **Video Assets**: `Firefly_537327.mp4` plays on hero section load, then transitions to background slider
- **Images**: Background images expected in `images/` directory (hero-bg-1.jpg through hero-bg-13.jpg)
- **Custom Assets**: Wreath design (`Button_Wreath_v2.png`), favicon (`favicon.ico`)
- **Menu System**: Fixed positioned menu button with overlay navigation
- **Dynamic Content**: "More" button loads additional article cards via JavaScript array
- **Color Scheme**: Primary blue (#3470a5) used throughout for consistency
- **Font Awesome**: Updated to version 7.0.0 for latest icons
- **Performance**: Video scaling animation and optimized card hover effects