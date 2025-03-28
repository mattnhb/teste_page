/**
 * Utility functions for the portfolio website
 */

/**
 * Creates an HTML element with attributes and content
 * @param {string} tag - The HTML tag name
 * @param {Object} attributes - Key-value pairs of attributes
 * @param {string|HTMLElement|Array} content - The content to append (string, element, or array of elements)
 * @returns {HTMLElement} - The created element
 */
function createElement(tag, attributes = {}, content = null) {
  const element = document.createElement(tag);
  
  // Add attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // Add content
  if (content) {
    if (typeof content === 'string') {
      element.innerHTML = content;
    } else if (Array.isArray(content)) {
      content.forEach(child => {
        if (child instanceof HTMLElement) {
          element.appendChild(child);
        } else if (typeof child === 'string') {
          element.innerHTML += child;
        }
      });
    } else if (content instanceof HTMLElement) {
      element.appendChild(content);
    }
  }
  
  return element;
}

/**
 * Handles API fetch responses, checking for errors
 * @param {Response} response - The fetch API response
 * @param {string} errorMessage - Custom error message
 * @returns {Promise} - Promise with the response data
 */
function handleApiResponse(response, errorMessage = 'API request failed') {
  if (!response.ok) {
    console.error(`${errorMessage} - response not OK`);
    throw new Error(errorMessage);
  }
  return response;
}

/**
 * Creates an error message container
 * @param {string} message - The error message
 * @param {string} icon - Font Awesome icon class (without the 'fa-' prefix)
 * @returns {string} - HTML for the error container
 */
function createErrorMessage(message, icon = 'exclamation-circle') {
  return `
    <div class="text-center">
      <i class="fas fa-${icon}" style="font-size: 2rem; color: #ff6b6b; margin-bottom: 1rem;"></i>
      <h3>Error: ${message}</h3>
      <p>Please try again later.</p>
    </div>
  `;
}

/**
 * Creates an empty state message container
 * @param {string} message - The empty state message
 * @param {string} icon - Font Awesome icon class (without the 'fa-' prefix)
 * @returns {string} - HTML for the empty state container
 */
function createEmptyStateMessage(message, icon) {
  return `
    <div class="text-center">
      <i class="fas fa-${icon}" style="font-size: 2rem; color: var(--primary); opacity: 0.5; margin-bottom: 1rem;"></i>
      <h3>${message}</h3>
      <p>Check back later for updates.</p>
    </div>
  `;
}

/**
 * Formats a date string to a localized format
 * @param {string} dateString - The date string to format
 * @param {Object} options - Formatting options for toLocaleDateString
 * @returns {string} - The formatted date or empty string if invalid
 */
function formatDate(dateString, options = { year: 'numeric', month: 'long' }) {
  if (!dateString) {
    return '';
  }
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  } catch (e) {
    console.warn('Failed to format date:', dateString);
    return dateString; // Return as is if parsing fails
  }
}

/**
 * Creates a loading spinner with message
 * @param {string} message - The loading message
 * @returns {string} - HTML for the loading spinner
 */
function createLoadingSpinner(message) {
  return `
    <div class="text-center">
      <div class="spinner-border text-primary mb-3" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <h3>${message}</h3>
    </div>
  `;
}

/**
 * Applies a staggered animation to elements
 * @param {NodeList} elements - The elements to animate
 * @param {string} className - The class to add for animation
 * @param {number} delay - Delay between elements in ms
 */
function applyStaggeredAnimation(elements, className, delay) {
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add(className);
    }, index * delay);
  });
}

// Export utility functions
export {
  createElement,
  handleApiResponse,
  createErrorMessage,
  createEmptyStateMessage,
  formatDate,
  createLoadingSpinner,
  applyStaggeredAnimation
}; 