// Initialize when the page loads
window.onload = function () {
  // Add animation classes to elements
  document.querySelectorAll("section h2").forEach((heading) => {
    heading.classList.add("slide-in-left");
  });

  document.querySelectorAll(".card").forEach((card) => {
    card.classList.add("fade-in");
  });

  document.querySelector(".profile-image").classList.add("scale-in");
  document.querySelectorAll(".timeline-item").forEach((item) => {
    item.classList.add("slide-in-right");
  });

  // Initialize animations
  animateOnScroll();

  // Handle all images with error fallbacks
  const images = document.querySelectorAll("img");
  images.forEach(handleImageError);

  // Load publications from publications.md
  loadPublications();
  
  // Load certifications from JSON and initialize carousel
  loadCertifications();
  
  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear();
};

// Animation on scroll function
function animateOnScroll() {
  const elements = document.querySelectorAll(
    ".fade-in, .slide-in-left, .slide-in-right, .scale-in"
  );
  const skillTags = document.querySelectorAll(".skill-tag");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("appear");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });

  // Special observer for skill tags with staggered animation
  const skillObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        skillTags.forEach((tag, index) => {
          setTimeout(() => {
            tag.classList.add("appear");
          }, index * 100); // 100ms delay between each tag
        });
        skillObserver.unobserve(entries[0].target);
      }
    },
    { threshold: 0.5 }
  );

  if (skillTags.length > 0) {
    skillObserver.observe(document.querySelector(".skills"));
  }
}

// Handle image errors with a fallback
function handleImageError(img) {
  // Set fallback images if any image fails to load
  img.onerror = function () {
    if (img.id === "profile-img") {
      this.src =
        "https://via.placeholder.com/200x200/9d4edd/ffffff?text=Mateus+Nicolas";
    } else if (img.alt.includes("Real-time")) {
      this.src =
        "https://via.placeholder.com/800x450/9d4edd/ffffff?text=Real-time+Data+Processing";
    } else if (img.alt.includes("Cloud")) {
      this.src =
        "https://via.placeholder.com/800x450/5a189a/ffffff?text=Cloud+Data+Lake";
    } else if (img.alt.includes("ML")) {
      this.src =
        "https://via.placeholder.com/800x450/c77dff/10002b?text=ML+Feature+Engineering";
    } else if (img.alt.includes("AWS")) {
      this.src =
        "https://via.placeholder.com/500x300/ff9900/10002b?text=AWS+Certification";
    } else if (img.alt.includes("Google")) {
      this.src =
        "https://via.placeholder.com/500x300/5a189a/ffffff?text=Google+Cloud+Certification";
    } else if (img.alt.includes("Databricks")) {
      this.src =
        "https://via.placeholder.com/500x300/9d4edd/ffffff?text=Databricks+Certification";
    } else if (img.alt.includes("Kafka")) {
      this.src =
        "https://via.placeholder.com/500x300/10002b/ffffff?text=Kafka+Certification";
    } else {
      this.src =
        "https://via.placeholder.com/800x450/5a189a/ffffff?text=Project+Image";
    }
  };
  // Trigger error check
  img.src = img.src;
} 