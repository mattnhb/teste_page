// Import constants
import { API, PAGINATION } from './constants.js';

/**
 * Load publications from markdown file
 */
function loadPublications() {
  console.log('Loading publications with Bootstrap pagination...');
  
  fetch(API.PUBLICATIONS_MD)
    .then(handleApiResponse)
    .then(processPublicationsData)
    .catch(handlePublicationsError);
}

/**
 * Handle API response for publications
 * @param {Response} response - The fetch API response
 * @returns {Promise} - Promise with the markdown text
 */
function handleApiResponse(response) {
  if (!response.ok) {
    console.error('Failed to load publications - response not OK');
    throw new Error('Failed to load publications');
  }
  return response.text();
}

/**
 * Process the publications markdown data
 * @param {string} markdown - The markdown text containing publications
 */
function processPublicationsData(markdown) {
  const publications = parsePublicationsMarkdown(markdown);
  console.log(`Found ${publications.length} publications`);
  
  if (publications.length > 0) {
    console.log('First publication:', publications[0]);
  }
  
  initPublicationsPagination(publications);
}

/**
 * Handle errors loading publications
 * @param {Error} error - The error object
 */
function handlePublicationsError(error) {
  console.error('Error loading publications:', error);
  
  document.getElementById('publications-container').innerHTML = `
    <div class="text-center">
      <i class="fas fa-exclamation-circle" style="font-size: 2rem; color: #ff6b6b; margin-bottom: 1rem;"></i>
      <h3>Error loading publications</h3>
      <p>Please try again later.</p>
    </div>
  `;
}

/**
 * Parse markdown content to extract publications
 * @param {string} markdown - The markdown text to parse
 * @returns {Array} - Array of publication objects
 */
function parsePublicationsMarkdown(markdown) {
  const publications = [];
  let currentPublication = null;
  
  const lines = markdown.split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    if (line.startsWith('## ')) {
      // If we were processing a publication, push it to the array
      if (currentPublication) {
        publications.push(currentPublication);
      }
      
      // Start a new publication
      currentPublication = createNewPublication(line);
    } else if (line.startsWith('http')) {
      // This is a URL
      if (currentPublication) {
        currentPublication.url = line.trim();
      }
    } else if (isDateLine(line)) {
      // This is likely a date or publication venue
      if (currentPublication) {
        currentPublication.date = line.trim();
      }
    } else if (currentPublication && !line.startsWith('#')) {
      // This is publication details
      appendToPublicationDetails(currentPublication, line);
    }
  }
  
  // Don't forget to add the last publication
  if (currentPublication) {
    publications.push(currentPublication);
  }
  
  return publications;
}

/**
 * Create a new publication object from a heading line
 * @param {string} line - The heading line
 * @returns {Object} - New publication object
 */
function createNewPublication(line) {
  return {
    title: line.replace('## ', '').trim(),
    details: '',
    url: '',
    date: ''
  };
}

/**
 * Check if a line contains date information
 * @param {string} line - The line to check
 * @returns {boolean} - True if the line contains date information
 */
function isDateLine(line) {
  return line.startsWith('Published') || 
         line.startsWith('From') || 
         line.includes('20'); // Assume 20 is part of a year (2020, etc.)
}

/**
 * Append text to publication details
 * @param {Object} publication - The publication object
 * @param {string} line - The line to append
 */
function appendToPublicationDetails(publication, line) {
  publication.details += publication.details ? ' ' + line : line;
}

/**
 * Initialize Bootstrap pagination for publications
 * @param {Array} publications - Array of publication objects
 */
function initPublicationsPagination(publications) {
  const container = document.getElementById('publications-container');
  
  if (!publications || publications.length === 0) {
    showEmptyPublicationsMessage(container);
    return;
  }
  
  // Define pagination parameters
  const totalPages = Math.ceil(publications.length / PAGINATION.PUBLICATIONS_PER_PAGE);
  
  console.log(`Creating publication pagination with ${publications.length} items across ${totalPages} pages`);
  
  const paginationElement = createOrGetPaginationElement();
  const paginationList = paginationElement.querySelector('.pagination');
  paginationList.innerHTML = '';
  
  buildPaginationControls(paginationList, totalPages);
  
  // Show the first page initially
  showPublicationsPage(publications, 1, PAGINATION.PUBLICATIONS_PER_PAGE);
  
  // Add event listeners to pagination buttons
  setupPaginationEventListeners(paginationList, publications, totalPages);
}

/**
 * Show empty publications message
 * @param {HTMLElement} container - The publications container
 */
function showEmptyPublicationsMessage(container) {
  container.innerHTML = `
    <div class="text-center">
      <i class="fas fa-book" style="font-size: 2rem; color: var(--primary); opacity: 0.5; margin-bottom: 1rem;"></i>
      <h3>No publications found</h3>
      <p>Check back later for updates.</p>
    </div>
  `;
  
  // Hide pagination if no publications
  const paginationElement = document.querySelector('.publications-pagination');
  if (paginationElement) {
    paginationElement.style.display = 'none';
  }
}

/**
 * Create or get pagination element
 * @returns {HTMLElement} - The pagination element
 */
