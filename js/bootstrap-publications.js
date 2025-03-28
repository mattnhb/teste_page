// Function to load publications from markdown file
function loadPublications() {
  console.log('Loading publications with Bootstrap pagination...');
  fetch('assets/data/publications.md')
    .then(response => {
      if (!response.ok) {
        console.error('Failed to load publications - response not OK');
        throw new Error('Failed to load publications');
      }
      return response.text();
    })
    .then(markdown => {
      const publications = parsePublicationsMarkdown(markdown);
      console.log(`Found ${publications.length} publications`);
      if (publications.length > 0) {
        console.log('First publication:', publications[0]);
      }
      initPublicationsPagination(publications);
    })
    .catch(error => {
      console.error('Error loading publications:', error);
      document.getElementById('publications-container').innerHTML = `
        <div class="text-center">
          <i class="fas fa-exclamation-circle" style="font-size: 2rem; color: #ff6b6b; margin-bottom: 1rem;"></i>
          <h3>Error loading publications</h3>
          <p>Please try again later.</p>
        </div>
      `;
    });
}

// Parse markdown content to extract publications
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
      currentPublication = {
        title: line.replace('## ', '').trim(),
        details: '',
        url: '',
        date: ''
      };
    } else if (line.startsWith('http')) {
      // This is a URL
      if (currentPublication) {
        currentPublication.url = line.trim();
      }
    } else if (line.startsWith('Published') || line.startsWith('From') || line.includes('20')) {
      // This is likely a date or publication venue
      if (currentPublication) {
        currentPublication.date = line.trim();
      }
    } else if (currentPublication && !line.startsWith('#')) {
      // This is publication details
      currentPublication.details += currentPublication.details ? ' ' + line : line;
    }
  }
  
  // Don't forget to add the last publication
  if (currentPublication) {
    publications.push(currentPublication);
  }
  
  return publications;
}

// Initialize Bootstrap pagination for publications
function initPublicationsPagination(publications) {
  const container = document.getElementById('publications-container');
  
  if (!publications || publications.length === 0) {
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
    return;
  }
  
  // Define items per page
  const itemsPerPage = 4;
  const totalPages = Math.ceil(publications.length / itemsPerPage);
  
  console.log(`Creating publication pagination with ${publications.length} items across ${totalPages} pages`);
  
  // Create pagination structure if it doesn't exist
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
  
  const paginationList = paginationElement.querySelector('.pagination');
  paginationList.innerHTML = '';
  
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
  
  // Show the first page initially
  showPublicationsPage(publications, 1, itemsPerPage);
  
  // Add event listeners to pagination buttons
  const pageLinks = paginationList.querySelectorAll('.page-link');
  let currentPage = 1;
  
  pageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const pageData = link.getAttribute('data-page');
      
      if (pageData === 'prev') {
        if (currentPage > 1) {
          currentPage--;
          showPublicationsPage(publications, currentPage, itemsPerPage);
          updatePaginationActiveState(paginationList, currentPage);
        }
      } else if (pageData === 'next') {
        if (currentPage < totalPages) {
          currentPage++;
          showPublicationsPage(publications, currentPage, itemsPerPage);
          updatePaginationActiveState(paginationList, currentPage);
        }
      } else {
        currentPage = parseInt(pageData);
        showPublicationsPage(publications, currentPage, itemsPerPage);
        updatePaginationActiveState(paginationList, currentPage);
      }
      
      // Update prev/next buttons disabled state
      const prevButton = paginationList.querySelector('[data-page="prev"]').parentNode;
      const nextButton = paginationList.querySelector('[data-page="next"]').parentNode;
      
      prevButton.classList.toggle('disabled', currentPage === 1);
      nextButton.classList.toggle('disabled', currentPage === totalPages);
    });
  });
}

// Show specific page of publications
function showPublicationsPage(publications, page, itemsPerPage) {
  const container = document.getElementById('publications-container');
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, publications.length);
  
  console.log(`Showing publications page ${page}: items ${startIndex + 1} to ${endIndex} (of ${publications.length})`);
  
  let html = '';
  
  for (let i = startIndex; i < endIndex; i++) {
    const pub = publications[i];
    html += `
      <div class="publication-card mb-4">
        <h3>"${pub.title}"</h3>
        ${pub.date ? `<div class="publication-date mb-2"><i class="far fa-calendar-alt me-2"></i>${pub.date}</div>` : ''}
        <p>${pub.details}</p>
        <a href="${pub.url}" class="publication-link" target="_blank">
          <i class="fab fa-medium me-2"></i> Read on Medium
        </a>
      </div>
    `;
  }
  
  container.innerHTML = html;
}

// Update active state in pagination
function updatePaginationActiveState(paginationList, activePage) {
  const pageItems = paginationList.querySelectorAll('.page-item');
  
  pageItems.forEach(item => {
    const link = item.querySelector('.page-link');
    if (link) {
      const pageData = link.getAttribute('data-page');
      if (pageData !== 'prev' && pageData !== 'next') {
        item.classList.toggle('active', parseInt(pageData) === activePage);
      }
    }
  });
}

// Call the load function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing publications pagination');
  loadPublications();
}); 