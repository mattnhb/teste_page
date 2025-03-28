// Import constants
import { API, ANIMATION, DEFAULT_IMAGES } from './constants.js';

/**
 * Load experience data from JSON file
 */
function loadExperience() {
  console.log('Loading experience data from JSON...');
  
  fetch(API.EXPERIENCE_JSON)
    .then(handleApiResponse)
    .then(processExperienceData)
    .catch(handleExperienceError);
}

/**
 * Handle API response and check for errors
 * @param {Response} response - The fetch API response
 * @returns {Promise} - JSON promise with experience data
 */
function handleApiResponse(response) {
  if (!response.ok) {
    console.error('Failed to load experience data - response not OK');
    throw new Error('Failed to load experience data');
  }
  return response.json();
}

/**
 * Process the experience data from JSON
 * @param {Array} experienceData - Array of experience objects
 */
function processExperienceData(experienceData) {
  console.log(`Found ${experienceData.length} experience items`);
  
  if (experienceData.length > 0) {
    console.log('First experience item:', experienceData[0]);
  }
  
  renderExperience(experienceData);
}

/**
 * Handle errors when loading experience data
 * @param {Error} error - The error object
 */
function handleExperienceError(error) {
  console.error('Error loading experience data:', error);
  
  document.getElementById('experience-container').innerHTML = `
    <div class="loading-experience">
      <div class="text-center">
        <i class="fas fa-exclamation-circle" style="font-size: 2rem; color: #ff6b6b; margin-bottom: 1rem;"></i>
        <h3>Error loading experience data</h3>
        <p>Please try again later.</p>
      </div>
    </div>
  `;
}

/**
 * Render experience items to the DOM
 * @param {Array} experienceData - Array of experience objects
 */
function renderExperience(experienceData) {
  const container = document.getElementById('experience-container');
  
  if (!experienceData || experienceData.length === 0) {
    showEmptyExperienceMessage(container);
    return;
  }
  
  const timelineHtml = createExperienceTimeline(experienceData);
  container.innerHTML = timelineHtml;
  
  // Add animation to reveal cards sequentially
  animateExperienceCards(container);
}

/**
 * Show empty experience message when no data is found
 * @param {HTMLElement} container - The experience container
 */
function showEmptyExperienceMessage(container) {
  container.innerHTML = `
    <div class="loading-experience">
      <div class="text-center">
        <i class="fas fa-briefcase" style="font-size: 2rem; color: var(--primary); opacity: 0.5; margin-bottom: 1rem;"></i>
        <h3>No experience data found</h3>
        <p>Check back later for updates.</p>
      </div>
    </div>
  `;
}

/**
 * Create the HTML for the experience timeline
 * @param {Array} experienceData - Array of experience objects
 * @returns {string} - HTML for the experience timeline
 */
function createExperienceTimeline(experienceData) {
  let html = '<div class="experience-timeline">';
  
  experienceData.forEach(experience => {
    html += createExperienceCard(experience);
  });
  
  html += '</div>';
  return html;
}

/**
 * Create HTML for an individual experience card
 * @param {Object} experience - The experience object
 * @returns {string} - HTML for the experience card
 */
function createExperienceCard(experience) {
  // Create technology tags HTML
  const techTags = createTechnologyTags(experience.technologies);
  
  // Create highlights HTML
  const highlights = createHighlightsList(experience.highlights);

  // Default logo if none is provided
  const logoSrc = experience.logo || DEFAULT_IMAGES.COMPANY_LOGO;
  
  return `
    <div class="experience-card">
      <div class="experience-header">
        <img src="${logoSrc}" alt="${experience.company} logo" class="company-logo" onerror="this.src='${DEFAULT_IMAGES.COMPANY_LOGO}';">
        <div class="experience-title">
          <span class="experience-period">${experience.period}</span>
          <h3 class="experience-role">${experience.role}</h3>
          <h4 class="experience-company">${experience.company}</h4>
        </div>
      </div>
      <p class="experience-description">${experience.description}</p>
      ${highlights}
      ${techTags ? `<div class="experience-tech">${techTags}</div>` : ''}
    </div>
  `;
}

/**
 * Create HTML for technology tags
 * @param {Array} technologies - Array of technology names
 * @returns {string} - HTML for the technology tags
 */
function createTechnologyTags(technologies) {
  if (!technologies || technologies.length === 0) {
    return '';
  }
  
  return technologies.map(tech => 
    `<span class="experience-tech-tag">${tech}</span>`
  ).join('');
}

/**
 * Create HTML for highlights list
 * @param {Array} highlights - Array of highlight texts
 * @returns {string} - HTML for the highlights list
 */
function createHighlightsList(highlights) {
  if (!highlights || highlights.length === 0) {
    return '';
  }
  
  return `
    <div class="experience-highlights">
      <h4>Key Achievements</h4>
      <ul>
        ${highlights.map(highlight => `<li>${highlight}</li>`).join('')}
      </ul>
    </div>
  `;
}

/**
 * Animate experience cards to reveal sequentially
 * @param {HTMLElement} container - The experience container
 */
function animateExperienceCards(container) {
  const cards = container.querySelectorAll('.experience-card');
  
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease';
      card.style.opacity = '1';
    }, index * ANIMATION.EXPERIENCE_REVEAL_DELAY);
  });
}

// Initialize experience section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing experience section');
  loadExperience();
});

// Export functions for testing
export {
  loadExperience,
  renderExperience,
  createExperienceCard
}; 