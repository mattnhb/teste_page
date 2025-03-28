// Function to load certifications from JSON file
function loadCertifications() {
  console.log('Loading certifications from JSON...');
  fetch('assets/data/certifications.json')
    .then(response => {
      if (!response.ok) {
        console.error('Failed to load certifications - response not OK');
        throw new Error('Failed to load certifications');
      }
      return response.json();
    })
    .then(certifications => {
      console.log("Loaded certifications:", certifications);
      console.log(`Found ${certifications.length} certification items`);
      if (certifications.length > 0) {
        console.log('First certification:', certifications[0]);
      }
      initCarousel(certifications);
    })
    .catch(error => {
      console.error('Error loading certifications:', error);
      document.querySelector('.carousel-track').innerHTML = `
        <div class="loading-slide">
          <div class="loading-content">
            <h3>Error loading certifications</h3>
            <p>Please try again later.</p>
            <div class="loading-indicator">
              <i class="fas fa-exclamation-circle" style="font-size: 2rem; color: #ff6b6b;"></i>
            </div>
          </div>
        </div>
      `;
    });
}

// Initialize the carousel with certification data
function initCarousel(certifications) {
  const carouselTrack = document.querySelector('.carousel-track');
  const navContainer = document.querySelector('.carousel-nav');
  
  // Clear placeholder content
  carouselTrack.innerHTML = '';
  navContainer.innerHTML = '';
  
  if (!certifications || certifications.length === 0) {
    carouselTrack.innerHTML = `
      <div class="loading-slide">
        <div class="loading-content">
          <h3>No certifications found</h3>
          <p>Check back later for updates.</p>
          <div class="loading-indicator">
            <i class="fas fa-certificate" style="font-size: 2rem; color: var(--primary); opacity: 0.5;"></i>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // Group certifications into slides of 3
  const itemsPerSlide = 3;
  const numberOfSlides = Math.ceil(certifications.length / itemsPerSlide);
  
  console.log(`Creating carousel with ${certifications.length} items across ${numberOfSlides} slides`);
  
  // Create slides
  for(let slideIndex = 0; slideIndex < numberOfSlides; slideIndex++) {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    
    // Calculate range for this slide
    const startIndex = slideIndex * itemsPerSlide;
    const endIndex = Math.min(startIndex + itemsPerSlide, certifications.length);
    
    console.log(`Slide ${slideIndex+1}: Items ${startIndex+1} to ${endIndex} (of ${certifications.length})`);
    
    // Add certification items to this slide
    for(let certIndex = startIndex; certIndex < endIndex; certIndex++) {
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
      
      const certItem = document.createElement('div');
      certItem.className = 'carousel-slide-content';
      certItem.innerHTML = `
        <a href="${cert.verifyUrl}" target="_blank" title="Click to verify certification">
          <img src="${cert.imageUrl}" alt="${cert.title}" 
               onerror="this.onerror=null; this.src='https://via.placeholder.com/500x300/ff9900/10002b?text=${encodeURIComponent(cert.title)}';" />
        </a>
        <div class="cert-info">
          <a href="${cert.verifyUrl}" target="_blank" title="Click to verify certification" style="text-decoration: none;">
            <h3>${cert.title}</h3>
          </a>
          ${cert.organization ? `<div class="cert-issuer"><i class="fas fa-building"></i> ${cert.organization}</div>` : ''}
          ${issueDateText ? `<div class="cert-date"><i class="fas fa-calendar-alt"></i> ${issueDateText}</div>` : ''}
        </div>
      `;
      
      slide.appendChild(certItem);
    }
    
    carouselTrack.appendChild(slide);
    
    // Create navigation dot
    const dot = document.createElement('div');
    dot.className = 'carousel-dot';
    if (slideIndex === 0) dot.classList.add('active');
    dot.dataset.index = slideIndex;
    navContainer.appendChild(dot);
  }
  
  // Add counter
  const counter = document.createElement('div');
  counter.className = 'carousel-counter';
  counter.textContent = `1 of ${numberOfSlides}`;
  
  // Add prev/next buttons
  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-btn prev';
  prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  
  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-btn next';
  nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
  nextBtn.setAttribute('aria-label', 'Next slide');
  
  const carouselContainer = document.querySelector('.carousel-container');
  carouselContainer.appendChild(counter);
  carouselContainer.appendChild(prevBtn);
  carouselContainer.appendChild(nextBtn);
  
  // Initialize carousel functionality
  setupCarousel();
}

// Set up carousel navigation and controls
function setupCarousel() {
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const nextButton = document.querySelector('.carousel-btn.next');
  const prevButton = document.querySelector('.carousel-btn.prev');
  const dotsNav = document.querySelector('.carousel-nav');
  const dots = Array.from(dotsNav.children);
  const carouselContainer = document.querySelector('.carousel-container');
  const counter = document.querySelector('.carousel-counter');
  
  if (slides.length <= 1) {
    // Hide navigation if only one slide
    nextButton.style.display = 'none';
    prevButton.style.display = 'none';
    dotsNav.style.display = 'none';
    counter.style.display = 'none';
    return;
  }
  
  console.log(`Carousel setup: ${slides.length} slides detected`);
  
  // Set the width of track based on the number of slides
  const slideWidth = slides[0].getBoundingClientRect().width;
  track.style.width = slideWidth * slides.length + 'px';
  
  // Position slides next to one another
  slides.forEach((slide, index) => {
    slide.style.left = slideWidth * index + 'px';
    console.log(`Positioned slide ${index+1} at ${slideWidth * index}px`);
  });

  // Track the current slide
  let currentSlideIndex = 0;
  
  const moveToSlide = (targetIndex) => {
    // Ensure targetIndex is within bounds
    if (targetIndex < 0) targetIndex = slides.length - 1;
    if (targetIndex >= slides.length) targetIndex = 0;
    
    console.log(`Moving to slide ${targetIndex + 1} of ${slides.length}`);
    
    currentSlideIndex = targetIndex;
    
    // Move the track to the target slide
    track.style.transform = `translateX(-${slideWidth * targetIndex}px)`;
    
    // Update active dot
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === targetIndex);
    });
    
    // Update counter
    if (counter) {
      counter.textContent = `${targetIndex + 1} of ${slides.length}`;
    }
    
    // Update ARIA attributes for accessibility
    slides.forEach((slide, index) => {
      const isCurrentSlide = index === targetIndex;
      slide.setAttribute('aria-hidden', !isCurrentSlide);
      
      // Make links in inactive slides unfocusable
      const focusableElements = slide.querySelectorAll('a, button');
      focusableElements.forEach(el => {
        el.setAttribute('tabindex', isCurrentSlide ? '0' : '-1');
      });
    });
  };
  
  // Move to next slide
  const moveToNextSlide = () => {
    moveToSlide(currentSlideIndex + 1);
  };
  
  // Move to previous slide
  const moveToPrevSlide = () => {
    moveToSlide(currentSlideIndex - 1);
  };
  
  // Add click event listeners
  prevButton.addEventListener('click', (e) => {
    e.preventDefault();
    moveToPrevSlide();
  });
  
  nextButton.addEventListener('click', (e) => {
    e.preventDefault();
    moveToNextSlide();
  });
  
  // When I click the nav indicators, move to that slide
  dotsNav.addEventListener('click', e => {
    const targetDot = e.target.closest('div.carousel-dot');
    if (!targetDot) return;
    
    const targetIndex = parseInt(targetDot.dataset.index);
    moveToSlide(targetIndex);
  });
  
  // Touch swipe functionality
  let touchStartX = 0;
  let touchEndX = 0;
  
  carouselContainer.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  carouselContainer.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance required for a swipe
    
    if (touchEndX + swipeThreshold < touchStartX) {
      moveToNextSlide();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      moveToPrevSlide();
    }
  }
  
  // Keyboard navigation
  carouselContainer.setAttribute('tabindex', '0');
  carouselContainer.setAttribute('role', 'region');
  carouselContainer.setAttribute('aria-label', 'Certifications carousel');
  
  carouselContainer.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      moveToPrevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      moveToNextSlide();
    }
  });
  
  // Make dots keyboard navigable
  dots.forEach((dot, index) => {
    dot.setAttribute('tabindex', '0');
    dot.setAttribute('role', 'button');
    dot.setAttribute('aria-label', `Show certifications group ${index + 1}`);
    
    dot.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        moveToSlide(index);
      }
    });
  });
  
  // Set initial state
  moveToSlide(0);
  
  console.log('Carousel setup complete - manual navigation only');
} 