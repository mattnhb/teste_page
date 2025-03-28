// Function to load publications from markdown file
function loadPublications() {
  fetch('assets/data/publications.md')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load publications');
      }
      return response.text();
    })
    .then(markdown => {
      const publications = parsePublicationsMarkdown(markdown);
      displayPublications(publications);
    })
    .catch(error => {
      console.error('Error loading publications:', error);
      document.getElementById('publications-container').innerHTML = `
        <li>
          <h3>Error loading publications</h3>
          <p>Please try again later.</p>
        </li>
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
        url: ''
      };
    } else if (line.startsWith('http')) {
      // This is a URL
      if (currentPublication) {
        currentPublication.url = line.trim();
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

// Display publications in the DOM
function displayPublications(publications) {
  const container = document.getElementById('publications-container');
  
  if (!publications || publications.length === 0) {
    container.innerHTML = `
      <li>
        <h3>No publications found</h3>
        <p>Check back later for updates.</p>
      </li>
    `;
    return;
  }
  
  let html = '';
  
  publications.forEach(pub => {
    html += `
      <li>
        <h3>"${pub.title}"</h3>
        <p>${pub.details}</p>
        <a href="${pub.url}" class="pdf-link" target="_blank">
          <i class="fab fa-medium"></i> Read on Medium
        </a>
      </li>
    `;
  });
  
  container.innerHTML = html;
} 