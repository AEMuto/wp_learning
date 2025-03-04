/**
 * Card class to manage individual testimony cards
 */
class SerinityCarouselCard {
  /**
   * Constructor for TestimonyCard
   * @param {HTMLElement} element - The card element
   * @param {Object} options - Options for the card
   */
  constructor(element, options = {}) {
      this.element = element;
      this.options = options;
      
      // Initialize states
      this.opacity = options.randomOpacity ? Math.random() * 0.5 + 0.5 : 1;
      this.blur = 0;
      this.timeCounter = Math.random() * 100; // Random starting point for time-based animation
      this.timeSpeed = 0.02 + (Math.random() * 0.03); // Random speed for time-based animation
      
      // Apply initial styles
      this.updateAppearance();
  }
  
  /**
   * Update card based on its position in the container
   * @param {number} containerLeft - Left edge of container
   * @param {number} containerRight - Right edge of container
   * @param {number} fadeZoneWidth - Width of the fade zone
   */
  updatePositionOpacity(containerLeft, containerRight, fadeZoneWidth) {
      // Calculate element's current position relative to container
      const rect = this.element.getBoundingClientRect();
      const containerRect = this.element.parentElement.parentElement.getBoundingClientRect();
      const left = rect.left - containerRect.left;
      const right = rect.right - containerRect.left;
      
      // Skip if element is completely outside the container
      if (right < 0 || left > containerRight) {
          this.positionOpacity = 0.2;
          return;
      }
      
      // Calculate opacity based on position in fade zones
      let positionOpacity = 1;
      
      // Left fade zone
      if (left < fadeZoneWidth) {
          positionOpacity = 0.2 + (0.8 * (left / fadeZoneWidth));
      }
      // Right fade zone
      else if (right > containerRight - fadeZoneWidth) {
          positionOpacity = 0.2 + (0.8 * ((containerRight - right) / fadeZoneWidth));
      }
      
      this.positionOpacity = Math.max(0.2, Math.min(1, positionOpacity));
      this.updateAppearance();
  }
  
  /**
   * Update the time-based animation state
   */
  updateTimeState() {
      // Increment time counter
      this.timeCounter += this.timeSpeed;
      if (this.timeCounter > 100) this.timeCounter = 0;
      
      // Calculate sine wave oscillation for organic feel
      const wave = Math.sin(this.timeCounter * 0.1);
      
      // Update time-based states
      this.timeOpacity = 0.7 + (wave * 0.3); // Oscillate between 0.4 and 1.0
      this.blur = Math.abs(wave) * 1.5; // Oscillate between 0 and 1.5px blur
      
      this.updateAppearance();
  }
  
  /**
   * Update the visual appearance of the card
   */
  updateAppearance() {
      // Calculate final opacity from both position and time factors
      const finalOpacity = (this.positionOpacity || 1) * (this.timeOpacity || 1) * this.opacity;
      this.element.style.opacity = Math.max(0.2, Math.min(1, finalOpacity)).toString();
      
      // Apply blur effect
      if (this.blur > 0) {
          this.element.style.filter = `blur(${this.blur}px)`;
      } else {
          this.element.style.filter = 'none';
      }
  }
  
  /**
   * Handle hover state
   * @param {boolean} isHovering - Whether the card is being hovered
   */
  setHover(isHovering) {
      if (isHovering) {
          this.element.style.opacity = '1';
          this.element.style.filter = 'none';
          this.element.style.transform = 'translateY(-5px)';
          this.element.style.zIndex = '5';
      } else {
          this.updateAppearance();
          this.element.style.transform = '';
          this.element.style.zIndex = '';
      }
  }
}

/**
* Enhanced Testimony Carousel for Serinity Theme
*/
export class SerinityCarousel {
  /**
   * Constructor for the TestimonyCarousel
   * @param {HTMLElement} container - The container element for this carousel
   * @param {Object} options - Configuration options
   */
  constructor(container, options = {}) {
      this.container = container;
      this.options = {
          direction: 'left',       // 'left' or 'right'
          speed: 0.5,              // Pixels per frame
          randomOpacity: false,    // Randomize initial opacity
          timeBasedAnimation: true, // Enable time-based animation
          ...options
      };
      
      // Set scroll speed based on direction
      this.scrollSpeed = this.options.direction === 'right' ? -this.options.speed : this.options.speed;
      
      this.isPaused = false;
      this.animationId = null;
      
      // Initialize the carousel
      this.init();
  }
  
  /**
   * Initialize the carousel
   */
  init() {
      // Set up the container styling
      this.setupContainer();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Start the animation
      this.startAnimation();
  }
  
  /**
   * Set up the container with necessary CSS properties
   */
  setupContainer() {
      // Set container style
      this.container.style.width = '100vw';
      this.container.style.maxWidth = '100%';
      this.container.style.overflowX = 'hidden';
      this.container.style.overflowY = 'hidden';
      this.container.style.position = 'relative';
      this.container.style.margin = '0 calc(-50vw + 50%)';
      this.container.style.left = '0';
      
      // Create inner wrapper for scrolling
      this.scrollWrapper = document.createElement('div');
      this.scrollWrapper.className = 'serinity-testimonies-wrapper';
      this.scrollWrapper.style.display = 'flex';
      this.scrollWrapper.style.position = 'relative';
      
      // Store container dimensions
      this.containerWidth = this.container.offsetWidth;
      this.fadeZoneWidth = Math.min(this.containerWidth * 0.15, 100);
      
      // Get all testimonies
      const testimonies = Array.from(this.container.querySelectorAll('.serinity-testimony'));
      
      // Store the original testimonies
      this.originalTestimonies = testimonies;
      
      // Move all testimonies to the wrapper
      testimonies.forEach(testimony => {
          testimony.style.flexShrink = '0';
          testimony.style.margin = '0 15px';
          testimony.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
          this.scrollWrapper.appendChild(testimony);
      });
      
      // Add the wrapper back to the container
      this.container.appendChild(this.scrollWrapper);
      
      // Create clones for the infinite scroll
      this.createClones();
      
      // Calculate dimensions
      this.calculateDimensions();
      
      // Create card objects for each testimony
      this.initializeCards();
  }
  
