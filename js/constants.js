// Constants for the portfolio website

// Animation timing
const ANIMATION = {
  SKILL_TAG_DELAY: 100, // 100ms delay between skill tag animations
  SCROLL_THRESHOLD: 0.15, // Intersection observer threshold
  SKILLS_THRESHOLD: 0.5, // Skills section observation threshold
  EXPERIENCE_REVEAL_DELAY: 300, // Delay between experience card animations
};

// Carousel settings
const CAROUSEL = {
  ITEMS_PER_SLIDE: 3, // Number of certification items per slide
  AUTO_SLIDE_INTERVAL: false, // No auto sliding for carousels
  WRAP: true, // Continuous cycling for carousels
};

// Pagination settings
const PAGINATION = {
  PUBLICATIONS_PER_PAGE: 4, // Publications per page
};

// Image dimensions for fallbacks
const PLACEHOLDER_IMAGES = {
  PROFILE: "200x200",
  PROJECT: "800x450", 
  CERTIFICATION: "500x300",
};

// API endpoints
const API = {
  CERTIFICATIONS_JSON: 'assets/data/certifications.json',
  PUBLICATIONS_MD: 'assets/data/publications.md',
  EXPERIENCE_JSON: 'assets/data/experience.json',
};

// Default images
const DEFAULT_IMAGES = {
  PROFILE: "https://via.placeholder.com/200x200/9d4edd/ffffff?text=Mateus+Nicolas",
  COMPANY_LOGO: "assets/images/default-company.png",
};

// Export all constants
export {
  ANIMATION,
  CAROUSEL,
  PAGINATION,
  PLACEHOLDER_IMAGES,
  API,
  DEFAULT_IMAGES
}; 