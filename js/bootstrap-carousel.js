// Import constants
import { CAROUSEL, API, PLACEHOLDER_IMAGES } from './constants.js';

/**
 * Load certifications from JSON file and initialize the Bootstrap carousel
 */
function loadCertifications() {
  console.log('Loading certifications with Bootstrap carousel...');
  
  fetch(API.CERTIFICATIONS_JSON)
    .then(handleApiResponse)
    .then(initializeCarousel)
    .catch(handleCarouselError);
}

/**
 * Handle the API response, check for errors
 * @param {Response} response - The fetch API response
 * @returns {Promise} - JSON promise with certification data
 */
function handleApiResponse(response) {
  if (!response.ok) {
    console.error('Failed to load certifications - response not OK');
    throw new Error('Failed to load certifications');
  }
  return response.json();
}

/**
 * Initialize the carousel with certification data
 * @param {Array} certifications - Array of certification objects
 */
function initializeCarousel(certifications) {
  console.log(`Found ${certifications.length} certification items`);
  
  if (!certifications || certifications.length === 0) {
    showEmptyCarouselMessage();
    return;
  }
  
  buildCarouselSlides(certifications);
  setupCarouselControls();
}

/**
 * Handle carousel loading error
 * @param {Error} error - The error object
 */
function handleCarouselError(error) {
  console.error('Error loading certifications:', error);
  
  document.querySelector('.carousel-inner').innerHTML = `
    <div class="carousel-item active">
      <div class="loading-certifications">
        <div class="text-center">
          <i class="fas fa-exclamation-circle" style="font-size: 2rem; color: #ff6b6b; margin-bottom: 1rem;"></i>
          <h3>Error loading certifications</h3>
          <p>Please try again later.</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Show empty carousel message when no certifications are found
 */
function showEmptyCarouselMessage() {
  document.querySelector('.carousel-inner').innerHTML = `
    <div class="carousel-item active">
      <div class="loading-certifications">
        <div class="text-center">
          <i class="fas fa-certificate" style="font-size: 2rem; color: var(--primary); opacity: 0.5; margin-bottom: 1rem;"></i>
          <h3>No certifications found</h3>
          <p>Check back later for updates.</p>
        </div>
      </div>
    </div>
  `;
  
  // Hide carousel controls if no certifications
  hideCarouselControls();
}

/**
 * Hide carousel navigation controls
 */
function hideCarouselControls() {
  document.querySelector('.carousel-control-prev').style.display = 'none';
  document.querySelector('.carousel-control-next').style.display = 'none';
  document.querySelector('.carousel-indicators').style.display = 'none';
}

/**
 * Build carousel slides from certification data
 * @param {Array} certifications - Array of certification objects
 */
function buildCarouselSlides(certifications) {
  // Group certifications into slides
  const numberOfSlides = Math.ceil(certifications.length / CAROUSEL.ITEMS_PER_SLIDE);
  
  console.log(`Creating bootstrap carousel with ${certifications.length} items across ${numberOfSlides} slides`);
  
  const carouselInner = document.querySelector('.carousel-inner');
  const indicators = document.querySelector('.carousel-indicators');
  
  // Clear existing content
  carouselInner.innerHTML = '';
  indicators.innerHTML = '';
  
  // Create carousel slides
  for (let slideIndex = 0; slideIndex < numberOfSlides; slideIndex++) {
    createCarouselSlide(slideIndex, certifications, carouselInner, indicators);
  }
}

/**
 * Create an individual carousel slide with certifications
 * @param {number} slideIndex - The index of the slide
 * @param {Array} certifications - Array of certification objects
 * @param {HTMLElement} carouselInner - The carousel inner container
 * @param {HTMLElement} indicators - The indicators container
 */
function createCarouselSlide(slideIndex, certifications, carouselInner, indicators) {
  // Calculate range for this slide
  const startIndex = slideIndex * CAROUSEL.ITEMS_PER_SLIDE;
  const endIndex = Math.min(startIndex + CAROUSEL.ITEMS_PER_SLIDE, certifications.length);
  
  console.log(`Slide ${slideIndex+1}: Items ${startIndex+1} to ${endIndex} (of ${certifications.length})`);
  
  // Create indicator button
  createSlideIndicator(slideIndex, indicators);
  
  // Create carousel item
  const carouselItem = createCarouselItem(slideIndex);
  
  // Create row for the certifications (Bootstrap grid)
  const row = document.createElement('div');
  row.className = 'row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4';
  
  // Add certification items to this slide
  for (let certIndex = startIndex; certIndex < endIndex; certIndex++) {
    const certificationElement = createCertificationElement(certifications[certIndex]);
    row.appendChild(certificationElement);
  }
  
  carouselItem.appendChild(row);
  carouselInner.appendChild(carouselItem);
}

/**
 * Create a slide indicator button
 * @param {number} slideIndex - The index of the slide
 * @param {HTMLElement} indicators - The indicators container
 * @returns {HTMLElement} The created indicator
 */
function createSlideIndicator(slideIndex, indicators) {
  const indicator = document.createElement('button');
  indicator.type = 'button';
  indicator.setAttribute('data-bs-target', '#certificationsCarousel');
  indicator.setAttribute('data-bs-slide-to', slideIndex);
  if (slideIndex === 0) {
    indicator.classList.add('active');
    indicator.setAttribute('aria-current', 'true');
  }
  indicator.setAttribute('aria-label', `Slide ${slideIndex + 1}`);
  indicators.appendChild(indicator);
  return indicator;
}

/**
 * Create a carousel item element
 * @param {number} slideIndex - The index of the slide
 * @returns {HTMLElement} The created carousel item
 */
function createCarouselItem(slideIndex) {
  const carouselItem = document.createElement('div');
  carouselItem.className = 'carousel-item';
  if (slideIndex === 0) {
    carouselItem.classList.add('active');
  }
  return carouselItem;
}

/**
 * Create certification element for the carousel
 * @param {Object} cert - The certification data
 * @returns {HTMLElement} The created certification column
 */
function createCertificationElement(cert) {
  // Format issue date if available
  const issueDateText = formatIssueDate(cert.issueDate);
  
  // Create column for grid layout
  const col = document.createElement('div');
  col.className = 'col';
  
  // Create certification item
  col.innerHTML = `
    <div class="cert-item">
      <a href="${cert.verifyUrl}" target="_blank" title="View certification">
        <img src="${cert.imageUrl}" alt="${cert.title}" 
             onerror="this.onerror=null; this.src='https://via.placeholder.com/${PLACEHOLDER_IMAGES.CERTIFICATION}/ff9900/10002b?text=${encodeURIComponent(cert.title)}';" />
      </a>
      <div class="cert-info">
        <a href="${cert.verifyUrl}" target="_blank" title="View certification" style="text-decoration: none;">
          <h3>${cert.title}</h3>
        </a>
        ${cert.organization ? `<div class="cert-issuer"><i class="fas fa-building"></i> ${cert.organization}</div>` : ''}
        ${issueDateText ? `<div class="cert-date"><i class="fas fa-calendar-alt"></i> ${issueDateText}</div>` : ''}
      </div>
    </div>
  `;
  
  return col;
}

/**
 * Format the issue date in a readable format
 * @param {string} dateString - The date string to format
 * @returns {string} The formatted date or empty string if invalid
 */
function formatIssueDate(dateString) {
  if (!dateString) {
    return '';
  }
  
  try {
    const issueDate = new Date(dateString);
    return issueDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  } catch (e) {
    return dateString; // Use as is if parsing fails
  }
}

/**
 * Setup the Bootstrap carousel controls and behavior
 */
function setupCarouselControls() {
  // Initialize Bootstrap carousel
  const carousel = new bootstrap.Carousel(document.getElementById('certificationsCarousel'), {
    interval: CAROUSEL.AUTO_SLIDE_INTERVAL,
    wrap: CAROUSEL.WRAP
  });
  
  console.log('Bootstrap carousel setup complete');
}

/**
 * Remove the old carousel.js script if it's included
 */
function disableOldCarouselFunctions() {
  if (typeof setupCarousel === 'function') {
    console.log('Removing old carousel functions to prevent conflicts');
    setupCarousel = function() { 
      console.log('Old carousel function disabled'); 
    };
    initCarousel = function() { 
      console.log('Old carousel initialization disabled'); 
    };
  }
}

// Call the load function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing certifications carousel');
  disableOldCarouselFunctions();
  loadCertifications();
});

// Export functions for testing
export { 
  loadCertifications,
  initializeCarousel,
  buildCarouselSlides,
  createCertificationElement
}; 