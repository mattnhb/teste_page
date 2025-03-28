// Function to load experience data from JSON file
function loadExperience() {
  console.log('Loading experience data from JSON...');
  fetch('assets/data/experience.json')
    .then(response => {
      if (!response.ok) {
        console.error('Failed to load experience data - response not OK');
        throw new Error('Failed to load experience data');
      }
      return response.json();
    })
    .then(experienceData => {
      console.log(`Found ${experienceData.length} experience items`);
      if (experienceData.length > 0) {
        console.log('First experience item:', experienceData[0]);
      }
      renderExperience(experienceData);
    })
    .catch(error => {
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
    });
}

// Render experience items to the DOM
function renderExperience(experienceData) {
  const container = document.getElementById('experience-container');
  
  if (!experienceData || experienceData.length === 0) {
    container.innerHTML = `
      <div class="loading-experience">
        <div class="text-center">
          <i class="fas fa-briefcase" style="font-size: 2rem; color: var(--primary); opacity: 0.5; margin-bottom: 1rem;"></i>
          <h3>No experience data found</h3>
          <p>Check back later for updates.</p>
        </div>
      </div>
    `;
    return;
  }
  
  let html = '<div class="experience-timeline">';
  
  experienceData.forEach(experience => {
    // Create technology tags HTML
    const techTags = experience.technologies.map(tech => 
      `<span class="experience-tech-tag">${tech}</span>`
    ).join('');
    
    // Create highlights HTML
    const highlights = experience.highlights && experience.highlights.length > 0 ?
      `
      <div class="experience-highlights">
        <h4>Key Achievements</h4>
        <ul>
          ${experience.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
        </ul>
      </div>
      ` : '';
    
    html += `
      <div class="experience-card">
        <span class="experience-period">${experience.period}</span>
        <h3 class="experience-role">${experience.role}</h3>
        <h4 class="experience-company">${experience.company}</h4>
        <p class="experience-description">${experience.description}</p>
        ${highlights}
        ${techTags ? `<div class="experience-tech">${techTags}</div>` : ''}
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
  
  // Add animation to reveal cards sequentially
  const cards = container.querySelectorAll('.experience-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease';
      card.style.opacity = '1';
    }, 100 * index);
  });
}

// Call the load function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing experience section');
  loadExperience();
}); 