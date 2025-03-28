// Import constants
import { ANIMATION, PLACEHOLDER_IMAGES, DEFAULT_IMAGES } from './constants.js';

// Initialize when the page loads
window.onload = function () {
  initializeAnimationClasses();
  initializeFeatures();
};

/**
 * Adds animation classes to various elements
 */
function initializeAnimationClasses() {
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
}

/**
 * Initialize all page features and components
 */
function initializeFeatures() {
  // Initialize animations
  animateOnScroll();

  // Handle all images with error fallbacks
  const images = document.querySelectorAll("img");
  images.forEach(handleImageError);

  // Set current year in footer
  setCurrentYear();
}

/**
 * Sets the current year in the footer copyright text
 */
function setCurrentYear() {
  document.getElementById("current-year").textContent = new Date().getFullYear();
}

/**
 * Handles scroll-based animations using Intersection Observer API
 */
function animateOnScroll() {
  animateGeneralElements();
  animateSkillTags();
}

/**
 * Animates general elements when they come into view
 */
function animateGeneralElements() {
  const elements = document.querySelectorAll(
    ".fade-in, .slide-in-left, .slide-in-right, .scale-in"
  );
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("appear");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: ANIMATION.SCROLL_THRESHOLD }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
}

/**
 * Animates skill tags with a staggered effect
 */
function animateSkillTags() {
  const skillTags = document.querySelectorAll(".skill-tag");
  
  if (skillTags.length === 0) return;
  
  const skillObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        applyStaggeredAnimation(skillTags);
        skillObserver.unobserve(entries[0].target);
      }
    },
    { threshold: ANIMATION.SKILLS_THRESHOLD }
  );

  skillObserver.observe(document.querySelector(".skills"));
}

/**
 * Applies a staggered animation to a collection of elements
 * @param {NodeList} elements - The elements to animate
 */
function applyStaggeredAnimation(elements) {
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add("appear");
    }, index * ANIMATION.SKILL_TAG_DELAY);
  });
}

/**
 * Sets a fallback image if the original image fails to load
 * @param {HTMLImageElement} img - The image element to handle
 */
function handleImageError(img) {
  img.onerror = function () {
    this.src = getAppropriateImageFallback(img);
  };
  
  // Trigger error check
  img.src = img.src;
}

/**
 * Determines the appropriate fallback image based on the image context
 * @param {HTMLImageElement} img - The image element
 * @returns {string} The URL for the fallback image
 */
function getAppropriateImageFallback(img) {
  if (img.id === "profile-img") {
    return DEFAULT_IMAGES.PROFILE;
  }
  
  const altText = img.alt.toLowerCase();
  
  if (altText.includes("real-time")) {
    return `https://via.placeholder.com/${PLACEHOLDER_IMAGES.PROJECT}/9d4edd/ffffff?text=Real-time+Data+Processing`;
  } else if (altText.includes("cloud")) {
    return `https://via.placeholder.com/${PLACEHOLDER_IMAGES.PROJECT}/5a189a/ffffff?text=Cloud+Data+Lake`;
  } else if (altText.includes("ml")) {
    return `https://via.placeholder.com/${PLACEHOLDER_IMAGES.PROJECT}/c77dff/10002b?text=ML+Feature+Engineering`;
  } else if (altText.includes("aws")) {
    return `https://via.placeholder.com/${PLACEHOLDER_IMAGES.CERTIFICATION}/ff9900/10002b?text=AWS+Certification`;
  } else if (altText.includes("google")) {
    return `https://via.placeholder.com/${PLACEHOLDER_IMAGES.CERTIFICATION}/5a189a/ffffff?text=Google+Cloud+Certification`;
  } else if (altText.includes("databricks")) {
    return `https://via.placeholder.com/${PLACEHOLDER_IMAGES.CERTIFICATION}/9d4edd/ffffff?text=Databricks+Certification`;
  } else if (altText.includes("kafka")) {
    return `https://via.placeholder.com/${PLACEHOLDER_IMAGES.CERTIFICATION}/10002b/ffffff?text=Kafka+Certification`;
  } else {
    return `https://via.placeholder.com/${PLACEHOLDER_IMAGES.PROJECT}/5a189a/ffffff?text=Project+Image`;
  }
} 