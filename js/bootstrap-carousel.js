// Function to load certifications from JSON file
function loadCertifications() {
  console.log('Loading certifications with Bootstrap carousel...');
  fetch('assets/data/certifications.json')
    .then(response => {
      if (!response.ok) {
        console.error('Failed to load certifications - response not OK');
        throw new Error('Failed to load certifications');
      }
      return response.json();
    })
    .then(certifications => {
      console.log(`Found ${certifications.length} certification items`);
      initBootstrapCarousel(certifications);
    })
    .catch(error => {
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
    });
}

// Initialize the Bootstrap carousel with certification data
function initBootstrapCarousel(certifications) {
  if (!certifications || certifications.length === 0) {
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
    document.querySelector('.carousel-control-prev').style.display = 'none';
    document.querySelector('.carousel-control-next').style.display = 'none';
    document.querySelector('.carousel-indicators').style.display = 'none';
    return;
  }
  
  // Group certifications into slides (3 per slide)
  const itemsPerSlide = 3;
  const numberOfSlides = Math.ceil(certifications.length / itemsPerSlide);
  
  console.log(`Creating bootstrap carousel with ${certifications.length} items across ${numberOfSlides} slides`);
  
  const carouselInner = document.querySelector('.carousel-inner');
  const indicators = document.querySelector('.carousel-indicators');
  
  // Clear existing content
  carouselInner.innerHTML = '';
  indicators.innerHTML = '';
  
  // Create carousel slides
  for (let slideIndex = 0; slideIndex < numberOfSlides; slideIndex++) {
    // Calculate range for this slide
    const startIndex = slideIndex * itemsPerSlide;
    const endIndex = Math.min(startIndex + itemsPerSlide, certifications.length);
    
    console.log(`Slide ${slideIndex+1}: Items ${startIndex+1} to ${endIndex} (of ${certifications.length})`);
    
    // Create indicator button
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
    
    // Create carousel item
    const carouselItem = document.createElement('div');
    carouselItem.className = 'carousel-item';
    if (slideIndex === 0) {
      carouselItem.classList.add('active');
    }
    
    // Create row for the certifications (Bootstrap grid)
    const row = document.createElement('div');
    row.className = 'row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4';
    
    // Add certification items to this slide
    for (let certIndex = startIndex; certIndex < endIndex; certIndex++) {
      const cert = certifications[certIndex];
      
      // Format issue date if available
      let issueDateText = '';
      if (cert.issueDate) {
        try {
          const issueDate = new Date(cert.issueDate);
          issueDateText = issueDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
          });
        } catch (e) {
          issueDateText = cert.issueDate; // Use as is if parsing fails
        }
      }
      
      // Create column for grid layout
      const col = document.createElement('div');
      col.className = 'col';
      
      // Create certification item
      col.innerHTML = `
        <div class="cert-item">
          <a href="${cert.verifyUrl}" target="_blank" title="View certification">
            <img src="${cert.imageUrl}" alt="${cert.title}" 
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/500x300/ff9900/10002b?text=${encodeURIComponent(cert.title)}';" />
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
      
      row.appendChild(col);
    }
    
    carouselItem.appendChild(row);
    carouselInner.appendChild(carouselItem);
  }
  
  // Initialize Bootstrap carousel
  const carousel = new bootstrap.Carousel(document.getElementById('certificationsCarousel'), {
    interval: false, // No auto sliding
    wrap: true       // Continuous cycling
  });
  
  console.log('Bootstrap carousel setup complete');
}

// Remove the old carousel.js script if it's included
if (typeof setupCarousel === 'function') {
  console.log('Removing old carousel functions to prevent conflicts');
  setupCarousel = function() { 
    console.log('Old carousel function disabled'); 
  };
  initCarousel = function() { 
    console.log('Old carousel initialization disabled'); 
  };
}

// Call the load function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing certifications carousel');
  loadCertifications();
}); 