  /**
   * Create clones for infinite scrolling
   */
  createClones() {
      // Two sets of clones - one at the beginning and one at the end
      this.originalTestimonies.forEach(testimony => {
          const preClone = testimony.cloneNode(true);
          preClone.setAttribute('aria-hidden', 'true');
          preClone.classList.add('testimony-clone');
          this.scrollWrapper.insertBefore(preClone, this.scrollWrapper.firstChild);
          
          const postClone = testimony.cloneNode(true);
          postClone.setAttribute('aria-hidden', 'true');
          postClone.classList.add('testimony-clone');
          this.scrollWrapper.appendChild(postClone);
      });
      
      // Get all testimonies including clones
      this.allTestimonies = Array.from(this.scrollWrapper.querySelectorAll('.serinity-testimony'));
  }
  
  /**
   * Initialize card objects for each testimony
   */
  initializeCards() {
      this.cards = this.allTestimonies.map(testimony => {
          const card = new SerinityCarouselCard(testimony, {
              randomOpacity: this.options.randomOpacity
          });
          
          // Add hover listeners
          testimony.addEventListener('mouseenter', () => {
              card.setHover(true);
          });
          
          testimony.addEventListener('mouseleave', () => {
              card.setHover(false);
          });
          
          return card;
      });
  }
  
  /**
   * Calculate dimensions needed for the animation
   */
  calculateDimensions() {
      // Calculate single set width
      this.singleSetWidth = this.originalTestimonies.reduce((width, testimony) => {
          const style = window.getComputedStyle(testimony);
          const marginLeft = parseFloat(style.marginLeft || '0');
          const marginRight = parseFloat(style.marginRight || '0');
          return width + testimony.offsetWidth + marginLeft + marginRight;
      }, 0);
      
      // Start position at one set width
      this.scrollPosition = this.singleSetWidth;
      
      // Apply initial position
      this.scrollWrapper.style.transform = `translateX(-${this.scrollPosition}px)`;
      
      // Get center point of container for opacity calculations
      this.containerCenter = this.container.offsetWidth / 2;
  }
  
  /**
   * Set up event listeners
   */
  setupEventListeners() {
      // Pause on hover/touch
      this.container.addEventListener('mouseenter', () => {
          this.isPaused = true;
      });
      
      this.container.addEventListener('mouseleave', () => {
          this.isPaused = false;
      });
      
      this.container.addEventListener('touchstart', () => {
          this.isPaused = true;
      });
      
      this.container.addEventListener('touchend', () => {
          this.isPaused = false;
      });
      
      // Pause when tab is inactive
      document.addEventListener('visibilitychange', () => {
          this.isPaused = document.hidden;
      });
      
      // Handle resize
      window.addEventListener('resize', () => {
          this.containerWidth = this.container.offsetWidth;
          this.fadeZoneWidth = Math.min(this.containerWidth * 0.15, 100);
          this.containerCenter = this.containerWidth / 2;
          this.calculateDimensions();
          this.updateCardAppearance();
      });
  }
  
  /**
   * Update appearance of all cards
   */
  updateCardAppearance() {
      const containerLeft = 0;
      const containerRight = this.containerWidth;
      
      this.cards.forEach(card => {
          card.updatePositionOpacity(containerLeft, containerRight, this.fadeZoneWidth);
          
          if (this.options.timeBasedAnimation) {
              card.updateTimeState();
          }
      });
  }
  
  /**
   * Start the animation loop
   */
  startAnimation() {
      // Time-based animation counter
      let timeCounter = 0;
      
      const animate = () => {
          if (!this.isPaused) {
              // Increment scroll position
              this.scrollPosition += this.scrollSpeed;
              
              // Check for reset
              if (this.scrollSpeed > 0 && this.scrollPosition >= this.singleSetWidth * 2) {
                  // Reset when scrolling left
                  this.scrollPosition = this.singleSetWidth;
              } else if (this.scrollSpeed < 0 && this.scrollPosition <= 0) {
                  // Reset when scrolling right
                  this.scrollPosition = this.singleSetWidth;
              }
              
              // Apply the transform
              this.scrollWrapper.style.transform = `translateX(-${this.scrollPosition}px)`;
              
              // Update card appearances
              this.updateCardAppearance();
              
              // Increment time counter
              timeCounter++;
          }
          
          // Continue animation
          this.animationId = requestAnimationFrame(animate);
      };
      
      // Start animation
      this.animationId = requestAnimationFrame(animate);
  }
  
  /**
   * Stop animation and clean up
   */
  destroy() {
      if (this.animationId) {
          cancelAnimationFrame(this.animationId);
      }
  }
}

/**
* Initialize carousels with a selector and options
* @param {string} selector - CSS selector for carousel containers
* @param {Object} options - Configuration options
*/
export function initCarousels(selector, options = {}) {
  const containers = document.querySelectorAll(selector);
  
  if (containers.length === 0) return [];
  
  const carousels = [];
  containers.forEach(container => {
      carousels.push(new SerinityCarousel(container, options));
  });
  
  return carousels;
}