# Mateus Nicolas Hechenblaichner Balestrin - Data Engineer Portfolio

This is my professional portfolio website built with GitHub Pages. The site showcases my data engineering skills, projects, experience, and publications in a modern, responsive design.

## Features

- Responsive design that works on all devices
- Elegant dark theme with purple and black gradient accents
- Support for PDF file links (resume, project documentation, publications)
- Image support for profile photo, project screenshots, and certifications
- Bootstrap-powered carousel for certifications display
- Bootstrap pagination for publications section
- Dynamic experience timeline
- Clean and modular code structure following best practices
- Animated elements for a dynamic user experience
- Card-based project layout with hover effects
- Interactive skill tags with hover effects
- Social media links including PDF resume
- Sections for certifications, publications, and experience

## Technologies Used

- HTML5
- CSS3 (with CSS Variables, Flexbox, Grid)
- JavaScript (ES Modules, OOP principles, clean code)
- Bootstrap 5 (Carousel, Pagination, Grid System)
- Font Awesome icons
- Intersection Observer API for scroll animations
- Fetch API for loading data from JSON and markdown files

## Project Structure

The codebase follows a modular approach with clean separation of concerns:

```
├── index.html             # Main HTML file
├── css/                   # Modular CSS files
│   ├── main.css           # Base styles and variables
│   ├── components.css     # Reusable component styles
│   ├── animations.css     # Animation definitions
│   ├── carousel.css       # Certification carousel styles
│   ├── publications.css   # Publication section styles
│   ├── experience.css     # Experience section styles
│   └── sections.css       # Section-specific styles
├── js/                    # Modular JavaScript files
│   ├── constants.js       # Shared constants and configuration
│   ├── utilities.js       # Utility/helper functions
│   ├── main.js            # Core initialization and features
│   ├── bootstrap-carousel.js    # Certifications carousel
│   ├── bootstrap-publications.js # Publications with pagination
│   └── bootstrap-experience.js  # Experience timeline loading
└── assets/                # Static assets
    ├── data/              # Data files (JSON, markdown)
    ├── images/            # Image files
    └── pdf/               # PDF documents
```

## Code Standards

This project follows these clean code principles:

- **Single Responsibility Principle**: Each module has one responsibility
- **DRY (Don't Repeat Yourself)**: Common functionality is extracted to utilities
- **Constants over Magic Numbers**: All magic numbers and strings are defined as constants
- **Meaningful Names**: Variables and functions have descriptive names
- **Smart Comments**: JSDoc style documentation for functions
- **Clean Structure**: Organized directory and file structure
- **Error Handling**: Proper error states and fallbacks

## Setup

To run this website locally:

1. Clone this repository
2. Open `index.html` in your browser (use a local server for ES modules support)

To deploy to GitHub Pages:

1. Push this repository to GitHub
2. Enable GitHub Pages in your repository settings
3. Your site will be available at https://mattnhb.github.io

## Data Files

The portfolio uses the following data files:

- `assets/data/certifications.json` - Certification data
- `assets/data/publications.md` - Publications in markdown format
- `assets/data/experience.json` - Work experience data

## Customization

You can customize this template by:

- Editing the data files to update content
- Modifying the constants in `js/constants.js` to change behavior
- Updating CSS variables in `:root` to change the color scheme
- Adding or removing sections in the HTML as needed

## Contact

Feel free to reach out if you have any questions or would like to collaborate!

- GitHub: [mattnhb](https://github.com/mattnhb)
- LinkedIn: [mattnhb](https://linkedin.com/in/mattnhb)
- Email: mateus.contact@example.com

## License

Feel free to use this template for your personal GitHub Pages website!

## Preview

Visit [https://mattnhb.github.io](https://mattnhb.github.io) to see the live site.