function createOrGetPaginationElement() {
  let paginationElement = document.querySelector('.publications-pagination');
  
  if (!paginationElement) {
    paginationElement = document.createElement('nav');
    paginationElement.className = 'publications-pagination mt-4';
    paginationElement.setAttribute('aria-label', 'Publications pagination');
    paginationElement.innerHTML = `
      <ul class="pagination justify-content-center"></ul>
    `;
    
    // Find the publications section and append the pagination
    const publicationsSection = document.getElementById('publications');
    if (publicationsSection) {
      publicationsSection.querySelector('.card').appendChild(paginationElement);
    }
  }
  
  return paginationElement;
}

/**
 * Build pagination controls
 * @param {HTMLElement} paginationList - The pagination list element
 * @param {number} totalPages - Total number of pages
 */
function buildPaginationControls(paginationList, totalPages) {
  // Add "Previous" button
  paginationList.innerHTML += `
    <li class="page-item disabled">
      <a class="page-link" href="#" aria-label="Previous" data-page="prev">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
  `;
  
  // Add page numbers
  for (let i = 1; i <= totalPages; i++) {
    paginationList.innerHTML += `
      <li class="page-item ${i === 1 ? 'active' : ''}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }
  
  // Add "Next" button
  paginationList.innerHTML += `
    <li class="page-item ${totalPages > 1 ? '' : 'disabled'}">
      <a class="page-link" href="#" aria-label="Next" data-page="next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  `;
}

/**
 * Setup event listeners for pagination buttons
 * @param {HTMLElement} paginationList - The pagination list element
 * @param {Array} publications - Array of publication objects
 * @param {number} totalPages - Total number of pages
 */
function setupPaginationEventListeners(paginationList, publications, totalPages) {
  const pageLinks = paginationList.querySelectorAll('.page-link');
  let currentPage = 1;
  
  pageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const pageData = link.getAttribute('data-page');
      
      if (pageData === 'prev') {
        if (currentPage > 1) {
          currentPage--;
          updatePublicationsView(publications, currentPage, paginationList, totalPages);
        }
      } else if (pageData === 'next') {
        if (currentPage < totalPages) {
          currentPage++;
          updatePublicationsView(publications, currentPage, paginationList, totalPages);
        }
      } else {
        currentPage = parseInt(pageData);
        updatePublicationsView(publications, currentPage, paginationList, totalPages);
      }
    });
  });
}

/**
 * Update the publications view
 * @param {Array} publications - Array of publication objects
 * @param {number} currentPage - Current page number
 * @param {HTMLElement} paginationList - The pagination list element
 * @param {number} totalPages - Total number of pages
 */
function updatePublicationsView(publications, currentPage, paginationList, totalPages) {
  showPublicationsPage(publications, currentPage, PAGINATION.PUBLICATIONS_PER_PAGE);
  updatePaginationActiveState(paginationList, currentPage);
  updatePaginationButtonStates(paginationList, currentPage, totalPages);
}

/**
 * Update pagination button states (enabled/disabled)
 * @param {HTMLElement} paginationList - The pagination list element
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 */
function updatePaginationButtonStates(paginationList, currentPage, totalPages) {
  const prevButton = paginationList.querySelector('[data-page="prev"]').parentNode;
  const nextButton = paginationList.querySelector('[data-page="next"]').parentNode;
  
  prevButton.classList.toggle('disabled', currentPage === 1);
  nextButton.classList.toggle('disabled', currentPage === totalPages);
}

/**
 * Show specific page of publications
 * @param {Array} publications - Array of publication objects
 * @param {number} page - Page number to show
 * @param {number} itemsPerPage - Number of items per page
 */
function showPublicationsPage(publications, page, itemsPerPage) {
  const container = document.getElementById('publications-container');
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, publications.length);
  
  console.log(`Showing publications page ${page}: items ${startIndex + 1} to ${endIndex} (of ${publications.length})`);
  
  let html = '';
  
  // Generate publication cards for this page
  for (let i = startIndex; i < endIndex; i++) {
    const pub = publications[i];
    html += createPublicationCard(pub);
  }
  
  container.innerHTML = `
    <div class="publications-grid">
      ${html}
    </div>
  `;
}

/**
 * Create a publication card HTML
 * @param {Object} publication - The publication object
 * @returns {string} - HTML for the publication card
 */
function createPublicationCard(publication) {
  return `
    <div class="publication-card">
      <h3 class="publication-title">${publication.title}</h3>
      ${publication.date ? `<div class="publication-date">${publication.date}</div>` : ''}
      <p class="publication-details">${publication.details}</p>
      ${publication.url ? `<a href="${publication.url}" target="_blank" class="publication-link">Read more <i class="fas fa-external-link-alt"></i></a>` : ''}
    </div>
  `;
}

/**
 * Update the active state of pagination buttons
 * @param {HTMLElement} paginationList - The pagination list element
 * @param {number} activePage - The currently active page
 */
function updatePaginationActiveState(paginationList, activePage) {
  const pageItems = paginationList.querySelectorAll('.page-item');
  
  pageItems.forEach(item => {
    const link = item.querySelector('.page-link');
    if (link) {
      const pageNum = link.getAttribute('data-page');
      if (pageNum && !isNaN(pageNum) && parseInt(pageNum) === activePage) {
        item.classList.add('active');
      } else if (pageNum && !isNaN(pageNum)) {
        item.classList.remove('active');
      }
    }
  });
}

// Initialize publications when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing publications');
  loadPublications();
});

// Export functions for testing
export {
  loadPublications,
  parsePublicationsMarkdown,
  showPublicationsPage,
  updatePaginationActiveState
}; 